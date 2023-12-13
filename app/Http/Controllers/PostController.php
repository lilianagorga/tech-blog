<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class PostController extends Controller
{
    public function index(): Response
    {
      $posts = Post::all();
      return response()->json($posts);
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

    $post = Post::create($validatedData);
    return response()->json($post, Response::HTTP_CREATED);
  }

  public function show(Post $post): Response
  {
    return response()->json($post);
  }

  public function update(Request $request, Post $post): Response
  {
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

  public function destroy(Post $post): Response
  {
    $post->delete();

    return response()->json(null, Response::HTTP_NO_CONTENT);
  }



}
