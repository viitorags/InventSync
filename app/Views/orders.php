<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (!isset($_SESSION['user_id'])) {
    header('Location: /');
    exit();
}
?>

<!doctype html>
<html lang="pt-br">

<head>
    <?php include __DIR__ . '/./partials/header.php'; ?>
    <title>Pedidos | System Stock</title>
</head>

<body>
    <?php include __DIR__ . '/./partials/sidebar.php'; ?>
    <main class="container">
        <div class="functions_area">
            <div class="page-header">
                <div class="page-title">
                    <i class="bi bi-people"></i>
                    <h1>Gerenciamento de Pedidos</h1>
                </div>
                <a class="open-modal-btn" data-modal-target="ordersModal">
                    <i class="bi bi-plus-circle"></i>
                    <span>Novo Pedido</span>
                </a>
            </div>
        </div>
        <div class="stock_area">
            <div id="ordersModal" class="modal-overlay">
                <div class="form_area">
                    <div class="modal-header">
                        <h2>Cadastro Pedidos</h2>
                        <button class="modal-close">&times;</button>
                    </div>
                    <?php

                    require_once __DIR__ . '/../Controllers/viewsController.php';

                    $viewsController = new ViewsController();
                    $products = $viewsController->getAllProducts();
                    $clients = $viewsController->getClient();
                    ?>
                    <form id="ordersForm">
                        <label for="order_details">
                            Detalhes do Pedido:
                        </label>
                        <textarea name="order_details" id="order_details" placeholder="Descreva o pedido aqui"
                            required></textarea>
                        <label for="order_date">Data do Pedido:</label>
                        <input type="date" name="order_date" id="order_date" required />
                        <label for="product_ids">Produtos:</label>
                        <select name="products[]" id="products" multiple required>
                            <?php if (count($products) > 0): ?>
                                <?php foreach ($products as $product): ?>
                                    <option value="<?php echo htmlspecialchars($product['product_id']); ?>"
                                        data-price="<?php echo htmlspecialchars($product['product_price']); ?>">
                                        <?php echo htmlspecialchars($product['product_name']); ?> - R$
                                        <?php echo number_format($product['product_price'], 2, ',', '.'); ?>
                                    </option>
                                <?php endforeach; ?>
                            <?php endif; ?>
                        </select>
                        <label for="client_name">Nome do Cliente:</label>
                        <select name="client_name" id="client_name" required>
                            <?php if (count($clients) > 0): ?>
                                <?php foreach ($clients as $client): ?>
                                    <option value="<?php echo htmlspecialchars($client['client_name']); ?>"
                                        data-id="<?php echo htmlspecialchars($client['client_id']); ?>"
                                        data-number="<?php echo htmlspecialchars($client['client_number']); ?>">
                                        <?php echo htmlspecialchars($client['client_name']); ?>
                                    </option>
                                <?php endforeach; ?>
                            <?php endif; ?>
                        </select>
                        <input type="hidden" name="client_id" id="client_id" />
                        <label for="client_number">
                            Número do Cliente:
                        </label>
                        <input type="tel" name="client_number" id="client_number" placeholder="(00) 00000-0000"
                            maxlength="11" pattern="\d{11}" required />
                        <label for="order_status">Status:</label>
                        <select name="order_status" id="order_status" required>
                            <option value="Concluído">Concluído</option>
                            <option value="Pendente">Pendente</option>
                            <option value="Cancelado">Cancelado</option>
                        </select>
                        <label for="order_price">Valor:</label>
                        <input type="number" name="order_price" id="order_price" placeholder="Total do pedido" min="0"
                            required />
                        <button type="submit">
                            <i class="bi bi-bag-plus"></i>
                            Registrar Pedido
                        </button>
                    </form>
                </div>
            </div>
            <div class="stock_orders">
                <table>
                    <thead>
                        <tr>
                            <th>Detalhes</th>
                            <th>Produtos</th>
                            <th>Data</th>
                            <th>Nome Cliente</th>
                            <th>N° Cliente</th>
                            <th>Valor</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody id="ordersTableBody">
                        <?php include __DIR__ . '/./partials/pages/orders/ordersTable.php'; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </main>

    <script src="https://cdn.jsdelivr.net/npm/tom-select@2.4.3/dist/js/tom-select.complete.min.js"></script>
    <script src="assets/js/global.js"></script>
    <script src="assets/js/orders/registerUpdateOrder.js"></script>
    <script src="assets/js/orders/deleteOrder.js"></script>
    <script>
        new TomSelect("#products", {
            plugins: ["remove_button"],
            placeholder: "Selecione os produtos",
            persist: false,
            create: false,
        });
        new TomSelect("#client_name", {
            plugins: ["remove_button"],
            placeholder: "Selecione o cliente",
            persist: false,
            create: false,
            allowEmptyOption: true,
            items: [],
        });
        new TomSelect("#order_status", {
            plugins: ["remove_button"],
            placeholder: "Selecione o status",
            persist: false,
            create: false,
            allowEmptyOption: true,
            searchField: [],
            items: [],
        });

        document.addEventListener("DOMContentLoaded", function() {
            const clientSelect = document.getElementById("client_name");
            const clientNumberInput =
                document.getElementById("client_number");

            clientSelect.addEventListener("change", function() {
                const selectedOption =
                    clientSelect.options[clientSelect.selectedIndex];
                const clientNumber =
                    selectedOption.getAttribute("data-number");

                clientNumberInput.value = clientNumber || "";
            });

            const event = new Event("change");
            clientSelect.dispatchEvent(event);
        });
    </script>
</body>

</html>
