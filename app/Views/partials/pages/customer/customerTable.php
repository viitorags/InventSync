<?php if (count($clientes) > 0): ?>
    <?php foreach ($clientes as $cliente): ?>
    <tr>
        <td data-label="Nome:">
            <div class="customer-name">
                <span class="customer-icon">
                    <i class="bi bi-person-circle"></i>
                </span>
                <?php echo htmlspecialchars($cliente['client_name']); ?>
            </div>
        </td>
        <td data-label="Telefone:">
            <div class="customer-number">
                <i class="bi bi-telephone"></i>
                <?php echo htmlspecialchars($cliente['client_number']); ?>
            </div>
        </td>
        <td data-label="Ações:">
            <button
                class="visualizar"
                data-id="<?php echo htmlspecialchars($cliente['client_id']); ?>"
                data-name="<?php echo htmlspecialchars($cliente['client_name']); ?>"
                data-number="<?php echo htmlspecialchars($cliente['client_number']); ?>"
            >
                <i class="bi bi-eye"></i>
            </button>
            <button
                class="editar"
                data-id="<?php echo htmlspecialchars($cliente['client_id']); ?>"
                data-name="<?php echo htmlspecialchars($cliente['client_name']); ?>"
                data-number="<?php echo htmlspecialchars($cliente['client_number']); ?>"
            >
                <i class="bi bi-pencil"></i>
            </button>
            <button class="remove_product" data-id="<?php echo htmlspecialchars($cliente['client_id']); ?>">
                <i class="bi bi-trash"></i>
            </button>
        </td>
    </tr>
    <?php endforeach; ?>
<?php else: ?>
    <tr>
        <td colspan="3" class="empty-table">
            <div class="empty-state">
                <i class="bi bi-people"></i>
                <p>Nenhum cliente cadastrado</p>
                <small>Adicione clientes usando o formulário acima</small>
            </div>
        </td>
    </tr>
<?php endif; ?>
