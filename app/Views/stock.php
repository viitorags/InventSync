<!doctype html>
<html lang="pt-br">

<head>
    <?php include __DIR__ . '/./partials/header.php'; ?>
    <title>Estoque | System Stock</title>
</head>

<body>
    <?php include __DIR__ . '/./partials/sidebar.php'; ?>
    <main class="container">
        <div class="functions_area">
            <div class="functions_buttons">
                <a href="/stock/export" class="download-relatory-btn">
                    <i class="bi bi-file-earmark-arrow-down"></i>
                    <span>Baixar relatório</span>
                </a>
                <a class="open-modal-btn" data-modal-target="productModal">
                    <i class="bi bi-plus-circle"></i>
                    <span>Novo Produto</span>
                </a>
            </div>
        </div>
        <div class="stock_area">
            <div id="productModal" class="modal-overlay">
                <div class="form_area">
                    <div class="modal-header">
                        <h2>Cadastro Produtos</h2>
                        <button class="modal-close">&times;</button>
                    </div>
                    <form id="productForm">
                        <label for="product_name">Nome:</label>
                        <input type="text" name="product_name" id="product_name" placeholder="Nome do produto"
                            required />
                        <label for="product_price">Valor:</label>
                        <input type="number" name="product_price" id="product_price" placeholder="0.00" step="0.01"
                            min="0" required />
                        <label for="product_quantity">Quantidade:</label>
                        <input type="number" name="product_quantity" id="product_quantity" placeholder="0" min="0"
                            required />
                        <button type="submit">
                            <i class="bi bi-plus-circle"></i>
                            Adicionar Produto
                        </button>
                    </form>
                </div>
            </div>
            <div class="stock_orders">
                <table>
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Valor</th>
                            <th>Quantidade</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody id="productTableBody">
                        <?php include __DIR__ . '/./partials/pages/stock/productTable.php'; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </main>

    <script src="/js/stock/registerUpdateProduct.js"></script>
    <script src="/js/stock/deleteProduct.js"></script>
    <script src="/js/global.js"></script>
</body>

</html>
