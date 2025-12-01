<!doctype html>
<html lang="pt-BR">

<head>
    <meta charset="utf-8" />
    <title>Relatório de Produtos</title>
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
            padding: 8px;
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

        .total {
            font-weight: bold;
            background: #f9f9f9;
        }
    </style>
</head>

<body>
    <div class="header">
        <h2>Relatório de Produtos</h2>
        <p>Data de Geração: {{ date('d/m/Y H:i:s') }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>Nome do Produto</th>
                <th>Descrição</th>
                <th style="text-align: center;">Quantidade em Estoque</th>
                <th style="text-align: right;">Preço Unitário</th>
                <th style="text-align: right;">Valor Total</th>
            </tr>
        </thead>
        <tbody>
            @forelse($products as $product)
            <tr>
                <td>{{ $product->product_name }}</td>
                <td>{{ $product->product_desc ?? '-' }}</td>
                <td style="text-align: center;">{{ $product->product_amount }}</td>
                <td style="text-align: right;">R$ {{ number_format($product->product_price, 2, ',', '.') }}</td>
                <td style="text-align: right;">R$ {{ number_format($product->product_price * $product->product_amount, 2, ',', '.') }}</td>
            </tr>
            @empty
            <tr>
                <td colspan="5" style="text-align: center;">Nenhum produto encontrado</td>
            </tr>
            @endforelse
        </tbody>
        <tfoot>
            <tr class="total">
                <td colspan="3" style="text-align: right;">Total de Produtos:</td>
                <td style="text-align: center;">{{ $products->sum('product_amount') }}</td>
                <td style="text-align: right;">R$ {{ number_format($products->sum(function($p) { return $p->product_price * $p->product_amount; }), 2, ',', '.') }}</td>
            </tr>
        </tfoot>
    </table>
</body>

</html>
