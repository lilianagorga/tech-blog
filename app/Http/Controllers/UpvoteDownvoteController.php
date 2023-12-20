<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\UpvoteDownvote;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class UpvoteDownvoteController extends Controller
{
  public function upvote(Request $request, $postId): JsonResponse
  {
    return $this->vote($request, $postId, true);
  }

  public function downvote(Request $request, $postId): JsonResponse
  {
    return $this->vote($request, $postId, false);
  }

  protected function vote(Request $request, $postId, $isUpvote): JsonResponse
  {
    $user = $request->user();

    if (!$user || !$user->hasVerifiedEmail()) {
      return response()->json(['message' => 'Unauthorized'], Response::HTTP_UNAUTHORIZED);
    }

    $vote = UpvoteDownvote::where('post_id', $postId)
      ->where('user_id', $user->id)
      ->first();

    if ($vote) {
      if (($isUpvote && $vote->is_upvote) || (!$isUpvote && !$vote->is_upvote)) {
        $vote->delete();
      } else {
        $vote->is_upvote = $isUpvote;
        $vote->save();
      }
    } else {
      UpvoteDownvote::create([
        'is_upvote' => $isUpvote,
        'post_id' => $postId,
        'user_id' => $user->id
      ]);
    }

    return response()->json(['message' => 'Vote recorded']);
  }
}
