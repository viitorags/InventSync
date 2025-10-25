document.addEventListener("DOMContentLoaded", async () => {
    const orderForm = document.getElementById("ordersForm");
    const orderModal = document.getElementById("ordersModal");
    const submitBtn = orderForm.querySelector('button[type="submit"]');

    let editingOrderId = null;

    const editarButtons = document.querySelectorAll(".editar");
    editarButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const id = button.dataset.id;
            const name = button.dataset.name;
            const number = button.dataset.number;
            const details = button.dataset.details;
            const date = button.dataset.date;
            const price = button.dataset.price;
            const products = button.dataset.products;

            orderForm.order_details.value = details;
            orderForm.order_date.value = date;
            orderForm.client_name.value = name;
            orderForm.client_number.value = number;
            orderForm.order_price.value = price;
            orderForm.product_name = products;

            editingOrderId = id;

            submitBtn.textContent = "Editar Pedido";
            submitBtn.style.display = "block";

            orderModal.classList.add("active");
            document.body.style.overflow = "hidden";
        });
    });

    const visualizarButtons = document.querySelectorAll(".visualizar");
    visualizarButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const id = button.dataset.id;
            const name = button.dataset.name;
            const number = button.dataset.number;
            const details = button.dataset.details;
            const date = button.dataset.date;
            const price = button.dataset.price;
            const products = button.dataset.products;
            const status = button.dataset.status;
            const selectClient = orderForm.querySelector("#client_name");
            const selectStatus = orderForm.querySelector("#order_status");

            if (selectClient.tomselect) {
                selectClient.tomselect.destroy();
            }

            if (selectStatus.tomselect) {
                selectStatus.tomselect.destroy();
            }

            const inputClient = document.createElement("input");
            inputClient.type = "text";
            inputClient.id = "client_name";
            inputClient.name = "client_name";
            inputClient.value = name;
            inputClient.readOnly = true;
            inputClient.className = selectClient.className;

            const inputStatus = document.createElement("input");
            inputStatus.type = "text";
            inputStatus.id = "order_status";
            inputStatus.name = "order_status";
            inputStatus.value = status;
            inputStatus.readOnly = true;
            inputStatus.className = selectStatus.className;

            selectClient.parentNode.replaceChild(inputClient, selectClient);
            selectStatus.parentNode.replaceChild(inputStatus, selectStatus);

            orderForm.order_details.value = details;
            orderForm.order_date.value = date;
            orderForm.client_number.value = number;
            orderForm.order_price.value = price;
            orderForm.order_status.value = status;
            orderForm.products.value = products;

            submitBtn.style.display = "none";

            orderModal.classList.add("active");
            document.body.style.overflow = "hidden";
        });
    });

    const openModalBtn = document.querySelector(".open-modal-btn");
    if (openModalBtn) {
        openModalBtn.addEventListener("click", () => {
            editingOrderId = null;
            orderForm.reset();
            submitBtn.textContent = "Registrar Pedido";

            orderModal.classList.add("active");
            submitBtn.style.display = "block";

            document.body.style.overflow = "hidden";
        });
    }

    const productsSelect = document.getElementById("products");
    const orderPriceInput = document.getElementById("order_price");

    if (productsSelect && orderPriceInput) {
        productsSelect.addEventListener("change", () => {
            const selectedOptions = Array.from(productsSelect.selectedOptions);
            const total = selectedOptions.reduce((sum, option) => {
                const price = parseFloat(option.dataset.price) || 0;
                return sum + price;
            }, 0);
            orderPriceInput.value = total.toFixed(2);
        });
    }

    const clientSelect = document.getElementById("client_name");
    const clientIdInput = document.getElementById("client_id");
    const clientNumberInput = document.getElementById("client_number");

    if (clientSelect && clientIdInput && clientNumberInput) {
        const updateClientData = () => {
            const selectedOption = clientSelect.options[clientSelect.selectedIndex];
            if (selectedOption) {
                clientIdInput.value = selectedOption.dataset.id || '';
                clientNumberInput.value = selectedOption.dataset.number || '';
            }
        };

        updateClientData();

        clientSelect.addEventListener("change", updateClientData);
    }

    orderForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(orderForm);

        const productIds = Array.from(
            orderForm.querySelectorAll("#products option:checked"),
        ).map((opt) => parseInt(opt.value, 10));

        try {
            let response;

            if (editingOrderId) {
                const params = new URLSearchParams();
                params.append('order_details', formData.get('order_details'));
                params.append('order_date', formData.get('order_date'));
                params.append('client_name', formData.get('client_name'));
                params.append('client_number', formData.get('client_number'));
                params.append('client_id', formData.get('client_id'));
                params.append('order_price', formData.get('order_price'));
                params.append('order_id', editingOrderId);

                response = await fetch("/api/orders", {
                    method: "PUT",
                    credentials: "include",
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: params.toString(),
                });
            } else {
                formData.append('product_ids', JSON.stringify(productIds));

                response = await fetch("/api/orders", {
                    method: "POST",
                    credentials: "include",
                    body: formData,
                });
            }

            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    window.feedback.success(result.message || (editingOrderId ? "Pedido atualizado com sucesso!" : "Pedido cadastrado com sucesso!"));
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
                    window.feedback.error(errorData.message || (editingOrderId ? "Erro ao atualizar pedido." : "Erro ao cadastrar pedido."));
                }
            }
        } catch (error) {
            console.error("Erro inesperado:", error);
            window.feedback.error("Erro inesperado ao processar a requisição!");
        }

        orderModal.classList.remove("active");
        document.body.style.overflow = "";
        editingOrderId = null;
        orderForm.reset();
        submitBtn.textContent = "Registrar Pedido";
    });
});
