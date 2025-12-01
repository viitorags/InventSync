<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $avatarUrl = null;
        if ($this->user_avatar) {
            if (!str_starts_with($this->user_avatar, 'http')) {
                $avatarUrl = url('storage/' . $this->user_avatar) . '?t=' . time();
            } else {
                $avatarUrl = $this->user_avatar;
            }
        }

        return [
            'user_id' => $this->user_id,
            'user_name' => $this->user_name,
            'user_email' => $this->user_email,
            'user_avatar' => $avatarUrl,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
