<!doctype html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="/css/signup.css" />
    <title>Cadastro | Sistema de Estoque</title>
</head>

<body>
    <main>
        <div class="signup_form">
            <form id="formRegister" enctype="multipart/form-data">
                <h3>Criar Conta</h3>
                <div class="input_box">
                    <label for="name">Nome Completo</label>
                    <input type="text" name="user_name" id="name" required placeholder="Digite seu nome completo" />
                </div>
                <div class="input_box">
                    <label for="email">Email</label>
                    <input type="email" name="user_email" id="email" required autocomplete="email"
                        placeholder="Digite seu email" />
                </div>
                <div class="file_box">
                    <label for="profileImg">Foto de Perfil (até 1MB)</label>
                    <input type="file" name="user_img" id="user_img" accept="image/*" required />
                </div>
                <div class="input_box">
                    <label for="password">Senha</label>
                    <input type="password" name="user_password" id="password" required placeholder="Digite sua senha" />
                </div>
                <div class="input_box">
                    <label for="confirm_password">Confirmar Senha</label>
                    <input type="password" name="confirm_password" id="confirm_password" required
                        placeholder="Confirme sua senha" />
                </div>
                <div class="checkbox_area">
                    <input type="checkbox" name="terms" id="terms" required />
                    <label for="terms">Li e aceito os termos de uso</label>
                </div>
                <div class="link_box">
                    <a href="/">Já tem uma conta? Clique aqui</a>
                </div>
                <button type="submit" class="btn_signup">Cadastrar</button>
            </form>
        </div>
        <div class="signup_informations">
            <h2>Bem vindo ao Sistema de Estoque</h2>
            <div class="sign_icon">
                <img src="/images/icons/signup.svg" alt="" />
            </div>
            <p>Já tem uma conta? Faça login agora!</p>
            <button type="button" class="btn_href_login">Entrar</button>
        </div>
    </main>

    <script src="/js/signup/signup.js"></script>
</body>

</html>
