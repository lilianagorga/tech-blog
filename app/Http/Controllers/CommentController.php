<?php

namespace App\Http\Controllers;

use App\Http\Requests\CommentRequest;
use App\Models\Comment;
use App\Models\Post;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class CommentController extends Controller
{
  public function index(): JsonResponse
  {
    $comments = Comment::with(['user', 'post', 'comments'])->orderByDesc('created_at')->get();
    return response()->json($comments);
  }

  public function store(CommentRequest $request): JsonResponse
  {
    $user = $request->user();

    if (!$user) {
      return response()->json(['message' => 'Unauthorized'], Response::HTTP_UNAUTHORIZED);
    }

    $commentData = $request->validated();

    if ($request->has('comment_id')) {
      $comment = Comment::find($request->input('comment_id'));

      if (!$comment || $comment->user_id != $user->id) {
        return response()->json(['message' => 'Forbidden'], Response::HTTP_FORBIDDEN);
      }

      $comment->update(['comment' => $commentData['comment']]);
    } else {
      $comment = new Comment($commentData);
      $comment->user_id = $user->id;
      if ($request->has('parent_id')) {
        $comment->parent_id = $request->input('parent_id');
      }
      $comment->save();
    }

    return response()->json($comment, Response::HTTP_CREATED);
  }

  public function update(CommentRequest $request, Comment $comment): JsonResponse
  {
    $user = $request->user();

    if ($comment->user_id != $user->id) {
      return response()->json(['message' => 'Unauthorized'], Response::HTTP_UNAUTHORIZED);
    }
    $comment->update($request->validated());
    return response()->json(['message' => 'Comment updated successfully', 'comment' => $comment]);
  }
  public function showCommentsForPost($postId): JsonResponse
  {
    $comments = Comment::where('post_id', '=', $postId)
      ->with(['user', 'comments'])
      ->whereNull('parent_id')
      ->orderByDesc('created_at')
      ->get();

    return response()->json($comments);
  }

  public function destroy(CommentRequest $request, Comment $comment): JsonResponse
  {
    $user = $request->user();

    if (!$user) {
      return response()->json(['message' => 'Unauthorized'], Response::HTTP_UNAUTHORIZED);
    }

    if ($comment->user_id != $user->id) {
      return response()->json(['message' => 'You are not allowed to perform this action'], Response::HTTP_FORBIDDEN);
    }

    $comment->delete();
    return response()->json(['message' => 'Comment deleted successfully']);
  }

}
