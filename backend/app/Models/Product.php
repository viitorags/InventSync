<?php

namespace App\Models;

use App\Traits\HasUniqueUuid;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasUniqueUuid;

    protected $primaryKey = "product_id";
    public $timestamps = false;

    protected $fillable = [
        'product_name',
        'product_price',
        'product_amount',
        'product_desc',
        'user_id',
    ];
}
