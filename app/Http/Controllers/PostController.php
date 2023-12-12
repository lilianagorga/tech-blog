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
}
