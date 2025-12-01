import Sidebar from "../components/Sidebar.jsx";
import AppTable from "../components/AppTable.jsx";
import AppForm from "../components/AppForm.jsx";
import { Layout, Button, Form, Input, message, Space } from 'antd';
import { MenuOutlined, PlusOutlined, UserOutlined, PhoneOutlined, FileExcelOutlined, FilePdfOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { API_ENDPOINTS, apiGet, apiPost, apiDelete, getAuthHeaders } from '../config/api.js';

const { Header, Content } = Layout;

export default function Customer() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            const response = await apiGet(API_ENDPOINTS.CUSTOMERS, token);

            if (response.ok) {
                const data = await response.json();

                const customers = data.data || data;

                if (!Array.isArray(customers)) {
                    message.error('Formato de dados inválido');
                    return;
                }

                const formattedData = customers.map(customer => ({
                    key: customer.customer_id,
                    client_id: customer.customer_id,
                    client_name: customer.customer_name,
                    client_number: customer.customer_number
                }));

                setTableData(formattedData);
            } else {
                message.error('Erro ao carregar clientes');
            }
        } catch (error) {
            console.error('Erro ao buscar clientes:', error);
            message.error('Erro ao carregar clientes');
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: "Nome do Cliente",
            dataIndex: "client_name",
            width: "40%",
            editable: true,
        },
        {
            title: "Telefone",
            dataIndex: "client_number",
            width: "30%",
            editable: true,
        },
    ];

    const handleDelete = async (key) => {
        try {
            const response = await apiDelete(API_ENDPOINTS.CUSTOMER_BY_ID(key), token);

            if (response.ok) {
                message.success('Cliente removido com sucesso!');
                await fetchCustomers();
            } else {
                const errorData = await response.json();
                message.error(errorData.message || 'Erro ao remover cliente');
            }
        } catch (error) {
            console.error('Erro ao deletar cliente:', error);
            message.error('Erro ao remover cliente');
        }
    };

    const handleUpdate = async (key, values) => {
        try {
            const response = await fetch(API_ENDPOINTS.CUSTOMER_BY_ID(key), {
                method: 'PUT',
                headers: getAuthHeaders(token),
                body: JSON.stringify({
                    customer_name: values.client_name,
                    customer_number: values.client_number,
                }),
            });

            if (response.ok) {
                message.success('Cliente atualizado com sucesso!');
                await fetchCustomers();
            } else {
                const errorData = await response.json();
                message.error(errorData.message || 'Erro ao atualizar cliente');
            }
        } catch (error) {
            console.error('Erro ao atualizar cliente:', error);
            message.error('Erro ao atualizar cliente');
        }
    };

    const handleAdd = async (values) => {
        setLoading(true);
        try {
            const response = await apiPost(
                API_ENDPOINTS.CUSTOMERS,
                {
                    customer_name: values.client_name,
                    customer_number: values.client_number,
                },
                token
            );

            if (response.ok) {
                message.success('Cliente adicionado com sucesso!');
                form.resetFields();
                setModalOpen(false);
                await fetchCustomers();
            } else {
                const errorData = await response.json();
                console.error('Erro do servidor:', errorData);
                message.error(errorData.message || 'Erro ao adicionar cliente');
            }
        } catch (error) {
            console.error('Erro ao adicionar cliente:', error);
            message.error('Erro ao adicionar cliente');
        } finally {
            setLoading(false);
        }
    };

    const downloadReport = async (format) => {
        try {
            message.loading({ content: `Gerando relatório de clientes em ${format.toUpperCase()}...`, key: 'report' });

            const headers = getAuthHeaders(token);
            delete headers['Content-Type'];

            const response = await fetch(API_ENDPOINTS.REPORT_CUSTOMERS(format), {
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

            const fileName = `Relatorio_Clientes_${new Date().toISOString().split('T')[0]}.${format === 'excel' ? 'csv' : 'pdf'}`;
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
                    <h2 style={{ marginLeft: 10, color: 'rgba(255, 255, 255, 0.95)' }}>Clientes</h2>
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
                                Adicionar Cliente
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
                        title="Adicionar Novo Cliente"
                        form={form}
                    >
                        <Form.Item
                            name="client_name"
                            label={<span style={{ color: 'rgba(255, 255, 255, 0.85)' }}>Nome do Cliente</span>}
                            rules={[{ required: true, message: 'Por favor, insira o nome do cliente!' }]}
                        >
                            <Input
                                prefix={<UserOutlined />}
                                placeholder="Ex: João Silva"
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
                            />
                        </Form.Item>
                    </AppForm>
                </Content>
            </Layout>
        </Layout >
    );
}
