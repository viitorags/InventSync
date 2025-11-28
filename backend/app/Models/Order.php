<?php

namespace App\Models;

use App\Traits\HasUniqueUuid;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasUniqueUuid;

    protected $primaryKey = "order_id";
}
