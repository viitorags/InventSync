import Sidebar from "../components/Sidebar.jsx";
import {
    Layout,
    Button,
    Form,
    Input,
    Avatar,
    Upload,
    Card,
    Row,
    Col,
    Space,
    message,
    Typography
} from 'antd';
import {
    MenuOutlined,
    UserOutlined,
    LockOutlined,
    MailOutlined,
    CameraOutlined,
} from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { API_ENDPOINTS, apiGet, apiPut } from '../config/api.js';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

export default function Configurations() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [profileForm] = Form.useForm();
    const [passwordForm] = Form.useForm();

    useEffect(() => {
        async function loadUser() {
            const token = localStorage.getItem("token");

            try {
                const response = await apiGet(API_ENDPOINTS.ME, token);

                if (response.ok) {
                    const data = await response.json();

                    profileForm.setFieldsValue({
                        user_name: data.data.user_name,
                        user_email: data.data.user_email,
                    });

                    setUserSettings(prev => ({
                        ...prev,
                        user_avatar: data.data.user_avatar
                    }));
                } else {
                    message.error('Erro ao carregar dados do usuário');
                }
            } catch (error) {
                console.error('Erro ao carregar usuário:', error);
                message.error('Erro ao carregar dados do usuário');
            }
        }

        loadUser();
    }, [profileForm]);

    const handleProfileUpdate = async (values) => {
        setLoading(true);
        const token = localStorage.getItem("token");

        try {
            const updateData = {
                user_name: values.user_name,
                user_email: values.user_email,
            };

            if (userSettings.user_avatar && userSettings.user_avatar.startsWith('data:image')) {
                updateData.user_avatar = userSettings.user_avatar;
            }

            const UpdateResponse = await apiPut(API_ENDPOINTS.UPDATE_USER, updateData, token);

            if (UpdateResponse.ok) {
                message.success('Perfil atualizado com sucesso!');

                const userResponse = await apiGet(API_ENDPOINTS.ME, token);
                if (userResponse.ok) {
                    const userData = await userResponse.json();
                    const data = userData.data || userData;

                    setUserSettings(prev => ({
                        ...prev,
                        user_avatar: data.user_avatar
                    }));

                    profileForm.setFieldsValue({
                        user_name: data.user_name,
                        user_email: data.user_email,
                    });
                }
            } else {
                const errorData = await UpdateResponse.json();
                message.error(errorData.message || 'Erro ao atualizar perfil');
            }
        } catch (error) {
            console.error('Erro ao atualizar perfil:', error);
            message.error('Erro ao atualizar perfil');
        } finally {
            setLoading(false);
        }
    };

    const [userSettings, setUserSettings] = useState({
        user_avatar: null,
    });

    const handlePasswordChange = async (values) => {
        setLoading(true);
        const token = localStorage.getItem("token");

        try {
            const IdResponse = await apiGet(API_ENDPOINTS.ME, token);

            if (!IdResponse.ok) {
                throw new Error('Erro ao obter dados do usuário');
            }

            const IdData = await IdResponse.json();
            const userId = IdData.user_id;

            const UpdateResponse = await apiPut(
                API_ENDPOINTS.UPDATE_USER,
                {
                    user_id: userId,
                    user_password: values.new_password,
                },
                token
            );

            if (UpdateResponse.ok) {
                message.success('Senha alterada com sucesso!');
                passwordForm.resetFields();
            } else {
                const errorData = await UpdateResponse.json();
                message.error(errorData.message || 'Erro ao alterar senha');
            }
        } catch (error) {
            console.error('Erro ao alterar senha:', error);
            message.error('Erro ao alterar senha');
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarChange = (info) => {
        const file = info.file;
        const reader = new FileReader();
        reader.onload = (e) => {
            setUserSettings(prev => ({
                ...prev,
                user_avatar: e.target.result
            }));
            message.success('Avatar carregado! Clique em "Salvar Perfil" para confirmar.');
        };
        if (file) {
            reader.readAsDataURL(file.originFileObj || file);
        }
    };

    const toggleSetting = (setting, value) => {
        setUserSettings(prev => ({ ...prev, [setting]: value }));
        message.info(`${setting} ${value ? 'ativado' : 'desativado'}`);
    };

    return (
        <Layout hasSider style={{ minHeight: '100vh' }}>
            <Sidebar open={drawerOpen} onClose={() => setDrawerOpen(false)} />
            <Layout style={{ marginLeft: 200 }} className="main-layout">
                <style>{`
					@media (max-width: 992px) {
						.main-layout {
							margin-left: 0 !important;
						}
					}
					.menu-button {
						display: none;
					}
					@media (max-width: 991px) {
						.menu-button {
							display: inline-flex;
						}
					}
				`}</style>
                <Header style={{ padding: 0, background: '#1a1a1a', display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid #2a2a2a' }}>
                    <Button
                        type="text"
                        icon={<MenuOutlined />}
                        onClick={() => setDrawerOpen(true)}
                        className="menu-button"
                        style={{ marginLeft: '16px', fontSize: '18px' }}
                    />
                    <h2 style={{ marginLeft: 10, color: 'rgba(255, 255, 255, 0.95)' }}>Configurações</h2>
                </Header>
                <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} lg={12}>
                            <Card
                                title={
                                    <Space>
                                        <UserOutlined />
                                        <span>Perfil do Usuário</span>
                                    </Space>
                                }
                                style={{
                                    background: '#1f1f1f',
                                    borderRadius: 12,
                                    border: '1px solid #2a2a2a',
                                }}
                                styles={{
                                    header: {
                                        borderBottom: '1px solid #2a2a2a',
                                        color: 'rgba(255, 255, 255, 0.95)'
                                    }
                                }}
                            >
                                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                                    <div style={{ textAlign: 'center' }}>
                                        <Upload
                                            name="avatar"
                                            showUploadList={false}
                                            onChange={handleAvatarChange}
                                            customRequest={({ onSuccess }) => setTimeout(() => onSuccess("ok"), 0)}
                                        >
                                            <div style={{ cursor: 'pointer', position: 'relative', display: 'inline-block' }}>
                                                <Avatar
                                                    size={100}
                                                    src={userSettings.user_avatar || null}
                                                    icon={!userSettings.user_avatar ? <UserOutlined /> : null}
                                                />
                                                <Button
                                                    type="primary"
                                                    shape="circle"
                                                    icon={<CameraOutlined />}
                                                    size="small"
                                                    style={{
                                                        position: 'absolute',
                                                        bottom: 0,
                                                        right: 0,
                                                    }}
                                                />
                                            </div>
                                        </Upload>
                                        <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
                                            Clique para alterar foto
                                        </Text>
                                    </div>

                                    <Form
                                        form={profileForm}
                                        layout="vertical"
                                        onFinish={handleProfileUpdate}
                                    >
                                        <Form.Item
                                            label={<span style={{ color: 'rgba(255, 255, 255, 0.85)' }}>Nome</span>}
                                            name="user_name"
                                            rules={[{ required: true, message: 'Por favor, insira seu nome' }]}
                                        >
                                            <Input prefix={<UserOutlined />} placeholder="Seu nome" />
                                        </Form.Item>

                                        <Form.Item
                                            label={<span style={{ color: 'rgba(255, 255, 255, 0.85)' }}>Email</span>}
                                            name="user_email"
                                            rules={[
                                                { required: true, message: 'Por favor, insira seu email' },
                                                { type: 'email', message: 'Email inválido' }
                                            ]}
                                        >
                                            <Input prefix={<MailOutlined />} placeholder="seu@email.com" />
                                        </Form.Item>

                                        <Form.Item>
                                            <Button type="primary" htmlType="submit" loading={loading} block>
                                                Salvar Perfil
                                            </Button>
                                        </Form.Item>
                                    </Form>
                                </Space>
                            </Card>
                        </Col>

                        <Col xs={24} lg={12}>
                            <Card
                                title={
                                    <Space>
                                        <LockOutlined />
                                        <span>Segurança</span>
                                    </Space>
                                }
                                style={{
                                    background: '#1f1f1f',
                                    borderRadius: 12,
                                    border: '1px solid #2a2a2a',
                                }}
                                styles={{
                                    header: {
                                        borderBottom: '1px solid #2a2a2a',
                                        color: 'rgba(255, 255, 255, 0.95)'
                                    }
                                }}
                            >
                                <Form
                                    form={passwordForm}
                                    layout="vertical"
                                    onFinish={handlePasswordChange}
                                >
                                    <Form.Item
                                        label={<span style={{ color: 'rgba(255, 255, 255, 0.85)' }}>Senha Atual</span>}
                                        name="current_password"
                                        rules={[{ required: true, message: 'Insira sua senha atual' }]}
                                    >
                                        <Input.Password prefix={<LockOutlined />} placeholder="Senha atual" />
                                    </Form.Item>

                                    <Form.Item
                                        label={<span style={{ color: 'rgba(255, 255, 255, 0.85)' }}>Nova Senha</span>}
                                        name="new_password"
                                        rules={[
                                            { required: true, message: 'Insira a nova senha' },
                                            { min: 6, message: 'Senha deve ter no mínimo 6 caracteres' }
                                        ]}
                                    >
                                        <Input.Password prefix={<LockOutlined />} placeholder="Nova senha" />
                                    </Form.Item>

                                    <Form.Item
                                        label={<span style={{ color: 'rgba(255, 255, 255, 0.85)' }}>Confirmar Nova Senha</span>}
                                        name="confirm_password"
                                        dependencies={['new_password']}
                                        rules={[
                                            { required: true, message: 'Confirme a nova senha' },
                                            ({ getFieldValue }) => ({
                                                validator(_, value) {
                                                    if (!value || getFieldValue('new_password') === value) {
                                                        return Promise.resolve();
                                                    }
                                                    return Promise.reject(new Error('As senhas não coincidem'));
                                                },
                                            }),
                                        ]}
                                    >
                                        <Input.Password prefix={<LockOutlined />} placeholder="Confirme a nova senha" />
                                    </Form.Item>

                                    <Form.Item>
                                        <Button type="primary" htmlType="submit" loading={loading} block danger>
                                            Alterar Senha
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </Card>
                        </Col>
                    </Row>
                </Content>
            </Layout>
        </Layout>
    );
}

