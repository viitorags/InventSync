import { useState } from 'react';
import { Form, Input, Button, Card, Typography, Checkbox, message, Space } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api.js';

const { Title, Text } = Typography;

export default function Login() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const response = await fetch(API_ENDPOINTS.LOGIN, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_email: values.email,
                    user_password: values.password,
                    remember: values.remember
                }),
            });

            const data = await response.json();

            if (response.ok) {
                message.success('Login realizado com sucesso!');
                localStorage.setItem('token', data.access_token);
                setTimeout(() => {
                    navigate('/');
                }, 1000);
            } else {
                message.error(data.message || 'Erro ao fazer login. Verifique suas credenciais.');
            }
        } catch (error) {
            message.error('Erro ao fazer login. Verifique suas credenciais.');
            console.error('Erro:', error);
        } finally {
            setLoading(false);
        }
    };

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
				.login-card {
					background: #1f1f1f !important;
					border: 1px solid #2a2a2a !important;
					border-radius: 12px !important;
					box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4) !important;
				}
				.login-card .ant-card-body {
					padding: 32px 32px !important;
				}
				@media (max-width: 576px) {
					.login-card .ant-card-body {
						padding: 24px 20px !important;
					}
				}
				.login-form .ant-form-item {
					margin-bottom: 16px !important;
				}
			`}</style>
            <Card className="login-card" style={{ width: '100%', maxWidth: 420 }}>
                <Space direction="vertical" size="middle" style={{ width: '100%', textAlign: 'center' }}>
                    <div>
                        <Title level={2} style={{ color: 'rgba(255, 255, 255, 0.95)', marginBottom: 4, fontSize: 28 }}>
                            Bem-vindo de volta
                        </Title>
                        <Text style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: 14 }}>
                            Faça login para continuar
                        </Text>
                    </div>

                    <Form
                        name="login"
                        onFinish={onFinish}
                        layout="vertical"
                        size="middle"
                        className="login-form"
                        style={{ marginTop: 16 }}
                    >
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
                            rules={[{ required: true, message: 'Por favor, insira sua senha!' }]}
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
                            name="remember"
                            valuePropName="checked"
                            initialValue={false}
                            style={{ marginBottom: 12 }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Checkbox style={{ color: 'rgba(255,255,255,0.85)' }}>
                                    Lembrar-me
                                </Checkbox>

                                <Link to="/forgot-password" style={{ color: '#9146ff' }}>
                                    Esqueceu a senha?
                                </Link>
                            </div>
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
                                Entrar
                            </Button>
                        </Form.Item>

                        <div style={{ textAlign: 'center', marginTop: 12 }}>
                            <Text style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: 14 }}>
                                Não tem uma conta?{' '}
                                <Link to="/register" style={{ color: '#9146ff', fontWeight: 600 }}>
                                    Cadastre-se
                                </Link>
                            </Text>
                        </div>
                    </Form>
                </Space>
            </Card>
        </div >
    );
}
