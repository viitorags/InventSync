document.addEventListener("DOMContentLoaded", async () => {
    const productForm = document.getElementById("productForm");
    const productModal = document.getElementById("productModal");
    const submitBtn = productForm.querySelector('button[type="submit"]');

    let editingProductId = null;

    const visualizarButtons = document.querySelectorAll(".visualizar");
    visualizarButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const id = button.dataset.id;
            const name = button.dataset.name;
            const price = button.dataset.price;
            const quantity = button.dataset.quantity;

            productForm.product_name.value = name;
            productForm.product_price.value = price;
            productForm.product_quantity.value = quantity;

            submitBtn.style.display = "none";

            productModal.classList.add("active");
            document.body.style.overflow = "hidden";
        });
    });

    const editarButtons = document.querySelectorAll(".editar");
    editarButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const id = button.dataset.id;
            const name = button.dataset.name;
            const price = button.dataset.price;
            const quantity = button.dataset.quantity;

            productForm.product_name.value = name;
            productForm.product_price.value = price;
            productForm.product_quantity.value = quantity;

            editingProductId = id;

            submitBtn.textContent = "Editar Produto";
            submitBtn.style.display = "block";

            productModal.classList.add("active");
            document.body.style.overflow = "hidden";
        });
    });

    const openModalBtn = document.querySelector(".open-modal-btn");
    if (openModalBtn) {
        openModalBtn.addEventListener("click", () => {
            editingProductId = null;
            productForm.reset();
            submitBtn.textContent = "Adicionar Produto";

            submitBtn.style.display = "block";
            productModal.classList.add("active");
            document.body.style.overflow = "hidden";
        });
    }

    productForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(productForm);

        try {
            let response;

            if (editingProductId) {
                const params = new URLSearchParams();
                params.append('product_name', formData.get('product_name'));
                params.append('product_price', formData.get('product_price'));
                params.append('product_amount', formData.get('product_amount') || '0');
                params.append('product_id', editingProductId);

                response = await fetch("/api/produtos", {
                    method: "PUT",
                    credentials: "include",
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: params.toString(),
                });
            } else {
                response = await fetch("/api/produtos", {
                    method: "POST",
                    credentials: "include",
                    body: formData,
                });
            }

            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    window.feedback.success(result.message || (editingProductId ? "Produto atualizado com sucesso!" : "Produto cadastrado com sucesso!"));
                    setTimeout(() => location.reload(), 1000);
                } else {
                    window.feedback.error(result.message || "Erro na operação");
                }
            } else {
                if (response.status === 401 || response.status === 403) {
                    window.feedback.error("Sessão expirada. Faça login novamente.");
                    setTimeout(() => window.location.href = "/", 1500);
                } else {
                    const errorData = await response.json().catch(() => ({}));
                    window.feedback.error(errorData.message || (editingProductId ? "Erro ao atualizar produto." : "Erro ao cadastrar produto."));
                }
            }
        } catch (error) {
            console.error("Erro inesperado:", error);
            window.feedback.error("Erro inesperado ao processar a requisição!");
        }

        productModal.classList.remove("active");
        document.body.style.overflow = "";
        editingProductId = null;
        productForm.reset();
        submitBtn.textContent = "Adicionar Produto";
    });
});
