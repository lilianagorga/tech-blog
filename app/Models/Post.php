<?php

namespace App\Models;

use DateTimeInterface;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Post extends Model
{
    use HasFactory;

  protected $fillable = ['title', 'slug', 'thumbnail', 'body', 'active', 'published_at', 'user_id', 'meta_title', 'meta_description'];
  protected $casts = ['published_at' => 'datetime'];

  public function user(): BelongsTo
  {
    return $this->belongsTo(User::class);
  }

  public function categories(): BelongsToMany
  {
    return $this->belongsToMany(Category::class);
  }

  public function votes(): HasMany
  {
    return $this->hasMany(Vote::class);
  }

}
