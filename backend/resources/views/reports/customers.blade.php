<!doctype html>
<html lang="pt-BR">

<head>
    <meta charset="utf-8" />
    <title>Relatório de Clientes</title>
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
        <h2>Relatório de Clientes</h2>
        <p>Data de Geração: {{ date('d/m/Y H:i:s') }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>Nome do Cliente</th>
                <th>Telefone</th>
            </tr>
        </thead>
        <tbody>
            @forelse($customers as $customer)
            <tr>
                <td>{{ $customer->customer_name }}</td>
                <td>{{ $customer->customer_number }}</td>
            </tr>
            @empty
            <tr>
                <td colspan="2" style="text-align: center;">Nenhum cliente encontrado</td>
            </tr>
            @endforelse
        </tbody>
        <tfoot>
            <tr class="total">
                <td style="text-align: right;">Total de Clientes:</td>
                <td style="text-align: center;">{{ $customers->count() }}</td>
            </tr>
        </tfoot>
    </table>
</body>

</html>
