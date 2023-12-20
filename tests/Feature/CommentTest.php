<?php

namespace Tests\Feature;

use App\Models\Comment;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Symfony\Component\HttpFoundation\Response;
use Tests\TestCase;

class CommentTest extends TestCase
{
  use RefreshDatabase;

  public function setUp(): void
  {
    parent::setUp();
    $this->user = $this->authUser();
  }

  public function test_can_list_comments()
  {
    $this->createComment();
    $response = $this->getJson('/api/comments');
    $response->assertOk();
    $response->assertJsonStructure([
      '*' => ['id', 'comment', 'user_id', 'post_id', 'created_at', 'updated_at', 'user', 'post', 'comments']
    ]);
  }

  public function test_can_create_comment()
  {
    $post = $this->createPost();
    $commentData = [
      'comment' => "That's new Comment.",
      'post_id' => $post->id,
    ];

    $response = $this->actingAs($this->user)->postJson('/api/comments', $commentData);
    $response->assertStatus(Response::HTTP_CREATED);
    $response->assertJsonFragment(['comment' => "That's new Comment."]);
  }

  public function test_can_update_comment()
  {
    $comment = $this->createComment(['user_id' => $this->user->id]);
    $updatedData = ['comment' => 'Updated Comment.', 'post_id' => $comment->post_id,];
    $response = $this->actingAs($this->user)->patchJson('/api/comments/' . $comment->id, $updatedData);
    $response->assertOk();
    $response->assertJson(['message' => 'Comment updated successfully']);
    $this->assertDatabaseHas('comments', [
      'id' => $comment->id,
      'comment' => 'Updated Comment.',
      'post_id' => $comment->post_id
    ]);
  }

  public function test_can_show_comments_for_post()
  {
    $post = $this->createPost();
    $this->createComment(['post_id' => $post->id]);

    $response = $this->getJson('/api/posts/' . $post->id . '/comments');
    $response->assertOk();
    $response->assertJsonStructure([
      '*' => ['id', 'comment', 'user_id', 'post_id', 'parent_id', 'created_at', 'updated_at']
    ]);
  }

  public function test_can_delete_comment()
  {
    $comment = $this->createComment(['user_id' => $this->user->id]);
    $deletedData = ['comment' => 'Deleted Comment.','post_id' => $comment->post_id];
    $response = $this->actingAs($this->user)->deleteJson('/api/comments/' . $comment->id, $deletedData);
    $response->assertOk();
    $response->assertJson(['message' => 'Comment deleted successfully']);
    $this->assertDatabaseMissing('comments', [
      'id' => $comment->id,
      'comment' => 'Deleted Comment.',
      'post_id' => $comment->post_id
    ]);
  }

  public function test_can_create_reply_to_comment()
  {
    $mainComment = $this->createComment();

    $replyComment = Comment::factory()->replyTo($mainComment->id)->create();
    $this->assertDatabaseHas('comments', ['id' => $replyComment->id, 'parent_id' => $mainComment->id]);
    $this->assertEquals($replyComment->parent_id, $mainComment->id);
  }


}
