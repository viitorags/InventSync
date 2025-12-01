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
    List,
    Spin
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
import { useState, useEffect } from 'react';
import { API_ENDPOINTS, apiGet } from '../config/api.js';
import dayjs from 'dayjs';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

export default function Dashboard() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalPedidos: 0,
        totalClientes: 0,
        receitaTotal: 0,
        produtosEstoque: 0,
    });
    const [pedidosRecentes, setPedidosRecentes] = useState([]);
    const [produtosMaisVendidos, setProdutosMaisVendidos] = useState([]);
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const ordersResponse = await apiGet(API_ENDPOINTS.ORDERS, token);
            const ordersData = ordersResponse.ok ? await ordersResponse.json() : { data: [] };

            const customersResponse = await apiGet(API_ENDPOINTS.CUSTOMERS, token);
            const customersData = customersResponse.ok ? await customersResponse.json() : { data: [] };

            const productsResponse = await apiGet(API_ENDPOINTS.PRODUCTS, token);
            const productsData = productsResponse.ok ? await productsResponse.json() : { data: [] };

            const orders = ordersData.data || ordersData || [];
            const customers = customersData.data || customersData || [];
            const products = productsData.data || productsData || [];

            const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.order_price || 0), 0);

            setStats({
                totalPedidos: orders.length,
                totalClientes: customers.length,
                receitaTotal: totalRevenue,
                produtosEstoque: products.length,
            });

            const recentOrders = orders.slice(0, 5).map(order => ({
                key: order.order_id,
                client_name: order.customer_name,
                product: order.products ? order.products.join(', ') : 'N/A',
                value: `R$ ${parseFloat(order.order_price).toFixed(2).replace('.', ',')}`,
                status: order.order_status,
                date: dayjs(order.order_date).format('DD/MM/YYYY')
            }));

            setPedidosRecentes(recentOrders);

            const productCount = {};

            orders.forEach(order => {
                if (order.product_ids && Array.isArray(order.product_ids)) {
                    order.product_ids.forEach(productId => {
                        productCount[productId] = (productCount[productId] || 0) + 1;
                    });
                }
            });

            const topProducts = Object.entries(productCount)
                .map(([productId, count]) => {
                    const product = products.find(p => p.product_id === productId);
                    return {
                        name: product?.product_name || 'Produto desconhecido',
                        vendas: count,
                        percentual: 0
                    };
                })
                .sort((a, b) => b.vendas - a.vendas)
                .slice(0, 5);

            if (topProducts.length > 0) {
                const maxVendas = topProducts[0].vendas;
                topProducts.forEach(product => {
                    product.percentual = Math.round((product.vendas / maxVendas) * 100);
                });
            }

            setProdutosMaisVendidos(topProducts);
        } catch (error) {
            console.error('Erro ao buscar dados do dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

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
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '50px' }}>
                            <Spin size="large" />
                        </div>
                    ) : (
                        <>
                            <Row gutter={[16, 16]}>
                                <Col xs={24} sm={12} lg={6}>
                                    <Card className="stat-card" variant={false}>
                                        <Statistic
                                            title={<span style={{ color: 'rgba(255, 255, 255, 0.65)' }}>Total de Pedidos</span>}
                                            value={stats.totalPedidos}
                                            prefix={<ShoppingCartOutlined style={{ color: '#9146ff' }} />}
                                            valueStyle={{ color: 'rgba(255, 255, 255, 0.95)' }}
                                        />
                                    </Card>
                                </Col>
                                <Col xs={24} sm={12} lg={6}>
                                    <Card className="stat-card" variant={false}>
                                        <Statistic
                                            title={<span style={{ color: 'rgba(255, 255, 255, 0.65)' }}>Total de Clientes</span>}
                                            value={stats.totalClientes}
                                            prefix={<UserOutlined style={{ color: '#52c41a' }} />}
                                            valueStyle={{ color: 'rgba(255, 255, 255, 0.95)' }}
                                        />
                                    </Card>
                                </Col>
                                <Col xs={24} sm={12} lg={6}>
                                    <Card className="stat-card" variant={false}>
                                        <Statistic
                                            title={<span style={{ color: 'rgba(255, 255, 255, 0.65)' }}>Receita Total</span>}
                                            value={stats.receitaTotal}
                                            precision={2}
                                            prefix={<DollarOutlined style={{ color: '#faad14' }} />}
                                            valueStyle={{ color: 'rgba(255, 255, 255, 0.95)' }}
                                        />
                                    </Card>
                                </Col>
                                <Col xs={24} sm={12} lg={6}>
                                    <Card className="stat-card" variant={false}>
                                        <Statistic
                                            title={<span style={{ color: 'rgba(255, 255, 255, 0.65)' }}>Produtos em Estoque</span>}
                                            value={stats.produtosEstoque}
                                            prefix={<ShoppingCartOutlined style={{ color: '#722ed1' }} />}
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
                                        styles={{
                                            header: {
                                                borderBottom: '1px solid #2a2a2a',
                                                color: 'rgba(255, 255, 255, 0.95)'
                                            }
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
                                        styles={{
                                            header: {
                                                borderBottom: '1px solid #2a2a2a',
                                                color: 'rgba(255, 255, 255, 0.95)'
                                            }
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
                        </>
                    )}
                </Content>
            </Layout>
        </Layout>
    );
}
