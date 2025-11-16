import Sidebar from "../components/Sidebar.jsx";
import {
    Layout,
    Button,
    Form,
    Input,
    Avatar,
    Upload,
    Switch,
    Divider,
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
    BellOutlined,
    MoonOutlined,
    GlobalOutlined
} from '@ant-design/icons';
import { useState } from 'react';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

export default function Configurations() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const [userSettings, setUserSettings] = useState({
        user_name: 'Vitor',
        user_email: 'vitor@example.com',
        user_img: 'https://i.pravatar.cc/100',
        notifications: true,
        darkMode: true,
        language: 'pt-BR'
    });

    const handleProfileUpdate = async (values) => {
        setLoading(true);
        try {
            console.log('Atualizando perfil:', values);
            message.success('Perfil atualizado com sucesso!');
        } catch (error) {
            message.error('Erro ao atualizar perfil');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (values) => {
        setLoading(true);
        try {
            console.log('Alterando senha');
            message.success('Senha alterada com sucesso!');
            form.resetFields(['current_password', 'new_password', 'confirm_password']);
        } catch (error) {
            message.error('Erro ao alterar senha');
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarChange = (info) => {
        if (info.file.status === 'done') {
            message.success('Avatar atualizado com sucesso!');
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
                                headStyle={{
                                    borderBottom: '1px solid #2a2a2a',
                                    color: 'rgba(255, 255, 255, 0.95)'
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
                                                    src={userSettings.user_img}
                                                    icon={<UserOutlined />}
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
                                        layout="vertical"
                                        initialValues={{
                                            user_name: userSettings.user_name,
                                            user_email: userSettings.user_email,
                                        }}
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
                                headStyle={{
                                    borderBottom: '1px solid #2a2a2a',
                                    color: 'rgba(255, 255, 255, 0.95)'
                                }}
                            >
                                <Form
                                    form={form}
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

                        {/* <Col xs={24}> */}
                        {/* 	<Card */}
                        {/* 		title={ */}
                        {/* 			<Space> */}
                        {/* 				<GlobalOutlined /> */}
                        {/* 				<span>Preferências</span> */}
                        {/* 			</Space> */}
                        {/* 		} */}
                        {/* 		style={{ */}
                        {/* 			background: '#1f1f1f', */}
                        {/* 			borderRadius: 12, */}
                        {/* 			border: '1px solid #2a2a2a', */}
                        {/* 		}} */}
                        {/* 		headStyle={{ */}
                        {/* 			borderBottom: '1px solid #2a2a2a', */}
                        {/* 			color: 'rgba(255, 255, 255, 0.95)' */}
                        {/* 		}} */}
                        {/* 	> */}
                        {/* 		<Space direction="vertical" size="large" style={{ width: '100%' }}> */}
                        {/**/}
                        {/* 			<Divider style={{ borderColor: '#2a2a2a', margin: '12px 0' }} /> */}
                        {/**/}
                        {/* 			<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}> */}
                        {/* 				<Space> */}
                        {/* 					<GlobalOutlined style={{ fontSize: '18px' }} /> */}
                        {/* 					<div> */}
                        {/* 						<div style={{ color: 'rgba(255, 255, 255, 0.95)' }}>Idioma</div> */}
                        {/* 						<Text type="secondary" style={{ fontSize: '12px' }}> */}
                        {/* 							Português (Brasil) */}
                        {/* 						</Text> */}
                        {/* 					</div> */}
                        {/* 				</Space> */}
                        {/* 				<Button type="default">Alterar</Button> */}
                        {/* 			</div> */}
                        {/* 		</Space> */}
                        {/* 	</Card> */}
                        {/* </Col> */}
                    </Row>
                </Content>
            </Layout>
        </Layout>
    );
}

