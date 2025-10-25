document.addEventListener("DOMContentLoaded", async () => {
    const customerForm = document.getElementById("customerForm");
    const customerModal = document.getElementById("customerModal");
    const submitBtn = customerForm.querySelector('button[type="submit"]');

    let editingClientId = null;

    const editarButtons = document.querySelectorAll(".editar");
    editarButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const id = button.dataset.id;
            const name = button.dataset.name;
            const number = button.dataset.number;

            customerForm.client_name.value = name;
            customerForm.client_number.value = number;

            editingClientId = id;

            submitBtn.textContent = "Editar Cliente";
            submitBtn.style.display = "block";

            customerModal.classList.add("active");
            document.body.style.overflow = "hidden";
        });
    });

    const visualizarButtons = document.querySelectorAll(".visualizar");
    visualizarButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const id = button.dataset.id;
            const name = button.dataset.name;
            const number = button.dataset.number;

            customerForm.client_name.value = name;
            customerForm.client_number.value = number;

            submitBtn.style.display = "none";

            customerModal.classList.add("active");
            document.body.style.overflow = "hidden";
        });
    });

    const openModalBtn = document.querySelector(".open-modal-btn");
    if (openModalBtn) {
        openModalBtn.addEventListener("click", () => {
            editingClientId = null;
            customerForm.reset();
            submitBtn.textContent = "Adicionar Cliente";

            submitBtn.style.display = "block";
            customerModal.classList.add("active");
            document.body.style.overflow = "hidden";
        });
    }

    customerForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(customerForm);

        try {
            let response;

            if (editingClientId) {
                const params = new URLSearchParams();
                params.append('client_name', formData.get('client_name'));
                params.append('client_number', formData.get('client_number'));
                params.append('client_id', editingClientId);

                response = await fetch("/api/clients", {
                    method: "PUT",
                    credentials: "include",
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: params.toString(),
                });
            } else {
                response = await fetch("/api/clients", {
                    method: "POST",
                    credentials: "include",
                    body: formData,
                });
            }

            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    window.feedback.success(result.message || (editingClientId ? "Cliente atualizado com sucesso!" : "Cliente cadastrado com sucesso!"));
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
                    window.feedback.error(errorData.message || (editingClientId ? "Erro ao atualizar cliente." : "Erro ao cadastrar cliente."));
                }
            }
        } catch (error) {
            console.error("Erro inesperado:", error);
            window.feedback.error("Erro inesperado ao processar a requisição!");
        }
    });
});
