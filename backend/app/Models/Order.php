<?php

namespace App\Models;

use App\Traits\HasUniqueUuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Order extends Model
{
    use HasUniqueUuid;

    protected $primaryKey = "order_id";
    public $timestamps = false;

    protected $fillable = [
        'order_details',
        'order_date',
        'order_status',
        'order_price',
        'customer_name',
        'customer_number',
        'customer_id',
        'user_id',
    ];

    protected $casts = [
        'order_date' => 'date',
        'order_price' => 'decimal:2',
    ];

    public function products(): BelongsToMany
    {
        return $this->belongsToMany(
            Product::class,
            'ordersproduct',
            'order_id',
            'product_id'
        );
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class, 'customer_id', 'customer_id');
    }
}
