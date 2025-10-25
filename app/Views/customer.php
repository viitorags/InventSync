<?php

if (!isset($_SESSION['user_id'])) {
    header('Location: /');
    exit();
}

?>

<!doctype html>
<html lang="pt-br">

<head>
    <?php include __DIR__ . '/./partials/header.php'; ?>
    <title>Clientes | System Stock</title>
</head>

<body>
    <?php include __DIR__ . '/./partials/sidebar.php'; ?>
    <main class="container">
        <div class="functions_area">
            <div class="page-header">
                <div class="page-title">
                    <i class="bi bi-people"></i>
                    <h1>Gerenciamento de Clientes</h1>
                </div>
                <a class="open-modal-btn" data-modal-target="customerModal">
                    <i class="bi bi-person-plus"></i>
                    <span>Novo Cliente</span>
                </a>
            </div>
        </div>
        <div class="stock_area">
            <div id="customerModal" class="modal-overlay">
                <div class="form_area">
                    <div class="modal-header">
                        <h2>Cadastro Clientes</h2>
                        <button class="modal-close">&times;</button>
                    </div>
                    <form id="customerForm">
                        <label for="client_name">Nome do Cliente:</label>
                        <input type="text" name="client_name" id="client_name" placeholder="Nome completo" required />
                        <label for="client_number">Telefone:</label>
                        <input type="tel" name="client_number" id="client_number" placeholder="(00) 00000-0000"
                            maxlength="11" pattern="\d{11}" required />
                        <button type="submit">
                            <i class="bi bi-person-plus"></i>
                            Adicionar Cliente
                        </button>
                    </form>
                </div>
            </div>
            <div class="stock_orders">
                <table>
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Telefone</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody id="clientTableBody">
                        <?php include __DIR__ . '/./partials/pages/customer/customerTable.php'; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </main>

    <script src="assets/js/global.js"></script>
    <script src="assets/js/customer/registerUpdateClient.js"></script>
    <script src="assets/js/customer/deleteClient.js"></script>
</body>

</html>
