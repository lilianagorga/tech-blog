<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CategoryController extends Controller
{
    public function index(): Response
    {
      $categories = Category::all();
      return response()->json($categories);
    }
  public function store(Request $request): Response
  {
    if (!$request->user()->canAccessPanel()) {
      return response()->json(['message' => 'Access Forbidden'], Response::HTTP_FORBIDDEN);
    }

    $validatedData = $request->validate([
      'title' => 'required|string|max:2048',
      'slug' => 'required|string|max:2048|unique:categories'
    ]);

    $category = Category::create($validatedData);

    return response()->json($category, Response::HTTP_CREATED);
  }

  public function show($id): Response
  {
    $category = Category::findOrFail($id);

    return response()->json($category);
  }

  public function update(Request $request, $id): Response
  {
    if (!$request->user()->canAccessPanel()) {
      return response()->json(['message' => 'Access Forbidden'], Response::HTTP_FORBIDDEN);
    }
    $category = Category::findOrFail($id);
    $validatedData = $request->validate([
      'title' => 'required|string|max:2048',
      'slug' => 'required|string|max:2048|unique:categories,slug,' . $category->id
    ]);
    $category->update($validatedData);

    return response()->json($category);
  }

  public function destroy(Request $request, $id): Response
  {
    if (!$request->user()->canAccessPanel()) {
      return response()->json(['message' => 'Access Forbidden'], Response::HTTP_FORBIDDEN);
    }
    $category = Category::findOrFail($id);
    $category->delete();

    return response()->json(null, Response::HTTP_NO_CONTENT);
  }

}
