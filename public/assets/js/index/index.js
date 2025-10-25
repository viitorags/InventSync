const btn_href_register = document.querySelector('.btn_href_register');
const form = document.getElementById('formLogin');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) {
        alert('Por favor, preencha todos os campos!');
        return;
    }

    const formData = new FormData();
    formData.append('user_email', email);
    formData.append('user_password', password);

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            body: formData,
            credentials: 'include',
        });

        if (response.ok) {
            const result = await response.json();
            if (result.success) {
                console.log('Usuário logado com sucesso!', result);
                window.location.href = '/dashboard';
            } else {
                alert(result.message || 'Erro no login');
            }
        } else {
            const error = await response.json().catch(() => ({}));
            console.error('Erro ao fazer login!', error);
            alert(error.message || 'Email ou senha incorretos');
        }
    } catch (error) {
        console.error('Erro inesperado:', error);
        alert('Erro inesperado!');
    }
});

btn_href_register.addEventListener('click', () => {
    window.location.href = '/register';
});
