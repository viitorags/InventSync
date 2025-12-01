import Sidebar from "../components/Sidebar.jsx";
import AppTable from "../components/AppTable.jsx";
import AppForm from "../components/AppForm.jsx";
import { Layout, Button, Tag, Form, Input, Select, DatePicker, InputNumber, message, Space } from 'antd';
import { MenuOutlined, PlusOutlined, UserOutlined, PhoneOutlined, DollarOutlined, FileExcelOutlined, FilePdfOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { API_ENDPOINTS, apiGet, apiPost, apiDelete, getAuthHeaders } from '../config/api.js';

const { Header, Content } = Layout;
const { TextArea } = Input;

export default function Orders() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [manualEntry, setManualEntry] = useState(false);
    const [form] = Form.useForm();
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchOrders();
        fetchProducts();
        fetchCustomers();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await apiGet(API_ENDPOINTS.ORDERS, token);

            if (response.ok) {
                const data = await response.json();

                const orders = data.data || data;

                if (!Array.isArray(orders)) {
                    console.error('❌ Orders não é um array:', orders);
                    message.error('Formato de dados inválido');
                    return;
                }

                const formattedData = orders.map(order => ({
                    key: order.order_id,
                    order_id: order.order_id,
                    client_name: order.customer_name,
                    client_number: order.customer_number,
                    product_name: order.products ? order.products.join(', ') : 'N/A',
                    order_details: order.order_details || 'Sem detalhes',
                    order_date: dayjs(order.order_date).format('DD/MM/YYYY'),
                    order_price: `R$ ${parseFloat(order.order_price).toFixed(2).replace('.', ',')}`,
                    order_status: order.order_status
                }));

                setTableData(formattedData);
            } else {
                message.error('Erro ao carregar pedidos');
            }
        } catch (error) {
            console.error('Erro ao buscar pedidos:', error);
            message.error('Erro ao carregar pedidos');
        } finally {
            setLoading(false);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await apiGet(API_ENDPOINTS.PRODUCTS, token);

            if (response.ok) {
                const data = await response.json();

                const products = data.data || data;
                setProducts(products);
            }
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
        }
    };

    const fetchCustomers = async () => {
        try {
            const response = await apiGet(API_ENDPOINTS.CUSTOMERS, token);

            if (response.ok) {
                const data = await response.json();

                const customers = data.data || data;
                setCustomers(customers);
            }
        } catch (error) {
            console.error('Erro ao buscar clientes:', error);
        }
    };

    const columns = [
        {
            title: "Cliente",
            dataIndex: "client_name",
            width: "15%",
            editable: true,
        },
        {
            title: "Telefone",
            dataIndex: "client_number",
            width: "12%",
            editable: true,
        },
        {
            title: "Produtos",
            dataIndex: "product_name",
            width: "20%",
            editable: false,
        },
        {
            title: "Detalhes",
            dataIndex: "order_details",
            width: "18%",
            editable: true,
        },
        {
            title: "Data",
            dataIndex: "order_date",
            width: "10%",
            editable: true,
        },
        {
            title: "Preço",
            dataIndex: "order_price",
            width: "10%",
            editable: true,
        },
        {
            title: "Status",
            dataIndex: "order_status",
            width: "10%",
            editable: false,
            render: (status) => {
                let color = status === 'pendente' ? 'gold' : status === 'concluído' ? 'green' : 'blue';
                return <Tag color={color}>{status}</Tag>;
            }
        },
    ];

    const handleDelete = async (key) => {
        try {
            const response = await apiDelete(API_ENDPOINTS.ORDER_BY_ID(key), token);

            if (response.ok) {
                message.success('Pedido removido com sucesso!');
                await fetchOrders();
            } else {
                const errorData = await response.json();
                message.error(errorData.message || 'Erro ao remover pedido');
            }
        } catch (error) {
            console.error('Erro ao deletar pedido:', error);
            message.error('Erro ao remover pedido');
        }
    };

    const handleUpdate = async (key, values) => {
        try {
            const payload = {
                customer_name: values.client_name,
                customer_number: values.client_number,
                order_date: values.order_date,
                order_status: values.order_status,
                order_price: values.order_price,
                products: values.products || []
            };

            const response = await fetch(`${API_ENDPOINTS.ORDER_BY_ID(key)}`, {
                method: 'PUT',
                headers: {
                    ...getAuthHeaders(token),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                message.success('Pedido atualizado com sucesso!');
                await fetchOrders();
            } else {
                const errorData = await response.json();
                message.error(errorData.message || 'Erro ao atualizar pedido');
            }
        } catch (error) {
            console.error('Erro ao atualizar pedido:', error);
            message.error('Erro ao atualizar pedido');
        }
    };

    const handleCustomerSelect = (value) => {
        if (value === 'manual') {
            setManualEntry(true);
            setSelectedCustomer(null);
            form.setFieldsValue({
                client_name: '',
                client_number: ''
            });
        } else {
            setManualEntry(false);
            const customer = customers.find(c => c.customer_id === value);
            setSelectedCustomer(customer);
            if (customer) {
                form.setFieldsValue({
                    client_name: customer.customer_name,
                    client_number: customer.customer_number
                });
            }
        }
    };

    const handleProductsChange = (selectedProductIds) => {
        const total = selectedProductIds.reduce((sum, productId) => {
            const product = products.find(p => p.product_id === productId);
            return sum + (product ? parseFloat(product.product_price) : 0);
        }, 0);

        form.setFieldsValue({
            order_price: total
        });
    };

    const handleAdd = async (values) => {
        setLoading(true);
        try {
            const response = await apiPost(
                API_ENDPOINTS.ORDERS,
                {
                    order_details: values.order_details || '',
                    order_date: values.order_date.format('YYYY-MM-DD'),
                    order_status: values.order_status,
                    order_price: values.order_price,
                    customer_name: values.client_name,
                    customer_number: values.client_number,
                    customer_id: selectedCustomer?.customer_id || null,
                    products: values.product_ids || [],
                },
                token
            );

            if (response.ok) {
                message.success('Pedido adicionado com sucesso!');
                form.resetFields();
                setModalOpen(false);
                setSelectedCustomer(null);
                setManualEntry(false);
                await fetchOrders();
            } else {
                const errorData = await response.json();
                console.error('Erro do servidor:', errorData);
                message.error(errorData.message || 'Erro ao adicionar pedido');
            }
        } catch (error) {
            console.error('Erro ao adicionar pedido:', error);
            message.error('Erro ao adicionar pedido');
        } finally {
            setLoading(false);
        }
    };

    const downloadReport = async (format) => {
        try {
            message.loading({ content: `Gerando relatório de vendas em ${format.toUpperCase()}...`, key: 'report' });

            const headers = getAuthHeaders(token);
            delete headers['Content-Type'];

            const response = await fetch(API_ENDPOINTS.REPORT_ORDERS(format), {
                method: 'GET',
                headers,
            });

            if (!response.ok) {
                throw new Error('Erro ao gerar relatório');
            }

            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;

            const fileName = `Relatorio_Vendas_${new Date().toISOString().split('T')[0]}.${format === 'excel' ? 'csv' : 'pdf'}`;
            link.download = fileName;

            document.body.appendChild(link);
            link.click();
            link.remove();

            window.URL.revokeObjectURL(downloadUrl);

            message.success({ content: 'Relatório gerado com sucesso!', key: 'report' });
        } catch (error) {
            console.error('Erro ao baixar relatório:', error);
            message.error({ content: 'Erro ao gerar relatório. Tente novamente.', key: 'report' });
        }
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
                    <h2 style={{ marginLeft: 10, color: 'rgba(255, 255, 255, 0.95)' }}>Pedidos</h2>
                </Header>
                <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
                    <div
                        style={{
                            padding: 24,
                            background: '#1f1f1f',
                            borderRadius: 12,
                            border: '1px solid #2a2a2a',
                        }}
                    >
                        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                            <Space wrap>
                                <Button
                                    type="primary"
                                    icon={<FileExcelOutlined />}
                                    onClick={() => downloadReport('excel')}
                                    style={{ background: '#52c41a', borderColor: '#52c41a' }}
                                >
                                    Relatório Excel
                                </Button>
                                <Button
                                    type="primary"
                                    icon={<FilePdfOutlined />}
                                    onClick={() => downloadReport('pdf')}
                                    style={{ background: '#ff4d4f', borderColor: '#ff4d4f' }}
                                >
                                    Relatório PDF
                                </Button>
                            </Space>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => setModalOpen(true)}
                                style={{ background: '#9146ff', borderColor: '#9146ff' }}
                            >
                                Adicionar Pedido
                            </Button>
                        </div>
                        <AppTable columns={columns} data={tableData} onDelete={handleDelete} onUpdate={handleUpdate} scroll={{ x: 1200 }} />
                    </div>

                    <AppForm
                        open={modalOpen}
                        onCancel={() => {
                            setModalOpen(false);
                            form.resetFields();
                            setSelectedCustomer(null);
                            setManualEntry(false);
                        }}
                        onFinish={handleAdd}
                        title="Adicionar Novo Pedido"
                        form={form}
                        width={600}
                    >
                        <Form.Item
                            name="customer_select"
                            label={<span style={{ color: 'rgba(255, 255, 255, 0.85)' }}>Selecionar Cliente</span>}
                        >
                            <Select
                                placeholder="Selecione um cliente ou insira manualmente"
                                onChange={handleCustomerSelect}
                                showSearch
                                filterOption={(input, option) =>
                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                                options={[
                                    {
                                        label: '➕ Inserir manualmente',
                                        value: 'manual'
                                    },
                                    ...customers.map(customer => ({
                                        label: `${customer.customer_name} - ${customer.customer_number}`,
                                        value: customer.customer_id
                                    }))
                                ]}
                            />
                        </Form.Item>

                        <Form.Item
                            name="client_name"
                            label={<span style={{ color: 'rgba(255, 255, 255, 0.85)' }}>Nome do Cliente</span>}
                            rules={[{ required: true, message: 'Por favor, insira o nome do cliente!' }]}
                        >
                            <Input
                                prefix={<UserOutlined />}
                                placeholder="Ex: João Silva"
                                disabled={!manualEntry && selectedCustomer !== null}
                            />
                        </Form.Item>

                        <Form.Item
                            name="client_number"
                            label={<span style={{ color: 'rgba(255, 255, 255, 0.85)' }}>Telefone</span>}
                            rules={[
                                { required: true, message: 'Por favor, insira o telefone!' },
                                { pattern: /^\(\d{2}\)\s?\d{4,5}-\d{4}$/, message: 'Formato: (11) 98765-4321' }
                            ]}
                        >
                            <Input
                                prefix={<PhoneOutlined />}
                                placeholder="(11) 98765-4321"
                                disabled={!manualEntry && selectedCustomer !== null}
                            />
                        </Form.Item>

                        <Form.Item
                            name="product_ids"
                            label={<span style={{ color: 'rgba(255, 255, 255, 0.85)' }}>Produtos</span>}
                            rules={[{ required: true, message: 'Por favor, selecione os produtos!' }]}
                        >
                            <Select
                                mode="multiple"
                                placeholder="Selecione os produtos"
                                showSearch
                                onChange={handleProductsChange}
                                filterOption={(input, option) =>
                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                                options={products.map(product => ({
                                    label: `${product.product_name} - R$ ${parseFloat(product.product_price).toFixed(2)}`,
                                    value: product.product_id
                                }))}
                            />
                        </Form.Item>

                        <Form.Item
                            name="order_details"
                            label={<span style={{ color: 'rgba(255, 255, 255, 0.85)' }}>Detalhes do Pedido</span>}
                        >
                            <TextArea rows={3} placeholder="Ex: Entrega urgente, embalagem especial..." />
                        </Form.Item>

                        <Form.Item
                            name="order_date"
                            label={<span style={{ color: 'rgba(255, 255, 255, 0.85)' }}>Data do Pedido</span>}
                            rules={[{ required: true, message: 'Por favor, selecione a data!' }]}
                            initialValue={dayjs()}
                        >
                            <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
                        </Form.Item>

                        <Form.Item
                            name="order_price"
                            label={<span style={{ color: 'rgba(255, 255, 255, 0.85)' }}>Preço Total (R$)</span>}
                            rules={[{ required: true, message: 'Por favor, insira o preço!' }]}
                        >
                            <InputNumber
                                prefix={<DollarOutlined />}
                                min={0}
                                step={0.01}
                                placeholder="Ex: 430.00"
                                style={{ width: '100%' }}
                                formatter={value => `R$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={value => value.replace(/R\$\s?|(,*)/g, '')}
                            />
                        </Form.Item>

                        <Form.Item
                            name="order_status"
                            label={<span style={{ color: 'rgba(255, 255, 255, 0.85)' }}>Status</span>}
                            rules={[{ required: true, message: 'Por favor, selecione o status!' }]}
                            initialValue="pendente"
                        >
                            <Select>
                                <Select.Option value="pendente">Pendente</Select.Option>
                                <Select.Option value="em andamento">Em Andamento</Select.Option>
                                <Select.Option value="concluído">Concluído</Select.Option>
                            </Select>
                        </Form.Item>
                    </AppForm>
                </Content>
            </Layout>
        </Layout >
    );
}
