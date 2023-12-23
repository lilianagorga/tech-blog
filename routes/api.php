<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\LogoutController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TextWidgetController;
use App\Http\Controllers\UI\DashboardController;
use App\Http\Controllers\UpvoteDownvoteController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->group(function () {

  Route::get('/user', function (Request $request) {
    return $request->user();
  });

  Route::get('/users/manage-panels', [UserController::class, 'managePanels']);

  Route::get('/profile', [ProfileController::class, 'edit']);
  Route::patch('/profile', [ProfileController::class, 'update']);
  Route::delete('/profile', [ProfileController::class, 'destroy']);

  Route::apiResource('posts', PostController::class);
  Route::apiResource('categories', CategoryController::class);
  Route::apiResource('users', UserController::class)->except('store');
  Route::apiResource('text-widgets', TextWidgetController::class);


  Route::get('/comments', [CommentController::class, 'index']);
  Route::post('/comments', [CommentController::class, 'store']);
  Route::patch('/comments/{comment}', [CommentController::class, 'update']);
  Route::get('/posts/{postId}/comments', [CommentController::class, 'showCommentsForPost']);
  Route::delete('/comments/{comment}', [CommentController::class, 'destroy']);

  Route::post('/posts/{postId}/upvote', [UpvoteDownvoteController::class, 'upvote']);
  Route::post('/posts/{postId}/downvote', [UpvoteDownvoteController::class, 'downvote']);

  Route::post('/logout', [LogoutController::class, 'logout']);
  Route::get('/me', [AuthController::class, 'me']);
  Route::get('/dashboard', [DashboardController::class, 'index']);
});

Route::get('/search', [PostController::class, 'search'])->name('search');
Route::get('/category/{category:slug}', [PostController::class, 'byCategory'])->name('by-category');
Route::post('/user/register', RegisterController::class);
Route::post('/user/login', LoginController::class);


