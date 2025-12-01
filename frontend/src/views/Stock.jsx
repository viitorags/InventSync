import React, { useState, useEffect } from "react";
import { Layout, Button, Form, Input, InputNumber, message, Space, Card } from "antd";
import { MenuOutlined, PlusOutlined, FileExcelOutlined, FilePdfOutlined } from '@ant-design/icons';
import Sidebar from "../components/Sidebar.jsx";
import AppTable from "../components/AppTable.jsx";
import AppForm from "../components/AppForm.jsx";
import { API_ENDPOINTS, apiGet, apiPost, apiDelete, getAuthHeaders } from '../config/api.js';

const { Header, Content } = Layout;
const { TextArea } = Input;

export default function Stock() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem('token');
    const [form] = Form.useForm();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await apiGet(API_ENDPOINTS.PRODUCTS, token);

            if (response.ok) {
                const data = await response.json();

                const products = data.data || data;

                if (!Array.isArray(products)) {
                    console.error('❌ Products não é um array:', products);
                    message.error('Formato de dados inválido');
                    return;
                }

                const formattedData = products.map(product => ({
                    key: product.product_id,
                    product_id: product.product_id,
                    name: product.product_name,
                    quantity: product.product_amount,
                    price: `R$ ${parseFloat(product.product_price).toFixed(2).replace('.', ',')}`,
                    description: product.product_desc
                }));

                setTableData(formattedData);
            } else {
                message.error('Erro ao carregar produtos');
            }
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
            message.error('Erro ao carregar produtos');
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: "Produto",
            dataIndex: "name",
            editable: true,
            width: "25%",
        },
        {
            title: "Quantidade",
            dataIndex: "quantity",
            editable: true,
            width: "15%",
        },
        {
            title: "Preço",
            dataIndex: "price",
            editable: true,
            width: "15%",
        },
        {
            title: "Descrição",
            dataIndex: "description",
            editable: true,
            width: "30%",
        },
    ];

    const handleDelete = async (key) => {
        try {
            const response = await apiDelete(API_ENDPOINTS.PRODUCT_BY_ID(key), token);

            if (response.ok) {
                message.success('Produto removido com sucesso!');
                await fetchProducts();
            } else {
                const errorData = await response.json();
                message.error(errorData.message || 'Erro ao remover produto');
            }
        } catch (error) {
            console.error('Erro ao deletar produto:', error);
            message.error('Erro ao remover produto');
        }
    };

    const handleUpdate = async (key, values) => {
        try {
            const price = typeof values.price === 'string'
                ? parseFloat(values.price.replace('R$', '').replace(',', '.').trim())
                : values.price;

            const response = await fetch(API_ENDPOINTS.PRODUCT_BY_ID(key), {
                method: 'PUT',
                headers: getAuthHeaders(token),
                body: JSON.stringify({
                    product_name: values.name,
                    product_price: price,
                    product_amount: values.quantity,
                    product_desc: values.description || 'Sem descrição',
                }),
            });

            if (response.ok) {
                message.success('Produto atualizado com sucesso!');
                await fetchProducts();
            } else {
                const errorData = await response.json();
                message.error(errorData.message || 'Erro ao atualizar produto');
            }
        } catch (error) {
            console.error('Erro ao atualizar produto:', error);
            message.error('Erro ao atualizar produto');
        }
    };

    const handleAdd = async (values) => {
        setLoading(true);
        try {
            const response = await apiPost(
                API_ENDPOINTS.PRODUCTS,
                {
                    product_name: values.name,
                    product_price: values.price,
                    product_amount: values.quantity,
                    product_desc: values.description || 'Sem descrição',
                },
                token
            );

            if (response.ok) {
                message.success('Produto adicionado com sucesso!');
                form.resetFields();
                setModalOpen(false);
                await fetchProducts();
            } else {
                const errorData = await response.json();
                console.error('Erro do servidor:', errorData);
                message.error(errorData.message || 'Erro ao adicionar produto');
            }
        } catch (error) {
            console.error('Erro ao adicionar produto:', error);
            message.error('Erro ao adicionar produto');
        } finally {
            setLoading(false);
        }
    };

    const downloadReport = async (format) => {
        try {
            message.loading({ content: `Gerando relatório de produtos em ${format.toUpperCase()}...`, key: 'report' });

            const headers = getAuthHeaders(token);
            delete headers['Content-Type'];

            const response = await fetch(API_ENDPOINTS.REPORT_PRODUCTS(format), {
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

            const fileName = `Relatorio_Produtos_${new Date().toISOString().split('T')[0]}.${format === 'excel' ? 'csv' : 'pdf'}`;
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
                    <h2 style={{ marginLeft: 10, color: 'rgba(255, 255, 255, 0.95)' }}>Estoque</h2>
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
                                Adicionar Produto
                            </Button>
                        </div>
                        <AppTable columns={columns} data={tableData} onDelete={handleDelete} onUpdate={handleUpdate} scroll={{ x: 768 }} />
                    </div>

                    <AppForm
                        open={modalOpen}
                        onCancel={() => {
                            setModalOpen(false);
                            form.resetFields();
                        }}
                        onFinish={handleAdd}
                        title="Adicionar Novo Produto"
                        form={form}
                    >
                        <Form.Item
                            name="name"
                            label={<span style={{ color: 'rgba(255, 255, 255, 0.85)' }}>Nome do Produto</span>}
                            rules={[{ required: true, message: 'Por favor, insira o nome do produto!' }]}
                        >
                            <Input placeholder="Ex: Teclado Mecânico" />
                        </Form.Item>
                        <Form.Item
                            name="quantity"
                            label={<span style={{ color: 'rgba(255, 255, 255, 0.85)' }}>Quantidade</span>}
                            rules={[{ required: true, message: 'Por favor, insira a quantidade!' }]}
                        >
                            <InputNumber min={0} placeholder="Ex: 10" style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item
                            name="price"
                            label={<span style={{ color: 'rgba(255, 255, 255, 0.85)' }}>Preço (R$)</span>}
                            rules={[{ required: true, message: 'Por favor, insira o preço!' }]}
                        >
                            <InputNumber
                                min={0}
                                step={0.01}
                                placeholder="Ex: 250.00"
                                style={{ width: '100%' }}
                                formatter={value => `R$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={value => value.replace(/R\$\s?|(,*)/g, '')}
                            />
                        </Form.Item>
                        <Form.Item
                            name="description"
                            label={<span style={{ color: 'rgba(255, 255, 255, 0.85)' }}>Descrição</span>}
                            rules={[{ required: true, message: 'Por favor, insira a descrição!' }]}
                        >
                            <TextArea rows={3} placeholder="Ex: Teclado mecânico RGB com switches blue..." />
                        </Form.Item>
                    </AppForm>
                </Content>
            </Layout>
        </Layout>
    );
}
