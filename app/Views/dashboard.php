<!doctype html>
<html lang="pt-br">

<head>
    <?php include __DIR__ . '/./partials/header.php'; ?>
    <title>Dashboard | System Stock</title>
</head>

<body>
    <?php include __DIR__ . '/./partials/sidebar.php'; ?>

    <main class="container">
        <div class="dashboard_area">
            <div class="welcome-banner">
                <h1>Olá,</h1>
                <p class="subtitle">
                    Bem-vindo ao seu painel de controle. Aqui está o resumo
                    do seu negócio hoje.
                </p>
            </div>

            <div class="summary_cards">
                <div class="card_box">
                    <div class="card_icon">
                        <i class="bi bi-cart-check"></i>
                    </div>
                    <div class="card_info">
                        <h4>Total Vendas</h4>
                        <p class="card_info_value">
                            <?php echo htmlspecialchars($totalVendas); ?>
                        </p>
                    </div>
                </div>
                <div class="card_box">
                    <div class="card_icon">
                        <i class="bi bi-cash-stack"></i>
                    </div>
                    <div class="card_info">
                        <h4>Total Valor</h4>
                        <p class="card_info_value">R$
                            <?php echo htmlspecialchars($totalValor); ?>
                        </p>
                    </div>
                </div>
                <div class="card_box">
                    <div class="card_icon">
                        <i class="bi bi-people"></i>
                    </div>
                    <div class="card_info">
                        <h4>Total Clientes</h4>
                        <p class="card_info_value">
                            <?php echo htmlspecialchars($totalClientes); ?>
                        </p>
                    </div>
                </div>
                <div class="card_box">
                    <div class="card_icon">
                        <i class="bi bi-box-seam"></i>
                    </div>
                    <div class="card_info">
                        <h4>Total Produtos</h4>
                        <p class="card_info_value">
                            <?php echo htmlspecialchars($totalProdutos); ?>
                        </p>
                    </div>
                </div>
            </div>

            <div class="dashboard-grid">
                <div class="card chart-card">
                    <h3>
                        <i class="bi bi-graph-up"></i>
                        Vendas Recentes
                    </h3>
                    <div class="chart-container">
                        <canvas id="line_chart"></canvas>
                    </div>
                </div>

                <div class="card chart-card">
                    <h3>
                        <i class="bi bi-pie-chart"></i>
                        Produtos Mais Vendidos
                    </h3>
                    <div class="chart-container">
                        <canvas id="pie_chart"></canvas>
                    </div>
                </div>
            </div>

            <div class="card">
                <h3>
                    <i class="bi bi-clock-history"></i>
                    Pedidos Recentes
                </h3>
                <div class="recent-orders">
                    <table>
                        <thead>
                            <tr>
                                <th>Cliente</th>
                                <th>Data</th>
                                <th>Detalhes</th>
                                <th>Status</th>
                                <th>Valor</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($pedidosRecentes as $pedido): ?>
                                <tr>
                                    <td data-label="Cliente:">
                                        <?php echo htmlspecialchars($pedido['client_name']); ?>
                                    </td>
                                    <td data-label="Data:">
                                        <?php echo date('d/m/Y', strtotime($pedido['order_date'])); ?>
                                    </td>
                                    <td data-label="Detalhes:">
                                        <?php echo htmlspecialchars($pedido['order_details']); ?>
                                    </td>
                                    <td data-label="Status:">
                                        <span class="status-indicator status-success">
                                            Concluído
                                        </span>
                                    </td>
                                    <td data-label="Valor:">
                                        <?php echo htmlspecialchars($pedido['order_price']); ?>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </main>

    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script>
    </script>
    <script src="/js/dashboard/dashboard.js"></script>
    <script src="/js/global.js"></script>
</body>

</html>
</body>

</html>
