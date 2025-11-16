import Sidebar from "../components/Sidebar";
import {
    Layout,
    Button,
    Card,
    Row,
    Col,
    Statistic,
    Progress,
    Table,
    Tag,
    Typography,
    Space,
    Avatar,
    List
} from 'antd';
import {
    MenuOutlined,
    ShoppingCartOutlined,
    UserOutlined,
    DollarOutlined,
    RiseOutlined,
    FallOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined
} from '@ant-design/icons';
import { useState } from 'react';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

export default function Dashboard() {
    const [drawerOpen, setDrawerOpen] = useState(false);

    const stats = {
        totalPedidos: 156,
        pedidosCrescimento: 12.5,
        totalClientes: 89,
        clientesCrescimento: 8.3,
        receitaTotal: 45780.50,
        receitaCrescimento: 15.2,
        produtosEstoque: 324,
        produtosBaixoEstoque: 12
    };

    const pedidosRecentes = [
        {
            key: '1',
            client_name: 'João Silva',
            product: 'Teclado Mecânico',
            value: 'R$ 250,00',
            status: 'pendente',
            date: 'Hoje, 14:30'
        },
        {
            key: '2',
            client_name: 'Maria Santos',
            product: 'Mouse Gamer',
            value: 'R$ 180,00',
            status: 'concluído',
            date: 'Hoje, 12:15'
        },
        {
            key: '3',
            client_name: 'Pedro Costa',
            product: 'Monitor 24"',
            value: 'R$ 950,00',
            status: 'em andamento',
            date: 'Ontem, 16:45'
        },
    ];

    const produtosMaisVendidos = [
        { name: 'Teclado Mecânico', vendas: 45, percentual: 85 },
        { name: 'Mouse Gamer', vendas: 38, percentual: 72 },
        { name: 'Monitor 24"', vendas: 32, percentual: 60 },
        { name: 'Headset', vendas: 28, percentual: 53 },
        { name: 'Webcam HD', vendas: 21, percentual: 40 },
    ];

    const columns = [
        {
            title: 'Cliente',
            dataIndex: 'client_name',
            key: 'client_name',
        },
        {
            title: 'Produto',
            dataIndex: 'product',
            key: 'product',
        },
        {
            title: 'Valor',
            dataIndex: 'value',
            key: 'value',
            width: 120,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 120,
            render: (status) => {
                let color = status === 'pendente' ? 'gold' : status === 'concluído' ? 'green' : 'blue';
                return <Tag color={color}>{status}</Tag>;
            }
        },
        {
            title: 'Data',
            dataIndex: 'date',
            key: 'date',
            width: 150,
        },
    ];

    return (
        <Layout style={{ minHeight: '100vh' }}>
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
					.stat-card {
						background: #1f1f1f !important;
						border: 1px solid #2a2a2a !important;
						border-radius: 12px !important;
					}
					.stat-card .ant-card-body {
						padding: 20px !important;
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
                    <h2 style={{ marginLeft: 10, color: 'rgba(255, 255, 255, 0.95)' }}>Dashboard</h2>
                </Header>
                <Content style={{ margin: '24px 16px 0' }}>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12} lg={6}>
                            <Card className="stat-card" bordered={false}>
                                <Statistic
                                    title={<span style={{ color: 'rgba(255, 255, 255, 0.65)' }}>Total de Pedidos</span>}
                                    value={stats.totalPedidos}
                                    prefix={<ShoppingCartOutlined style={{ color: '#9146ff' }} />}
                                    suffix={
                                        <span style={{ fontSize: '14px', color: '#52c41a' }}>
                                            <RiseOutlined /> {stats.pedidosCrescimento}%
                                        </span>
                                    }
                                    valueStyle={{ color: 'rgba(255, 255, 255, 0.95)' }}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                            <Card className="stat-card" bordered={false}>
                                <Statistic
                                    title={<span style={{ color: 'rgba(255, 255, 255, 0.65)' }}>Total de Clientes</span>}
                                    value={stats.totalClientes}
                                    prefix={<UserOutlined style={{ color: '#52c41a' }} />}
                                    suffix={
                                        <span style={{ fontSize: '14px', color: '#52c41a' }}>
                                            <RiseOutlined /> {stats.clientesCrescimento}%
                                        </span>
                                    }
                                    valueStyle={{ color: 'rgba(255, 255, 255, 0.95)' }}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                            <Card className="stat-card" bordered={false}>
                                <Statistic
                                    title={<span style={{ color: 'rgba(255, 255, 255, 0.65)' }}>Receita Total</span>}
                                    value={stats.receitaTotal}
                                    precision={2}
                                    prefix={<DollarOutlined style={{ color: '#faad14' }} />}
                                    suffix={
                                        <span style={{ fontSize: '14px', color: '#52c41a' }}>
                                            <RiseOutlined /> {stats.receitaCrescimento}%
                                        </span>
                                    }
                                    valueStyle={{ color: 'rgba(255, 255, 255, 0.95)' }}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                            <Card className="stat-card" bordered={false}>
                                <Statistic
                                    title={<span style={{ color: 'rgba(255, 255, 255, 0.65)' }}>Produtos em Estoque</span>}
                                    value={stats.produtosEstoque}
                                    prefix={<ShoppingCartOutlined style={{ color: '#722ed1' }} />}
                                    suffix={
                                        <span style={{ fontSize: '12px', color: '#ff4d4f' }}>
                                            {stats.produtosBaixoEstoque} baixos
                                        </span>
                                    }
                                    valueStyle={{ color: 'rgba(255, 255, 255, 0.95)' }}
                                />
                            </Card>
                        </Col>
                    </Row>

                    <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                        <Col xs={24} lg={14}>
                            <Card
                                title={
                                    <Space>
                                        <ClockCircleOutlined />
                                        <span>Pedidos Recentes</span>
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
                                <Table
                                    columns={columns}
                                    dataSource={pedidosRecentes}
                                    pagination={false}
                                    size="small"
                                    scroll={{ x: 768 }}
                                />
                            </Card>
                        </Col>

                        <Col xs={24} lg={10}>
                            <Card
                                title={
                                    <Space>
                                        <RiseOutlined />
                                        <span>Produtos Mais Vendidos</span>
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
                                <List
                                    dataSource={produtosMaisVendidos}
                                    renderItem={(item) => (
                                        <List.Item style={{ border: 'none', padding: '12px 0' }}>
                                            <div style={{ width: '100%' }}>
                                                <div style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    marginBottom: 8,
                                                    color: 'rgba(255, 255, 255, 0.95)'
                                                }}>
                                                    <span>{item.name}</span>
                                                    <span style={{ color: '#9146ff' }}>{item.vendas} vendas</span>
                                                </div>
                                                <Progress
                                                    percent={item.percentual}
                                                    showInfo={false}
                                                    strokeColor={{
                                                        '0%': '#9146ff',
                                                        '100%': '#52c41a',
                                                    }}
                                                />
                                            </div>
                                        </List.Item>
                                    )}
                                />
                            </Card>
                        </Col>
                    </Row>

                    <Row gutter={[16, 16]} style={{ marginTop: 16, marginBottom: 24 }}>
                        <Col xs={24}>
                            <Card
                                title={
                                    <Space>
                                        <CheckCircleOutlined />
                                        <span>Atividade Recente</span>
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
                                <List
                                    itemLayout="horizontal"
                                    dataSource={[
                                        {
                                            icon: <ShoppingCartOutlined style={{ color: '#9146ff' }} />,
                                            title: 'Novo pedido #456789',
                                            description: 'João Silva fez um pedido de Teclado Mecânico',
                                            time: 'há 15 minutos'
                                        },
                                        {
                                            icon: <UserOutlined style={{ color: '#52c41a' }} />,
                                            title: 'Novo cliente cadastrado',
                                            description: 'Maria Santos se registrou no sistema',
                                            time: 'há 1 hora'
                                        },
                                        {
                                            icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
                                            title: 'Pedido concluído',
                                            description: 'Pedido #456788 foi entregue e finalizado',
                                            time: 'há 2 horas'
                                        },
                                        {
                                            icon: <ShoppingCartOutlined style={{ color: '#faad14' }} />,
                                            title: 'Estoque atualizado',
                                            description: '50 unidades de Mouse Gamer adicionadas',
                                            time: 'há 3 horas'
                                        },
                                    ]}
                                    renderItem={(item) => (
                                        <List.Item style={{ border: 'none' }}>
                                            <List.Item.Meta
                                                avatar={
                                                    <Avatar
                                                        icon={item.icon}
                                                        style={{ background: 'rgba(24, 144, 255, 0.1)' }}
                                                    />
                                                }
                                                title={
                                                    <span style={{ color: 'rgba(255, 255, 255, 0.95)' }}>
                                                        {item.title}
                                                    </span>
                                                }
                                                description={
                                                    <span style={{ color: 'rgba(255, 255, 255, 0.65)' }}>
                                                        {item.description}
                                                    </span>
                                                }
                                            />
                                            <Text type="secondary" style={{ fontSize: 12 }}>
                                                {item.time}
                                            </Text>
                                        </List.Item>
                                    )}
                                />
                            </Card>
                        </Col>
                    </Row>
                </Content>
            </Layout>
        </Layout>
    );
}
