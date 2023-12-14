<?php

namespace App\Http\Controllers;

use App\Models\TextWidget;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class TextWidgetController extends Controller
{
  public function index(): JsonResponse
  {
    $widgets = TextWidget::where('active', true)->get();
    return response()->json(['data' => $widgets]);
  }

  public function store(Request $request): JsonResponse
  {
    $validatedData = $request->validate([
      'key' => 'required|unique:text_widgets|max:255',
      'title' => 'required|max:2048',
      'image' => 'nullable|url|max:2048',
      'content' => 'nullable',
      'active' => 'required|boolean'
    ]);

    $widget = TextWidget::create($validatedData);
    return response()->json($widget, Response::HTTP_CREATED);
  }

  public function show(TextWidget $textWidget): JsonResponse
  {
    return response()->json($textWidget);
  }

  public function update(Request $request, TextWidget $textWidget): JsonResponse
  {
    $validatedData = $request->validate([
      'key' => 'required|max:255|unique:text_widgets,key,' . $textWidget->id,
      'title' => 'required|max:2048',
      'image' => 'nullable|url|max:2048',
      'content' => 'nullable',
      'active' => 'required|boolean'
    ]);

    $textWidget->update($validatedData);
    return response()->json($textWidget);
  }

  public function destroy(TextWidget $textWidget): JsonResponse
  {
    $textWidget->delete();
    return response()->json(null, Response::HTTP_NO_CONTENT);
  }


}
