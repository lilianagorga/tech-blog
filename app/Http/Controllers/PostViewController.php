<?php

namespace App\Http\Controllers;

use App\Models\PostView;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PostViewController extends Controller
{
  public function store(Request $request):JsonResponse
  {
    $validatedData = $request->validate([
      'post_id' => 'required|exists:posts,id',
      'ip_address' => 'required|ip',
      'user_agent' => 'required|string|max:255',
      'user_id' => 'nullable|exists:users,id'
    ]);

    PostView::create($validatedData);

    return response()->json(['message' => 'Post view recorded'], 201);
  }
}
