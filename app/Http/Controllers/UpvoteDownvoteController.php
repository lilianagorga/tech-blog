<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\UpvoteDownvote;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

// class VoteController extends Controller
class UpvoteDownvoteController extends Controller
{
//  public function vote(Request $request, $postId): JsonResponse
  public function upvote(Request $request, $postId): JsonResponse
  {
    return $this->vote($request, $postId, true);
  }

//  cancella questo
  public function downvote(Request $request, $postId): JsonResponse
  {
    return $this->vote($request, $postId, false);
  }

  protected function vote(Request $request, $postId, $isUpvote): JsonResponse
  {
    $user = $request->user();

//    valida la richiesta e conferma che c'è un field vote e che contiene una stringa "up" o "down"
//    quando crei il Vote object, passa vote al field vote del Model Vote
//    fai una migration dove droppi il table UpvoteDownvote e crei un nuovo table Vote
//    il nuovo table Vote avrà 5 fields: post_id, user_id, vote, created_at, updated_at

    if (!$user || !$user->hasVerifiedEmail()) {
      return response()->json(['message' => 'Unauthorized'], Response::HTTP_UNAUTHORIZED);
    }

//    rinomina il model UpvoteDownvote con nome Vote
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
