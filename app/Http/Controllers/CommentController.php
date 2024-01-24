<?php

namespace App\Http\Controllers;

use App\Http\Requests\CommentRequest;
use App\Models\Comment;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class CommentController extends Controller
{
  public function index(): JsonResponse
  {
    $comments = Comment::with(['user', 'post'])->orderByDesc('created_at')->get();
    return response()->json($comments);
  }
  public function store(CommentRequest $request): JsonResponse
  {
    $user = $request->user();

    if (!$user) {
      return response()->json(['message' => 'Unauthorized'], Response::HTTP_UNAUTHORIZED);
    }

    $commentData = $request->validated();
    $comment = new Comment($commentData);
    $comment->user_id = $user->id;
    $comment->post_id = $commentData['post_id'];
    $comment->save();

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
      ->with(['user'])
      ->orderByDesc('created_at')
      ->get();

    return response()->json($comments);
  }

  public function destroy(Request $request, Comment $comment): JsonResponse
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
