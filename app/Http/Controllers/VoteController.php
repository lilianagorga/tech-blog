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

//  protected function vote(Request $request, $postId, $isUpvote): JsonResponse
//  {
//    $user = $request->user();
//
//    if (!$user || !$user->hasVerifiedEmail()) {
//      return response()->json(['message' => 'Unauthorized'], Response::HTTP_UNAUTHORIZED);
//    }
//
//    $vote = Vote::where('post_id', $postId)
//      ->where('user_id', $user->id)
//      ->first();
//
//    if ($vote) {
//      if (($isUpvote && $vote->is_upvote) || (!$isUpvote && !$vote->is_upvote)) {
//        $vote->delete();
//      } else {
//        $vote->is_upvote = $isUpvote;
//        $vote->save();
//      }
//    } else {
//      Vote::create([
//        'is_upvote' => $isUpvote,
//        'post_id' => $postId,
//        'user_id' => $user->id
//      ]);
//    }
//
//    return response()->json(['message' => 'Vote recorded']);
//  }

  public function vote(Request $request, $postId, $vote): JsonResponse
  {
    $user = $request->user();
    if (!$user || !$user->hasVerifiedEmail()) {
      return response()->json(['message' => 'Unauthorized'], Response::HTTP_UNAUTHORIZED);
    }

    $vote = strtolower($vote);
    if (!in_array($vote, ['up', 'down'])) {
      return response()->json(['message' => 'Invalid vote'], Response::HTTP_BAD_REQUEST);
    }

    $existingVote = Vote::where('post_id', $postId)
      ->where('user_id', $user->id)
      ->first();

    if ($existingVote) {
      if ($existingVote->vote === $vote) {
        $existingVote->delete();
      } else {
        $existingVote->vote = $vote;
        $existingVote->save();
      }
    } else {
      Vote::create([
        'vote' => $vote,
        'post_id' => $postId,
        'user_id' => $user->id
      ]);
    }

    return response()->json(['message' => 'Vote recorded']);
  }
}

