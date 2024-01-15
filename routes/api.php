<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\ManagePanelController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\UI\DashboardController;
use App\Http\Controllers\VoteController;
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

  Route::get('/manage-panels', [ManagePanelController::class, 'managePanels']);
  Route::post('/roles', [ManagePanelController::class, 'createRole']);
  Route::post('/roles/add', [ManagePanelController::class, 'addRoles']);
  Route::delete('/roles/delete', [ManagePanelController::class, 'deleteRole']);
  Route::post('/permissions', [ManagePanelController::class, 'createPermission']);
  Route::post('/permissions/add', [ManagePanelController::class, 'addPermissions']);
  Route::delete('/permissions/delete', [ManagePanelController::class, 'deletePermission']);

  Route::apiResource('posts', PostController::class);
  Route::apiResource('categories', CategoryController::class);
  Route::apiResource('users', UserController::class)->except('store');

  Route::get('/comments', [CommentController::class, 'index']);
  Route::post('/comments', [CommentController::class, 'store']);
  Route::patch('/comments/{comment}', [CommentController::class, 'update']);
  Route::get('/posts/{postId}/comments', [CommentController::class, 'showCommentsForPost']);
  Route::delete('/comments/{comment}', [CommentController::class, 'destroy']);

  Route::post('/votes/{type}', [VoteController::class, 'store']);
  Route::patch('/votes/{voteId}', [VoteController::class, 'update']);
  Route::delete('/votes/{voteId}', [VoteController::class, 'destroy']);

  Route::post('/logout', [AuthController::class, 'logout']);
  Route::get('/me', [AuthController::class, 'me']);
  Route::get('/dashboard', [DashboardController::class, 'index']);
});

Route::get('/search', [PostController::class, 'search'])->name('search');
Route::get('/category/{category:slug}', [PostController::class, 'byCategory'])->name('by-category');

Route::post('/user/register', [AuthController::class, 'register']);
Route::post('/user/login', [AuthController::class, 'login']);
