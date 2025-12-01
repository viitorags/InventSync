<!doctype html>
<html lang="pt-BR">

<head>
    <meta charset="utf-8" />
    <title>Relatório de Vendas</title>
    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 12px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }

        th,
        td {
            border: 1px solid #333;
            padding: 6px;
            text-align: left;
        }

        th {
            background: #f0f0f0;
            font-weight: bold;
        }

        h2 {
            text-align: center;
            margin-bottom: 10px;
        }

        .header {
            text-align: center;
            margin-bottom: 20px;
        }
    </style>
</head>

<body>
    <div class="header">
        <h2>Relatório de Vendas</h2>
        <p>Data de Geração: {{ date('d/m/Y H:i:s') }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>Cliente</th>
                <th>Telefone</th>
                <th>Produtos</th>
                <th>Data</th>
                <th>Status</th>
                <th>Preço</th>
            </tr>
        </thead>
        <tbody>
            @forelse($orders as $order)
            <tr>
                <td>{{ $order->customer_name }}</td>
                <td>{{ $order->customer_number }}</td>
                <td>{{ $order->products->pluck('product_name')->join(', ') }}</td>
                <td>{{ \Carbon\Carbon::parse($order->order_date)->format('d/m/Y') }}</td>
                <td>{{ ucfirst($order->order_status) }}</td>
                <td>R$ {{ number_format($order->order_price, 2, ',', '.') }}</td>
            </tr>
            @empty
            <tr>
                <td colspan="6" style="text-align: center;">Nenhum pedido encontrado</td>
            </tr>
            @endforelse
        </tbody>
        <tfoot>
            <tr>
                <td colspan="5" style="text-align: right; font-weight: bold;">Total:</td>
                <td style="font-weight: bold;">R$ {{ number_format($orders->sum('order_price'), 2, ',', '.') }}</td>
            </tr>
        </tfoot>
    </table>
</body>

</html>
