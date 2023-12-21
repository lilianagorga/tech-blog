<?php

namespace App\Http\Requests\Auth;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

/**
 * @property mixed $email
 * @property mixed $password
 */

class LoginRequest extends FormRequest
{
  public function authorize(): bool
  {
    return true;
  }

  /**
   * @return array<string, ValidationRule|array|string>
   */
  public function rules(): array
  {
    return [
      'email' => 'required|email|string',
      'password' => 'required'
    ];
  }
}
