<?php

namespace App\Models;

use App\Traits\HasUniqueUuid;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use HasUniqueUuid;

    protected $primaryKey = "customer_id";
}
