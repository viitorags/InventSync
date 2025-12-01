import { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Space, Upload } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, CameraOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api.js';

const { Title, Text } = Typography;

export default function Sign() {
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);
    const navigate = useNavigate();

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const response = await fetch(API_ENDPOINTS.REGISTER, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_name: values.name,
                    user_email: values.email,
                    user_avatar: imageUrl,
                    user_password: values.password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                message.success('Cadastro realizado com sucesso!');
                localStorage.setItem('token', data.access_token);
                setTimeout(() => {
                    navigate('/');
                }, 1000);
            } else {
                message.error(data.message || 'Erro ao criar conta. Tente novamente.');
            }
        } catch (error) {
            message.error('Erro ao criar conta. Tente novamente.');
            console.error('Erro:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = (info) => {
        const file = info.file;
        const reader = new FileReader();
        reader.onload = (e) => {
            setImageUrl(e.target.result);
        };
        if (file) {
            reader.readAsDataURL(file.originFileObj || file);
        }
    };

    const uploadButton = (
        <div style={{ color: 'rgba(255, 255, 255, 0.65)' }}>
            <CameraOutlined style={{ fontSize: 32, marginBottom: 8 }} />
            <div>Foto de Perfil</div>
        </div>
    );

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#141414',
            padding: '16px',
            overflow: 'auto'
        }}>
            <style>{`
				.signup-card {
					background: #1f1f1f !important;
					border: 1px solid #2a2a2a !important;
					border-radius: 12px !important;
					box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4) !important;
					margin: auto;
				}
				.signup-card .ant-card-body {
					padding: 28px 32px !important;
				}
				.avatar-uploader {
					width: 100px;
					height: 100px;
					border: 2px dashed #2a2a2a;
					border-radius: 50%;
					background: #141414;
					display: flex;
					align-items: center;
					justify-content: center;
					cursor: pointer;
					transition: all 0.3s;
					margin: 0 auto 16px;
					overflow: hidden;
				}
				.avatar-uploader:hover {
					border-color: #9146ff;
				}
				.avatar-uploader img {
					width: 100%;
					height: 100%;
					object-fit: cover;
				}
				.avatar-uploader > div {
					font-size: 11px;
				}
				.avatar-uploader .anticon {
					font-size: 24px !important;
					margin-bottom: 4px !important;
				}
				.signup-form .ant-form-item {
					margin-bottom: 14px !important;
				}
				@media (max-width: 576px) {
					.signup-card .ant-card-body {
						padding: 24px 20px !important;
					}
					.avatar-uploader {
						width: 90px;
						height: 90px;
					}
				}
			`}</style>
            <Card className="signup-card" style={{ width: '100%', maxWidth: 440, maxHeight: '98vh', overflow: 'auto' }}>
                <Space direction="vertical" size="small" style={{ width: '100%', textAlign: 'center' }}>
                    <div>
                        <Title level={2} style={{ color: 'rgba(255, 255, 255, 0.95)', marginBottom: 4, fontSize: 26 }}>
                            Criar Conta
                        </Title>
                        <Text style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: 14 }}>
                            Cadastre-se para começar
                        </Text>
                    </div>

                    <Form
                        name="signup"
                        onFinish={onFinish}
                        layout="vertical"
                        size="middle"
                        className="signup-form"
                        style={{ marginTop: 12 }}
                    >
                        <Form.Item name="avatar">
                            <Upload
                                name="avatar"
                                listType="picture-card"
                                className="avatar-uploader"
                                showUploadList={false}
                                beforeUpload={() => false}
                                onChange={handleImageUpload}
                                style={{ margin: '0 auto' }}
                            >
                                {imageUrl ? (
                                    <img src={imageUrl} alt="avatar" />
                                ) : (
                                    uploadButton
                                )}
                            </Upload>
                        </Form.Item>

                        <Form.Item
                            name="name"
                            rules={[
                                { required: true, message: 'Por favor, insira seu nome!' },
                                { min: 3, message: 'Nome deve ter no mínimo 3 caracteres!' }
                            ]}
                        >
                            <Input
                                prefix={<UserOutlined style={{ color: 'rgba(255, 255, 255, 0.45)' }} />}
                                placeholder="Nome Completo"
                                style={{
                                    background: '#141414',
                                    border: '1px solid #2a2a2a',
                                    color: 'rgba(255, 255, 255, 0.95)'
                                }}
                            />
                        </Form.Item>

                        <Form.Item
                            name="email"
                            rules={[
                                { required: true, message: 'Por favor, insira seu email!' },
                                { type: 'email', message: 'Email inválido!' }
                            ]}
                        >
                            <Input
                                prefix={<MailOutlined style={{ color: 'rgba(255, 255, 255, 0.45)' }} />}
                                placeholder="Email"
                                style={{
                                    background: '#141414',
                                    border: '1px solid #2a2a2a',
                                    color: 'rgba(255, 255, 255, 0.95)'
                                }}
                            />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            rules={[
                                { required: true, message: 'Por favor, insira sua senha!' },
                                { min: 6, message: 'Senha deve ter no mínimo 6 caracteres!' }
                            ]}
                            hasFeedback
                        >
                            <Input.Password
                                prefix={<LockOutlined style={{ color: 'rgba(255, 255, 255, 0.45)' }} />}
                                placeholder="Senha"
                                style={{
                                    background: '#141414',
                                    border: '1px solid #2a2a2a',
                                    color: 'rgba(255, 255, 255, 0.95)'
                                }}
                            />
                        </Form.Item>

                        <Form.Item
                            name="confirm"
                            dependencies={['password']}
                            hasFeedback
                            rules={[
                                { required: true, message: 'Por favor, confirme sua senha!' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('As senhas não coincidem!'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password
                                prefix={<LockOutlined style={{ color: 'rgba(255, 255, 255, 0.45)' }} />}
                                placeholder="Confirmar Senha"
                                style={{
                                    background: '#141414',
                                    border: '1px solid #2a2a2a',
                                    color: 'rgba(255, 255, 255, 0.95)'
                                }}
                            />
                        </Form.Item>

                        <Form.Item style={{ marginBottom: 12 }}>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                block
                                style={{
                                    height: 42,
                                    fontSize: 15,
                                    fontWeight: 600,
                                    background: '#9146ff',
                                    borderColor: '#9146ff'
                                }}
                            >
                                Cadastrar
                            </Button>
                        </Form.Item>

                        <div style={{ textAlign: 'center', marginTop: 8 }}>
                            <Text style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: 14 }}>
                                Já tem uma conta?{' '}
                                <Link to="/login" style={{ color: '#9146ff', fontWeight: 600 }}>
                                    Faça login
                                </Link>
                            </Text>
                        </div>
                    </Form>
                </Space>
            </Card>
        </div>
    );
}
