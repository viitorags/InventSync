<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Product;
use App\Models\Customer;
use Barryvdh\DomPDF\Facade\Pdf as PDF;
use Illuminate\Support\Facades\Response;

class ReportController extends Controller
{
    /**
     * Generate sales report in pdf or csv (excel-compatible)
     */
    public function sales(Request $request, $format)
    {
        $user = auth('api')->user();

        $orders = Order::where('user_id', $user->user_id)
            ->with('products')
            ->get();

        if (strtolower($format) === 'pdf') {
            $html = view('reports.sales', compact('orders', 'user'))->render();
            $pdf = PDF::loadHTML($html)->setPaper('a4', 'portrait');
            $filename = 'Relatorio_Vendas_' . date('Y-m-d') . '.pdf';
            return $pdf->download($filename);
        }

        if (strtolower($format) === 'excel' || strtolower($format) === 'csv') {
            $filename = 'Relatorio_Vendas_' . date('Y-m-d') . '.csv';
            $headers = [
                'Content-Type' => 'text/csv; charset=UTF-8',
                'Content-Disposition' => 'attachment; filename="' . $filename . '"',
            ];

            $callback = function () use ($orders) {
                $out = fopen('php://output', 'w');
                // BOM to help Excel recognize UTF-8
                fputs($out, chr(0xEF) . chr(0xBB) . chr(0xBF));
                fputcsv($out, ['Pedido', 'Cliente', 'Telefone', 'Produtos', 'Detalhes', 'Data', 'Status', 'Preço']);

                foreach ($orders as $order) {
                    $products = $order->products->pluck('product_name')->join(', ');
                    fputcsv($out, [
                        $order->order_id,
                        $order->customer_name,
                        $order->customer_number,
                        $products,
                        $order->order_details,
                        $order->order_date,
                        $order->order_status,
                        $order->order_price,
                    ]);
                }

                fclose($out);
            };

            return Response::stream($callback, 200, $headers);
        }

        return response()->json(['message' => 'Formato inválido'], 400);
    }

    /**
     * Generate products report in pdf or csv (excel-compatible)
     */
    public function products(Request $request, $format)
    {
        $user = auth('api')->user();

        $products = Product::where('user_id', $user->user_id)->get();

        if (strtolower($format) === 'pdf') {
            $html = view('reports.products', compact('products', 'user'))->render();
            $pdf = PDF::loadHTML($html)->setPaper('a4', 'portrait');
            $filename = 'Relatorio_Produtos_' . date('Y-m-d') . '.pdf';
            return $pdf->download($filename);
        }

        if (strtolower($format) === 'excel' || strtolower($format) === 'csv') {
            $filename = 'Relatorio_Produtos_' . date('Y-m-d') . '.csv';
            $headers = [
                'Content-Type' => 'text/csv; charset=UTF-8',
                'Content-Disposition' => 'attachment; filename="' . $filename . '"',
            ];

            $callback = function () use ($products) {
                $out = fopen('php://output', 'w');
                fputs($out, chr(0xEF) . chr(0xBB) . chr(0xBF));
                fputcsv($out, ['ID', 'Nome', 'Quantidade', 'Descrição', 'Preço']);

                foreach ($products as $product) {
                    fputcsv($out, [
                        $product->product_id,
                        $product->product_name,
                        $product->product_amount,
                        $product->product_desc,
                        $product->product_price,
                    ]);
                }

                fclose($out);
            };

            return Response::stream($callback, 200, $headers);
        }

        return response()->json(['message' => 'Formato inválido'], 400);
    }

    /**
     * Generate customers report in pdf or csv (excel-compatible)
     */
    public function customers(Request $request, $format)
    {
        $user = auth('api')->user();

        $customers = Customer::where('user_id', $user->user_id)->get();

        if (strtolower($format) === 'pdf') {
            $html = view('reports.customers', compact('customers', 'user'))->render();
            $pdf = PDF::loadHTML($html)->setPaper('a4', 'portrait');
            $filename = 'Relatorio_Clientes_' . date('Y-m-d') . '.pdf';
            return $pdf->download($filename);
        }

        if (strtolower($format) === 'excel' || strtolower($format) === 'csv') {
            $filename = 'Relatorio_Clientes_' . date('Y-m-d') . '.csv';
            $headers = [
                'Content-Type' => 'text/csv; charset=UTF-8',
                'Content-Disposition' => 'attachment; filename="' . $filename . '"',
            ];

            $callback = function () use ($customers) {
                $out = fopen('php://output', 'w');
                fputs($out, chr(0xEF) . chr(0xBB) . chr(0xBF));
                fputcsv($out, ['ID', 'Nome', 'Telefone']);

                foreach ($customers as $customer) {
                    fputcsv($out, [
                        $customer->customer_id,
                        $customer->customer_name,
                        $customer->customer_number,
                    ]);
                }

                fclose($out);
            };

            return Response::stream($callback, 200, $headers);
        }

        return response()->json(['message' => 'Formato inválido'], 400);
    }
}
