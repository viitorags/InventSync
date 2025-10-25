<?php

if (isset($_SESSION['user_id'])) {
    header('Location: /dashboard');
    exit();
}

?>

<!doctype html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="assets/css/index.css" />
    <title>Login | Sistema de Estoque</title>
</head>

<body>
    <main>
        <div class="login_informations">
            <h2>Bem vindo de volta!</h2>
            <div class="login_icon">
                <img src="assets/images/icons/login.svg" alt="" />
            </div>
            <p>Não tem uma conta ainda? Junte-se a nós!</p>
            <button type="button" class="btn_href_register">
                Criar Conta
            </button>
        </div>
        <div class="login_form">
            <form id="formLogin">
                <h3>Entrar</h3>
                <div class="input_box">
                    <label for="email">Email</label>
                    <input type="email" name="user_email" id="email" required autocomplete="email"
                        placeholder="Digite seu email" />
                </div>
                <div class="input_box">
                    <label for="password">Senha</label>
                    <input type="password" name="user_password" id="password" required placeholder="Digite sua senha" />
                </div>
                <div class="checkbox_area">
                    <input type="checkbox" name="rememberMe" id="rememberMe" />
                    <label for="remember">Lembrar acesso</label>
                </div>
                <div class="link_box">
                    <a href="/register">Não tem uma conta? Clique aqui</a>
                </div>
                <button type="submit" class="btn_login">Entrar</button>
            </form>
        </div>
    </main>

    <script src="assets/js/index/index.js"></script>
</body>

</html>
