<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Vote;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class VoteController extends Controller
{
  public function store(Request $request, $type): JsonResponse
  {
    $user = $request->user();
    $postId = $request->input('post_id');
    if (!$user || !$user->hasVerifiedEmail()) {
      return response()->json(['message' => 'Unauthorized'], Response::HTTP_UNAUTHORIZED);
    }

    $type = strtolower($type);
    if (!in_array($type, ['up', 'down'])) {
      return response()->json(['message' => 'Invalid vote'], Response::HTTP_BAD_REQUEST);
    }

    $existingVote = Vote::where('post_id', $postId)
      ->where('user_id', $user->id)
      ->first();

    if ($existingVote) {
      return response()->json(['message' => 'Vote existing'], Response::HTTP_UNPROCESSABLE_ENTITY);
    }

    $vote = Vote::create([
      'type' => $type,
      'post_id' => $postId,
      'user_id' => $user->id
    ]);

    return response()->json([
      'vote' => $vote,
      'upVote_count' => $this->getVoteCounts($postId)['upVote_count'],
      'downVote_count' => $this->getVoteCounts($postId)['downVote_count']
    ], Response::HTTP_CREATED);

  }

  public function update(Request $request, $id): JsonResponse
  {
    $user = $request->user();
    if (!$user || !$user->hasVerifiedEmail()) {
      return response()->json(['message' => 'Unauthorized'], Response::HTTP_UNAUTHORIZED);
    }

    $type = $request->input('type');
    $type = strtolower($type);
    if (!in_array($type, ['up', 'down'])) {
      return response()->json(['message' => 'Invalid vote type'], Response::HTTP_BAD_REQUEST);
    }

    $vote = Vote::where('id', $id)->where('user_id', $user->id)->first();
    if (!$vote) {
      return response()->json(['message' => 'Vote not found'], Response::HTTP_NOT_FOUND);
    }

    $vote->update(['type' => $type]);
    return response()->json([
      'message' => 'Vote updated',
      'vote' => $vote,
      'upVote_count' => $this->getVoteCounts($vote->post_id)['upVote_count'],
      'downVote_count' => $this->getVoteCounts($vote->post_id)['downVote_count']
    ]);
  }


  public function destroy(Request $request, $id): JsonResponse
  {
    $user = $request->user();
    if (!$user || !$user->hasVerifiedEmail()) {
      return response()->json(['message' => 'Unauthorized'], Response::HTTP_UNAUTHORIZED);
    }

    $vote = Vote::where('id', $id)->where('user_id', $user->id)->first();
    if (!$vote) {
      return response()->json(['message' => 'Vote not found'], Response::HTTP_NOT_FOUND);
    }

    $vote->delete();

    return response()->json(null, Response::HTTP_NO_CONTENT);
  }

  private function getVoteCounts($postId): array
  {
    return [
      'upVote_count' => Vote::where('post_id', $postId)->where('type', 'up')->count(),
      'downVote_count' => Vote::where('post_id', $postId)->where('type', 'down')->count()
    ];
  }

}

