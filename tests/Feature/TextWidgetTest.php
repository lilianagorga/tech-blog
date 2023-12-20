<?php

namespace Tests\Feature;

use App\Models\TextWidget;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class TextWidgetTest extends TestCase
{
  use RefreshDatabase;

  public function setUp(): void
  {
    parent::setUp();
    $this->user = $this->authUser();
  }

  public function test_text_widgets_can_be_listed()
  {
    $this->createTextWidgetCount();
    $response = $this->getJson('/api/text-widgets');
    $response->assertOk();
    $response->assertJsonCount(1);
  }

  public function test_a_text_widget_can_be_created()
  {
    $textWidgetData = [
      'title' => 'Widget Title',
      'active' => true,
      'key' => 'unique-key',
    ];

    $response = $this->postJson('/api/text-widgets', $textWidgetData);
    $response->assertCreated();
    $this->assertDatabaseHas('text_widgets', $textWidgetData);
  }

  public function test_a_single_text_widget_can_be_retrieved()
  {
    $widget = $this->createTextWidget();

    $response = $this->getJson('/api/text-widgets/' . $widget->id);
    $response->assertOk();
    $response->assertJson([
      'id' => $widget->id,
      'key' => $widget->key,
      'title' => $widget->title,
      'active' => $widget->active,
    ]);
  }

  public function test_a_text_widget_can_be_updated()
  {
    $widget = $this->createTextWidget();
    $updatedData = [
      'title' => 'Updated Title',
      'key' => 'unique-key',
      'active' => false,
    ];

    $response = $this->putJson('/api/text-widgets/' . $widget->id, $updatedData);
    $response->assertOk();
    $this->assertDatabaseHas('text_widgets', [
      'id' => $widget->id,
      'key' => $updatedData['key'],
      'title' => 'Updated Title',
      'active' => false,
    ]);
  }

  public function test_a_text_widget_can_be_deleted()
  {
    $widget = TextWidget::factory()->create();

    $response = $this->deleteJson('/api/text-widgets/' . $widget->id);
    $response->assertNoContent();
    $this->assertDatabaseMissing('text_widgets', ['id' => $widget->id]);
  }


}
