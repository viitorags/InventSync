<?php
$viewsController = new ViewsController();
$products = $viewsController->getAllProducts();
?>
<?php if (count($products) > 0): ?>
    <?php foreach ($products as $product): ?>
        <tr>
            <td data-label="Nome:">
                <div class="product-name">
                    <span class="product-icon"><i class="bi bi-box"></i></span>
                    <?php echo htmlspecialchars($product['product_name']); ?>
                </div>
            </td>
            <td data-label="Valor:">
                R$
                <?php echo number_format((float)$product['product_price'], 2, '.', ''); ?>
            </td>
            <td data-label="Quantidade:">
                <?php echo htmlspecialchars($product['product_amount']); ?>
            </td>
            <td data-label="Status:">
                <?php if ($product['product_amount'] <= 5): ?>
                    <span class="status-indicator status-danger">Estoque Crítico</span>
                <?php elseif ($product['product_amount'] <= 10): ?>
                    <span class="status-indicator status-warning">Estoque Baixo</span>
                <?php else: ?>
                    <span class="status-indicator status-success">Em Estoque</span>
                <?php endif; ?>
            </td>
            <td data-label="Ações:">
                <button class="visualizar" data-id="<?php echo htmlspecialchars($product['product_id']); ?>"
                    data-name="<?php echo htmlspecialchars($product['product_name']); ?>"
                    data-price="<?php echo htmlspecialchars($product['product_price']); ?>"
                    data-quantity="<?php echo htmlspecialchars($product['product_amount']); ?>">
                    <i class="bi bi-eye"></i>
                </button>
                <button class="editar" data-id="<?php echo htmlspecialchars($product['product_id']); ?>"
                    data-name="<?php echo htmlspecialchars($product['product_name']); ?>"
                    data-price="<?php echo htmlspecialchars($product['product_price']); ?>"
                    data-quantity="<?php echo htmlspecialchars($product['product_amount']); ?>">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="remove_product" data-id="<?php echo htmlspecialchars($product['product_id']); ?>">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        </tr>
    <?php endforeach; ?>
<?php else: ?>
    <tr>
        <td colspan="5" class="empty-table">
            <div class="empty-state">
                <i class="bi bi-inbox"></i>
                <p>Nenhum produto cadastrado</p>
                <small>Crie novos produtos usando o formulário acima</small>
            </div>
        </td>
    </tr>
<?php endif; ?>
