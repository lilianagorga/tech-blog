<?php

namespace App\Http\Requests\Auth;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class RegisterRequest extends FormRequest
{
  public function authorize(): bool
  {
    return true;
  }

  /**
   * @return array<string,ValidationRule|array|string>
   */
  public function rules(): array
  {
    return [
      'name' => 'required',
      'email' => 'required|email|string|unique:users,email',
      'password' => ['required', 'confirmed', Password::min(8)->mixedCase()->numbers()->symbols()]
    ];
  }
}
