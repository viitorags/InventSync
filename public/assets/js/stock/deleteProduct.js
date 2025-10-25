document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll(".remove_product");

    buttons.forEach((button) => {
        button.addEventListener("click", async () => {
            const productId = button.getAttribute("data-id");
            if (confirm("Tem certeza que deseja remover este produto?")) {
                try {
                    const params = new URLSearchParams();
                    params.append('product_id', productId);

                    const response = await fetch("/api/produtos", {
                        method: "DELETE",
                        credentials: "include",
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body: params.toString(),
                    });

                    if (response.ok) {
                        const result = await response.json();
                        if (result.success) {
                            window.feedback.success(result.message || "Produto removido com sucesso!");
                            setTimeout(() => location.reload(), 1000);
                        } else {
                            window.feedback.error(result.message || "Erro ao remover produto");
                        }
                    } else {
                        if (response.status === 401 || response.status === 403) {
                            window.feedback.error("Sessão expirada. Faça login novamente.");
                            setTimeout(() => window.location.href = "/", 1500);
                        } else {
                            const errorData = await response.json().catch(() => ({}));
                            window.feedback.error("Erro ao remover produto: " + (errorData.message || "Erro desconhecido"));
                        }
                    }
                } catch (err) {
                    console.error("Erro ao remover produto:", err);
                    window.feedback.error("Erro de rede ao tentar remover produto.");
                }
            }
        });
    });
});
