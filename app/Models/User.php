<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

  protected function getDefaultGuardName(): string {
    return 'api';
  }

  public function isAdmin(): bool
  {
    return $this->hasRole('Admin', 'api');
  }

  public function isModerator(): bool
  {
    return $this->hasRole('Moderator', 'api');
  }

  public function isWriter(): bool
  {
    return $this->hasRole('Writer', 'api');
  }

  public function canAccessPanel(): bool
  {
    return $this->isAdmin() || $this->hasPermissionTo('managePanel', 'api');
  }

  public function canManagePosts(): bool
  {
    return $this->isAdmin() || $this->isModerator() || $this->hasPermissionTo('managePosts', 'api');
  }

  public function canManageCategories(): bool
  {
    return $this->isAdmin() || $this->isWriter() || $this->hasPermissionTo('manageCategories', 'api');
  }

  public function canManageComments(): bool
  {
    return $this->isAdmin() || $this->isModerator() || $this->isWriter() || $this->hasPermissionTo('manageComments', 'api');
  }

}
