<?php
require_once __DIR__ . "/../../Controllers/viewsController.php";

$viewsController = new ViewsController();
$user = $viewsController->getUserData();
$userImg = $user['user_img'] ?? '/assets/images/profile.png';
$userName = $_SESSION['user_name'] ?? 'Usuário';
$date = date("d/m/Y");
?>

<nav id="sidebar">
    <div id="sidebar_content">
        <div id="user">
            <?php echo "<img src='$userImg' id='user_avatar' alt='Avatar' />" ?>
            <p id="user_infos">
                <?php echo "<span class='item-description user_name'>$_SESSION[user_name]</span>" ?>
                <?php echo "<span class='item-description info_data'>$date</span>" ?>
            </p>
        </div>

        <ul id="side_items">
            <li class="side-item active">
                <a href="/dashboard">
                    <i class="fa-solid fa-chart-line"></i>
                    <span class="item-description">Dashboard</span>
                </a>
            </li>

            <li class="side-item">
                <a href="/stock">
                    <i class="fa-solid fa-box"></i>
                    <span class="item-description">Estoque</span>
                </a>
            </li>

            <li class="side-item">
                <a href="/customer">
                    <i class="fa-solid fa-user"></i>
                    <span class="item-description">Clientes</span>
                </a>
            </li>

            <li class="side-item">
                <a href="/orders">
                    <i class="fa-solid fa-cash-register"></i>
                    <span class="item-description">Pedidos</span>
                </a>
            </li>

            <li class="side-item">
                <a href="/configurations">
                    <i class="fa-solid fa-gear"></i>
                    <span class="item-description">
                        Configurações
                    </span>
                </a>
            </li>
        </ul>

        <button id="open_btn">
            <i id="open_btn_icon" class="fa-solid fa-chevron-right"></i>
        </button>
    </div>

    <div id="logout">
        <button id="logout_btn">
            <i class="fa-solid fa-right-from-bracket"></i>
            <span class="item-description">Logout</span>
        </button>
    </div>
</nav>
