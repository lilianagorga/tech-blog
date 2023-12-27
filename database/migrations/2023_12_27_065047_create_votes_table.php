<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
      Schema::dropIfExists('upvote_downvotes');
      Schema::create('votes', function (Blueprint $table) {
        $table->id();
        $table->foreignId('post_id')->references('id')->on('posts')->onDelete('cascade');
        $table->foreignId('user_id')->references('id')->on('users')->onDelete('cascade');
        $table->string('vote')->comment('up or down');
        $table->timestamps();
      });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('votes');
    }
};
