<?php

namespace App\Models;

use App\Traits\HasUniqueUuid;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasUniqueUuid;

    protected $primaryKey = "product_id";
}
