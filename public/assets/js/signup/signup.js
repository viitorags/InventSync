const btn_href_login = document.querySelector('.btn_href_login');
const form = document.getElementById('formRegister');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    try {
        const response = await fetch('/api/users', {
            method: 'POST',
            body: formData,
            credentials: 'include',
        });

        if (response.ok) {
            const resultado = await response.json();
            if (resultado.success) {
                console.log('Usuário criado com sucesso!', resultado);
                alert(resultado.message || 'Usuário cadastrado com sucesso!');
                window.location.href = '/dashboard';
            } else {
                alert(resultado.message || 'Erro ao cadastrar usuário');
            }
        } else {
            const erro = await response.json().catch(() => ({}));
            console.error('Erro ao cadastrar:', erro);
            alert(erro.message || 'Erro ao cadastrar usuário!');
        }
    } catch (error) {
        console.error('Erro inesperado:', error);
        alert('Erro inesperado!');
    }
});

btn_href_login.addEventListener('click', () => {
    window.location.href = '/';
});
