const menu = document.querySelector('.sidebar_menu');
const menuItems = document.querySelector('#side_items .side_item');

document.getElementById('open_btn').addEventListener('click', function () {
    document.getElementById('sidebar').classList.toggle('open-sidebar');
});

document.addEventListener('DOMContentLoaded', function () {
    const openModalButtons = document.querySelectorAll('.open-modal-btn');
    const modalOverlays = document.querySelectorAll('.modal-overlay');
    const closeModalButtons = document.querySelectorAll('.modal-close');
    const productForm = document.getElementById('productForm');

    openModalButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const targetModal = document.getElementById(
                button.dataset.modalTarget
            );
            if (targetModal) {
                targetModal.classList.add('active');
                document.body.style.overflow = 'hidden';

                if (targetModal.id === 'productModal') {
                    productForm.reset();
                }
            }
        });
    });

    closeModalButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal-overlay');
            modal.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    modalOverlays.forEach((overlay) => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            modalOverlays.forEach((overlay) => {
                overlay.classList.remove('active');
            });
            document.body.style.overflow = '';
        }
    });
});

window.addEventListener('DOMContentLoaded', () => {
    const infoName = document.querySelector('.user_name');
    const infoDate = document.querySelector('.info_data');
    const profileImg = document.querySelector('#user_avatar');

    if (!infoName || !infoDate || !profileImg) return;

    fetch('/api/users', {
        credentials: 'include',
    })
        .then((res) => {
            if (!res.ok) {
                if (res.status === 401 || res.status === 403) {
                    throw new Error('Não autenticado');
                }
                throw new Error('Erro ao carregar perfil');
            }
            return res.json();
        })
        .then((user) => {
            if (user && user.name) {
                const [firstName, secondName] = user.name.split(' ');
                const displayName = [firstName, secondName]
                    .filter(Boolean)
                    .join(' ');
                infoName.textContent = `${displayName}`;
                infoDate.innerHTML = `<i class="bi bi-calendar"></i> ${new Date().toLocaleDateString()}`;

                if (user.user_img) {
                    profileImg.src = user.user_img;
                } else {
                    profileImg.src = 'assets/images/profile.png';
                }
            }
        })
        .catch((err) => {
            console.error('Erro ao carregar perfil:', err);
            if (err.message.includes('autenticado')) {
                if (
                    window.location.pathname !== '/' &&
                    window.location.pathname !== '/register'
                ) {
                    window.location.href = '/';
                }
            }
        });
});

const logoutBtn = document.getElementById('logout_btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        fetch('/api/logout', {
            method: 'POST',
            credentials: 'include',
        })
            .then((res) => {
                if (!res.ok) throw new Error('Logout falhou');
                window.location.href = '/';
            })
            .catch((err) => {
                console.error('Erro ao fazer logout:', err);
            });
    });
}
