<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (!isset($_SESSION['user_id'])) {
    header('Location: /');
    exit();
}

require_once __DIR__ . '/../Controllers/viewsController.php';

$viewsController = new ViewsController();

$user_id = $_SESSION['user_id'];
$products = $viewsController->getAllProducts();
$clients = $viewsController->getClient();
$orders = $viewsController->getOrders();

$totalProdutos = is_array($products) ? count($products) : 0;
$totalClientes = is_array($clients) ? count($clients) : 0;
$totalVendas = is_array($orders) ? count($orders) : 0;

$totalValor = 0;
if (is_array($orders)) {
    foreach ($orders as $order) {
        $totalValor += floatval($order['order_price'] ?? 0);
    }
}

$pedidosRecentes = [];
if (is_array($orders)) {
    usort($orders, function ($a, $b) {
        return strtotime($b['order_date']) - strtotime($a['order_date']);
    });
    $pedidosRecentes = array_slice($orders, 0, 5);
}

?>

<!doctype html>
<html lang="pt-br">

<head>
    <?php include __DIR__ . '/./partials/header.php'; ?>
    <title>Dashboard | System Stock</title>
    <style>
        .reports-actions {
            display: flex !important;
            gap: 12px !important;
            flex-shrink: 0 !important;
            z-index: 100 !important;
        }

        .btn-report {
            display: flex !important;
            visibility: visible !important;
            opacity: 1 !important;
            pointer-events: auto !important;
        }
    </style>
</head>

<body>
    <?php include __DIR__ . '/./partials/sidebar.php'; ?>

    <main class="container">
        <div class="dashboard_area">
            <div class="welcome-banner">
                <div class="banner-content">
                    <div class="welcome-text">
                        <?php echo "<h1>Olá, " . htmlspecialchars($_SESSION['user_name']) . "!</h1>"; ?>
                        <p class="subtitle">
                            Bem-vindo(a) ao seu painel de controle. Aqui está o resumo
                            do seu negócio hoje.
                        </p>
                        <div class="banner-stats">
                            <div class="stat-item">
                                <i class="bi bi-calendar-check"></i>
                                <span>
                                    <?php echo date('d/m/Y'); ?>
                                </span>
                            </div>
                            <div class="stat-item">
                                <i class="bi bi-clock"></i>
                                <span>
                                    <?php echo date('H:i'); ?>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="reports-actions">
                        <button class="btn-report btn-excel" id="downloadReportExcel">
                            <i class="bi bi-file-earmark-excel"></i>
                            <span>Excel</span>
                        </button>
                        <button class="btn-report btn-pdf" id="downloadReportPDF">
                            <i class="bi bi-file-earmark-pdf"></i>
                            <span>PDF</span>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Summary Cards -->
            <div class="summary_cards">
                <div class="card_box card-sales">
                    <div class="card_icon">
                        <i class="bi bi-cart-check"></i>
                    </div>
                    <div class="card_info">
                        <h4>Total Vendas</h4>
                        <p class="card_info_value">
                            <?php echo $totalVendas; ?>
                        </p>
                        <span class="card_trend positive">
                            <i class="bi bi-arrow-up"></i> Pedidos realizados
                        </span>
                    </div>
                </div>
                <div class="card_box card-revenue">
                    <div class="card_icon">
                        <i class="bi bi-cash-stack"></i>
                    </div>
                    <div class="card_info">
                        <h4>Total Valor</h4>
                        <p class="card_info_value">R$
                            <?php echo number_format($totalValor, 2, ',', '.'); ?>
                        </p>
                        <span class="card_trend positive">
                            <i class="bi bi-arrow-up"></i> Receita total
                        </span>
                    </div>
                </div>
                <div class="card_box card-clients">
                    <div class="card_icon">
                        <i class="bi bi-people"></i>
                    </div>
                    <div class="card_info">
                        <h4>Total Clientes</h4>
                        <p class="card_info_value">
                            <?php echo $totalClientes; ?>
                        </p>
                        <span class="card_trend">
                            <i class="bi bi-person"></i> Clientes cadastrados
                        </span>
                    </div>
                </div>
                <div class="card_box card-products">
                    <div class="card_icon">
                        <i class="bi bi-box-seam"></i>
                    </div>
                    <div class="card_info">
                        <h4>Total Produtos</h4>
                        <p class="card_info_value">
                            <?php echo $totalProdutos; ?>
                        </p>
                        <span class="card_trend">
                            <i class="bi bi-boxes"></i> Itens em estoque
                        </span>
                    </div>
                </div>
            </div>

            <!-- Charts Grid -->
            <div class="dashboard-grid">
                <div class="card chart-card">
                    <div class="chart-header">
                        <h3>
                            <i class="bi bi-graph-up"></i>
                            Vendas Recentes
                        </h3>
                        <span class="chart-period">Últimos 7 dias</span>
                    </div>
                    <div class="chart-container">
                        <canvas id="line_chart"></canvas>
                    </div>
                </div>

                <div class="card chart-card">
                    <div class="chart-header">
                        <h3>
                            <i class="bi bi-pie-chart"></i>
                            Produtos Mais Vendidos
                        </h3>
                        <span class="chart-period">Top 5</span>
                    </div>
                    <div class="chart-container">
                        <canvas id="pie_chart"></canvas>
                    </div>
                </div>
            </div>

            <!-- Recent Orders -->
            <div class="card recent-orders-card">
                <div class="card-header-section">
                    <h3>
                        <i class="bi bi-clock-history"></i>
                        Pedidos Recentes
                    </h3>
                    <a href="/orders" class="view-all-link">
                        Ver todos <i class="bi bi-arrow-right"></i>
                    </a>
                </div>
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
                            <?php if (!empty($pedidosRecentes)): ?>
                                <?php foreach ($pedidosRecentes as $pedido): ?>
                                    <tr>
                                        <td data-label="Cliente:">
                                            <i class="bi bi-person-circle"></i>
                                            <?php echo htmlspecialchars($pedido['client_name']); ?>
                                        </td>
                                        <td data-label="Data:">
                                            <i class="bi bi-calendar3"></i>
                                            <?php echo date('d/m/Y', strtotime($pedido['order_date'])); ?>
                                        </td>
                                        <td data-label="Detalhes:">
                                            <?php echo htmlspecialchars(substr($pedido['order_details'], 0, 50)) . (strlen($pedido['order_details']) > 50 ? '...' : ''); ?>
                                        </td>
                                        <td data-label="Status:">
                                            <?php
                                            $status = $pedido['order_status'] ?? 'Pendente';
                                            $statusClass = '';
                                            $statusIcon = '';

                                            switch ($status) {
                                                case 'Concluído':
                                                    $statusClass = 'status-success';
                                                    $statusIcon = 'bi-check-circle';
                                                    break;
                                                case 'Pendente':
                                                    $statusClass = 'status-pending';
                                                    $statusIcon = 'bi-hourglass-split';
                                                    break;
                                                case 'Cancelado':
                                                    $statusClass = 'status-cancelled';
                                                    $statusIcon = 'bi-x-circle';
                                                    break;
                                                default:
                                                    $statusClass = 'status-info';
                                                    $statusIcon = 'bi-info-circle';
                                            }
                                            ?>
                                            <span class="status-indicator <?php echo $statusClass; ?>">
                                                <i class="bi <?php echo $statusIcon; ?>"></i>
                                                <?php echo htmlspecialchars($status); ?>
                                            </span>
                                        </td>
                                        <td data-label="Valor:">
                                            <strong>R$
                                                <?php echo number_format(floatval($pedido['order_price']), 2, ',', '.'); ?>
                                            </strong>
                                        </td>
                                    </tr>
                                <?php endforeach; ?>
                            <?php else: ?>
                                <tr>
                                    <td colspan="5" style="text-align: center; padding: 30px;">
                                        <i class="bi bi-inbox" style="font-size: 48px; color: #ccc;"></i>
                                        <p style="color: #999; margin-top: 10px;">Nenhum pedido encontrado</p>
                                    </td>
                                </tr>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </main>

    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script>
        const dashboardData = {
            produtos: <?php echo json_encode($products ?: []); ?>,
            pedidos: <?php echo json_encode($orders ?: []); ?>,
            clientes: <?php echo json_encode($clients ?: []); ?>
        };

        const prepararDadosVendas = () => {
            const hoje = new Date();
            const ultimos7Dias = [];
            const vendasPorDia = {};

            for (let i = 6; i >= 0; i--) {
                const data = new Date(hoje);
                data.setDate(data.getDate() - i);
                const dataStr = data.toISOString().split('T')[0];
                ultimos7Dias.push(dataStr);
                vendasPorDia[dataStr] = 0;
            }

            dashboardData.pedidos.forEach(pedido => {
                const dataVenda = pedido.order_date;
                if (vendasPorDia.hasOwnProperty(dataVenda)) {
                    vendasPorDia[dataVenda] += parseFloat(pedido.order_price || 0);
                }
            });

            return {
                labels: ultimos7Dias.map(d => {
                    const [ano, mes, dia] = d.split('-');
                    return `${dia}/${mes}`;
                }),
                valores: ultimos7Dias.map(d => vendasPorDia[d])
            };
        };

        const dadosVendas = prepararDadosVendas();
    </script>
    <script src="assets/js/dashboard/dashboard.js"></script>
    <script src="assets/js/dashboard/reports.js"></script>
    <script src="assets/js/global.js"></script>
</body>

</html>
