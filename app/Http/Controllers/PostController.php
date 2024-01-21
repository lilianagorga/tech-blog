<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Post;
use App\Models\PostView;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class PostController extends Controller
{
  public function index(Request $request): Response
  {
    $query = Post::with('categories', 'user')
      ->where('active', true)
      ->whereDate('published_at', '<=', now());
    if ($request->has('category')) {
      $query->whereHas('categories', function ($q) use ($request) {
        $q->where('slug', $request->category);
      });
    }
    if ($request->has('user_id')) {
      $query->where('user_id', $request->user_id);
    }
    if ($request->has('q')) {
      $query->where(function ($q) use ($request) {
        $q->where('title', 'like', '%' . $request->q . '%')
          ->orWhere('body', 'like', '%' . $request->q . '%');
      });
    }
    if ($request->has('sort')) {
      $sortOrder = $request->get('order', 'desc');
      $query->orderBy($request->sort, $sortOrder);
    } else {
      $query->orderBy('published_at', 'desc');
    }

    $posts = $query->paginate(10);
    return response()->json($posts);
  }

  public function show(Post $post): Response
  {
    if (!$post->active || $post->published_at > now()) {
      return response()->json(['message' => 'Post not found'], Response::HTTP_NOT_FOUND);
    }
    return response()->json($post);
  }
  public function store(Request $request): Response
  {
    $validatedData = $request->validate([
      'title' => 'required|max:2048',
      'slug' => 'required|max:2048|unique:posts,slug',
      'thumbnail' => 'nullable|url|max:2048',
      'body' => 'required',
      'active' => 'required|boolean',
      'published_at' => 'nullable|date',
    ]);

    if (auth()->check()) {
      $validatedData['user_id'] = auth()->id();
    }
    $validatedData['published_at'] = $validatedData['published_at'] ?? now();
    $post = Post::create($validatedData);

    if ($request->has('categories') && is_array($request->categories) && !empty($request->categories)) {
      $validCategoryIds = Category::whereIn('id', $request->categories)->pluck('id')->all();

      $post->categories()->sync($validCategoryIds);
    }

    return response()->json($post, Response::HTTP_CREATED);
  }
  public function update(Request $request, Post $post): Response
  {

    if (!$request->user()->canManagePosts() && $request->user()->id !== $post->user_id) {
      return response()->json(['message' => 'Unauthorized'], Response::HTTP_UNAUTHORIZED);
    }

    $validatedData = $request->validate([
      'title' => 'required|max:2048',
      'slug' => 'required|max:2048|unique:posts,slug,' . $post->id,
      'thumbnail' => 'nullable|url|max:2048',
      'body' => 'required',
      'active' => 'required|boolean',
      'published_at' => 'nullable|date',
    ]);

    $post->update($validatedData);

    return response()->json($post);
  }

  public function destroy(Request $request, Post $post): Response
  {
    if ($request->user()->canManagePosts() || $request->user()->id === $post->user_id) {
      $post->delete();
      return response()->json(null, Response::HTTP_NO_CONTENT);
    }

    return response()->json(['message' => 'Unauthorized'], Response::HTTP_UNAUTHORIZED);
  }

  public function byCategory(Category $category): Response
  {
    $posts = Post::query()->join('category_post', 'posts.id', '=', 'category_post.post_id')
      ->where('category_post.category_id', '=', $category->id)->where('active', '=', true)
      ->whereDate('published_at', '<=', Carbon::now())->orderBy('published_at', 'desc')
      ->paginate(10);

    return response()->json($posts);
  }

  public function search(Request $request): Response
  {
    $query = $request->get('q');
    $posts = Post::where('active', true)->whereDate('published_at', '<=', Carbon::now())->orderBy('published_at', 'desc')->where(function ($q) use ($query) {
        $q->where('title', 'like', "%$query%")->orWhere('body', 'like', "%$query%");
    })->paginate(10);
    return response()->json($posts);
  }
}
