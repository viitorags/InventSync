<?php

namespace App\Traits;

use Illuminate\Support\Str;

trait HasUniqueUuid
{
    protected static function bootHasUniqueUuid()
    {
        static::creating(function ($model) {
            if (empty($model->{$model->getKeyName()})) {
                $model->{$model->getKeyName()} = (string) Str::uuid();
            }
        });
    }

    public function initializeHasUniqueUuid()
    {
        $this->incrementing = false;
        $this->keyType = 'string';
    }
}
