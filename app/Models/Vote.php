<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Vote extends Model
{
    use HasFactory;

  protected $fillable = ['type', 'post_id', 'user_id'];

  public function post(): BelongsTo
  {
    return $this->belongsTo(Post::class);
  }
}
