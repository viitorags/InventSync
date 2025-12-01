<?php

namespace App\Models;

use App\Traits\HasUniqueUuid;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use HasUniqueUuid;

    protected $primaryKey = "customer_id";
    public $timestamps = false;

    protected $fillable = [
        'customer_name',
        'customer_number',
        'user_id',
    ];
}
