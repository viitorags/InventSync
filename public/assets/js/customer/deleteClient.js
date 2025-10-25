document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.remove_product');

    buttons.forEach((button) => {
        button.addEventListener('click', async () => {
            const clientId = button.getAttribute('data-id');
            if (confirm('Tem certeza que deseja remover este cliente?')) {
                try {
                    const params = new URLSearchParams();
                    params.append('client_id', clientId);

                    const response = await fetch('/api/clients', {
                        method: 'DELETE',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body: params.toString(),
                    });

                    if (response.ok) {
                        const result = await response.json();
                        if (result.success) {
                            window.feedback.success(result.message || 'Cliente removido com sucesso!');
                            setTimeout(() => location.reload(), 1000);
                        } else {
                            window.feedback.error(result.message || 'Erro ao remover cliente');
                        }
                    } else {
                        if (
                            response.status === 401 ||
                            response.status === 403
                        ) {
                            window.feedback.error('Sessão expirada. Faça login novamente.');
                            setTimeout(() => window.location.href = '/', 1500);
                        } else {
                            const errorData = await response
                                .json()
                                .catch(() => ({}));
                            window.feedback.error(
                                'Erro ao remover cliente: ' +
                                    (errorData.message || 'Erro desconhecido')
                            );
                        }
                    }
                } catch (err) {
                    console.error('Erro ao remover cliente:', err);
                    window.feedback.error('Erro de rede ao tentar remover cliente.');
                }
            }
        });
    });
});
