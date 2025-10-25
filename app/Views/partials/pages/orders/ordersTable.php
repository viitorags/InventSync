<?php

$viewsController = new ViewsController();
$orders = $viewsController->getOrders();

?>

<?php if (count($orders) > 0): ?>
    <?php foreach ($orders as $order): ?>
        <tr>
            <td data-label="Detalhes:">
                <div class="order-details">
                    <span class="order-icon"><i class="bi bi-receipt"></i></span>
                    <?php echo htmlspecialchars($order['order_details']); ?>
                </div>
            </td>
            <td data-label="Produto:">
                <?php
                if (!empty($order['product_name'])) {
                    $products = explode(', ', $order['product_name']);
                    if (count($products) > 1) {
                        echo htmlspecialchars($products[0]) . ' <small>(+' . (count($products) - 1) . ' mais)</small>';
                    } else {
                        echo htmlspecialchars($products[0]);
                    }
                } else {
                    echo "—";
                }
                ?>
            </td>
            <td data-label="Data:">
                <div class="date-display">
                    <i class="bi bi-calendar3"></i>
                    <?php echo date('d/m/Y', strtotime($order['order_date'])); ?>
                </div>
            </td>
            <td data-label="Cliente:">
                <div class="client-info">
                    <i class="bi bi-person"></i>
                    <?php echo htmlspecialchars($order['client_name']); ?>
                </div>
            </td>
            <td data-label="N° Cliente:">
                <div class="client-number">
                    <i class="bi bi-telephone"></i>
                    <?php echo htmlspecialchars($order['client_number']); ?>
                </div>
            </td>
            <td data-label="Valor:">
                R$
                <?php echo number_format((float)$order['order_price'], 2, '.', ''); ?>
            </td>
            <td data-label="Status:">
                <?php if ($order['order_status'] === 'Concluído'): ?>
                    <span class="status-indicator status-success">
                        <i class="bi bi-check-circle"></i>
                        <?php echo htmlspecialchars($order['order_status']); ?>
                    </span>
                <?php elseif ($order['order_status'] === 'Pendente'): ?>
                    <span class="status-indicator status-pending">
                        <i class="bi bi-hourglass-split"></i>
                        <?php echo htmlspecialchars($order['order_status']); ?>
                    </span>
                <?php elseif ($order['order_status'] === 'Cancelado'): ?>
                    <span class="status-indicator status-cancelled">
                        <i class="bi bi-x-circle"></i>
                        <?php echo htmlspecialchars($order['order_status']); ?>
                    </span>
                <?php else: ?>
                    <span class="status-indicator">
                        <?php echo htmlspecialchars($order['order_status']); ?>
                    </span>
                <?php endif; ?>
            </td>
            <td data-label="Ações:">
                <button class="visualizar" data-id="<?php echo htmlspecialchars($order['order_id']); ?>"
                    data-details="<?php echo htmlspecialchars($order['order_details']); ?>"
                    data-products="<?php echo isset($order['product_name']) ? htmlspecialchars($order['product_name']) : '—'; ?>"
                    data-product-ids="<?php echo isset($order['product_ids']) ? htmlspecialchars($order['product_ids']) : ''; ?>"
                    data-date="<?php echo date('Y-m-d', strtotime($order['order_date'])); ?>"
                    data-name="<?php echo htmlspecialchars($order['client_name']); ?>"
                    data-status="<?php echo htmlspecialchars($order['order_status']); ?>"
                    data-number="<?php echo htmlspecialchars($order['client_number']); ?>"
                    data-price="<?php echo htmlspecialchars($order['order_price']); ?>">
                    <i class="bi bi-eye"></i>
                </button>
                <button class="editar" data-id="<?php echo htmlspecialchars($order['order_id']); ?>"
                    data-details="<?php echo htmlspecialchars($order['order_details']); ?>"
                    data-products="<?php echo isset($order['product_name']) ? htmlspecialchars($order['product_name']) : '—'; ?>"
                    data-product-ids="<?php echo isset($order['product_ids']) ? htmlspecialchars($order['product_ids']) : ''; ?>"
                    data-date="<?php echo date('Y-m-d', strtotime($order['order_date'])); ?>"
                    data-name="<?php echo htmlspecialchars($order['client_name']); ?>"
                    data-status="<?php echo htmlspecialchars($order['order_status']); ?>"
                    data-number="<?php echo htmlspecialchars($order['client_number']); ?>"
                    data-price="<?php echo htmlspecialchars($order['order_price']); ?>">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="remove_order" data-id="<?php echo htmlspecialchars($order['order_id']); ?>">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        </tr>
    <?php endforeach; ?>
<?php else: ?>
    <tr>
        <td colspan="6" class="empty-table">
            <div class="empty-state">
                <i class="bi bi-cart-x"></i>
                <p>Nenhum pedido cadastrado</p>
                <small>Crie novos pedidos usando o formulário acima</small>
            </div>
        </td>
    </tr>
<?php endif; ?>
