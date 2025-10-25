document.addEventListener("DOMContentLoaded", () => {
    const userConfigForm = document.getElementById("userConfigForm");
    const imgInput = document.getElementById("user_img");
    const imgPreview = document.getElementById("imgPreview");
    const uploadIcon = document.querySelector(".img-upload-icon");

    console.log('Configurations page loaded');
    console.log('Form:', userConfigForm);
    console.log('Feedback available:', typeof window.feedback);

    const openFileDialog = () => {
        if (imgInput) {
            imgInput.click();
        }
    };

    if (uploadIcon) {
        uploadIcon.addEventListener("click", openFileDialog);
        uploadIcon.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openFileDialog();
            }
        });
    }

    if (imgInput && imgPreview) {
        imgInput.addEventListener("change", (event) => {
            const [file] = event.target.files || [];
            console.log('Image input changed, file:', file);

            if (file) {
                console.log('File details:', {
                    name: file.name,
                    size: file.size,
                    type: file.type
                });

                const reader = new FileReader();
                reader.onload = (loadEvent) => {
                    imgPreview.src = loadEvent.target.result;
                    console.log('Image preview updated');
                };
                reader.readAsDataURL(file);
            } else {
                console.log('No file selected');
            }
        });
    }

    if (userConfigForm) {
        userConfigForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            console.log('Form submitted');

            const formData = new FormData(userConfigForm);

            const password = formData.get('user_password');
            const passwordConfirm = formData.get('user_password_confirm');

            if (password && passwordConfirm && password !== passwordConfirm) {
                console.warn('Password confirmation does not match');
                if (window.feedback) {
                    window.feedback.error("As senhas informadas não coincidem.");
                } else {
                    alert("As senhas informadas não coincidem.");
                }
                return;
            }

            if (!password || password.trim() === '') {
                formData.delete('user_password');
            }

            formData.delete('user_password_confirm');

            const imgFile = formData.get('user_img');
            console.log('Image file check:', imgFile, 'Size:', imgFile ? imgFile.size : 'no file');

            const hasImage = imgFile && imgFile.size > 0 && imgFile.name !== '';

            if (!hasImage) {
                formData.delete('user_img');
                console.log('Image removed from FormData (no file selected)');
            } else {
                console.log('Image will be uploaded:', imgFile.name, imgFile.size + ' bytes');
            }

            formData.append('_method', 'PUT');

            console.log('FormData prepared:', {
                name: formData.get('user_name'),
                email: formData.get('user_email'),
                hasPassword: formData.has('user_password'),
                hasImage: formData.has('user_img'),
                imageInfo: formData.has('user_img') ? {
                    name: formData.get('user_img').name,
                    size: formData.get('user_img').size,
                    type: formData.get('user_img').type
                } : 'none'
            });

            try {
                const response = await fetch("/api/users", {
                    method: "POST",
                    credentials: "include",
                    body: formData,
                });

                console.log('Response status:', response.status);

                if (response.ok) {
                    const result = await response.json();
                    console.log('Result:', result);

                    if (result.success) {
                        if (window.feedback) {
                            window.feedback.success(result.message || "Configurações atualizadas com sucesso!");
                        } else {
                            alert(result.message || "Configurações atualizadas com sucesso!");
                        }
                        setTimeout(() => location.reload(), 1000);
                    } else {
                        if (window.feedback) {
                            window.feedback.error(result.message || "Erro ao atualizar configurações");
                        } else {
                            alert(result.message || "Erro ao atualizar configurações");
                        }
                    }
                } else {
                    const errorData = await response.json().catch(() => ({}));
                    console.error('Error response:', errorData);

                    if (response.status === 401 || response.status === 403) {
                        if (window.feedback) {
                            window.feedback.error("Sessão expirada. Faça login novamente.");
                        } else {
                            alert("Sessão expirada. Faça login novamente.");
                        }
                        setTimeout(() => window.location.href = "/", 1500);
                    } else {
                        if (window.feedback) {
                            window.feedback.error(errorData.message || "Erro ao atualizar usuário.");
                        } else {
                            alert(errorData.message || "Erro ao atualizar usuário.");
                        }
                    }
                }
            } catch (error) {
                console.error("Erro inesperado:", error);
                if (window.feedback) {
                    window.feedback.error("Erro inesperado ao processar a requisição!");
                } else {
                    alert("Erro inesperado ao processar a requisição!");
                }
            }
        });
    }
});
