<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (!isset($_SESSION['user_id'])) {
    header('Location: /');
    exit();
}

require_once __DIR__ . '/../Controllers/viewsController.php';

$viewsController = new ViewsController();
$userData = $viewsController->getUserData();
$user = $userData ?? [];
$profileImagePath = '/assets/images/profile.png';
if (!empty($user['user_img'])) {
    $profileImagePath = '/' . ltrim($user['user_img'], '/\\');
}
$userName = $user['user_name'] ?? ($_SESSION['user_name'] ?? 'Usuário');
$userEmail = $user['user_email'] ?? ($_SESSION['user_email'] ?? '');
?>

<!doctype html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <?php include __DIR__ . '/./partials/header.php'; ?>
    <link rel="stylesheet" href="/assets/css/configurations.css" />
    <title>Configurações | System Stock</title>
</head>

<body>
    <?php include __DIR__ . '/./partials/sidebar.php'; ?>

    <main class="config-container">
        <header class="page-header">
            <div class="page-header__text">
                <h1><i class="bi bi-gear-fill"></i> Configurações da Conta</h1>
                <p>Gerencie suas informações pessoais, mantenha o perfil atualizado e cuide da segurança.</p>
            </div>
            <span class="page-subtitle"><i class="bi bi-person-heart"></i> Olá, <?php echo htmlspecialchars($userName); ?>!</span>
        </header>

        <form id="userConfigForm" class="config-form" enctype="multipart/form-data">
            <div class="config-grid">
                <aside class="profile-card">
                    <div class="profile-img-wrapper">
                        <img src="<?php echo htmlspecialchars($profileImagePath); ?>"
                            alt="Foto de Perfil"
                            class="profile-img-preview"
                            id="imgPreview">
                        <div class="img-upload-icon" role="button" tabindex="0" aria-label="Enviar nova foto de perfil">
                            <i class="bi bi-camera-fill"></i>
                        </div>
                    </div>

                    <div class="profile-info">
                        <h2><?php echo htmlspecialchars($userName); ?></h2>
                        <p><?php echo $userEmail ? htmlspecialchars($userEmail) : 'Adicione um e-mail para receber notificações.'; ?></p>
                    </div>

                    <div class="profile-hints">
                        <div class="hint-item">
                            <i class="bi bi-image"></i>
                            <span>Use uma imagem quadrada para garantir o melhor enquadramento.</span>
                        </div>
                        <div class="hint-item">
                            <i class="bi bi-shield-check"></i>
                            <span>Informações seguras: somente você tem acesso a esses dados.</span>
                        </div>
                    </div>

                    <label for="user_img" class="profile-upload-label">
                        <i class="bi bi-cloud-upload-fill"></i>
                        Alterar foto
                    </label>
                    <input type="file"
                        name="user_img"
                        id="user_img"
                        accept="image/*">
                </aside>

                <div class="form-panels">
                    <section class="panel card-personal">
                        <header class="panel-header">
                            <div class="panel-icon"><i class="bi bi-person-fill"></i></div>
                            <div>
                                <h2>Dados pessoais</h2>
                                <p>Mantenha suas informações sempre atualizadas.</p>
                            </div>
                        </header>
                        <div class="panel-body">
                            <div class="input-grid">
                                <div class="form-group">
                                    <label for="user_name">Nome completo</label>
                                    <input type="text"
                                        id="user_name"
                                        name="user_name"
                                        value="<?php echo htmlspecialchars($userName); ?>"
                                        autocomplete="name"
                                        required>
                                </div>
                                <div class="form-group">
                                    <label for="user_email">E-mail</label>
                                    <input type="email"
                                        id="user_email"
                                        name="user_email"
                                        value="<?php echo htmlspecialchars($userEmail); ?>"
                                        autocomplete="email"
                                        required>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section class="panel card-security">
                        <header class="panel-header">
                            <div class="panel-icon"><i class="bi bi-shield-lock-fill"></i></div>
                            <div>
                                <h2>Segurança</h2>
                                <p>Atualize a senha quando achar necessário para reforçar a proteção.</p>
                            </div>
                        </header>
                        <div class="panel-body">
                            <div class="input-grid">
                                <div class="form-group">
                                    <label for="user_password">Nova senha</label>
                                    <input type="password"
                                        id="user_password"
                                        name="user_password"
                                        placeholder="Deixe em branco para manter a atual"
                                        autocomplete="new-password">
                                </div>
                                <div class="form-group">
                                    <label for="user_password_confirm">Confirmar senha</label>
                                    <input type="password"
                                        id="user_password_confirm"
                                        name="user_password_confirm"
                                        placeholder="Repita a nova senha"
                                        autocomplete="new-password">
                                </div>
                            </div>
                            <p class="panel-hint"><i class="bi bi-info-circle-fill"></i> Combine letras maiúsculas, minúsculas, números e símbolos para criar uma senha forte.</p>
                        </div>
                    </section>
                </div>
            </div>

            <!-- Ações do Formulário -->
            <div class="form-actions">
                <div class="buttons-container">
                    <button type="button" class="btn-cancel" onclick="window.location.href='/dashboard'">
                        <i class="bi bi-x-circle"></i>
                        Cancelar
                    </button>
                    <button type="submit" class="btn-save">
                        <i class="bi bi-check-circle"></i>
                        Salvar Alterações
                    </button>
                </div>
            </div>
        </form>
    </main>

    <script src="/assets/js/global.js"></script>
    <script src="/assets/js/configurations/editUser.js"></script>
</body>

</html>
