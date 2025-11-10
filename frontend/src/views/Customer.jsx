import Sidebar from "../components/Sidebar.jsx";
import AppTable from "../components/AppTable.jsx";
import AppForm from "../components/AppForm.jsx";
import { Layout, Button, Form, Input, message, Space } from 'antd';
import { MenuOutlined, PlusOutlined, UserOutlined, PhoneOutlined, FileExcelOutlined, FilePdfOutlined } from '@ant-design/icons';
import { useState } from 'react';
const { Header, Content } = Layout;

export default function Customer() {
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [modalOpen, setModalOpen] = useState(false);
	const [tableData, setTableData] = useState([
		{
			key: "1",
			client_id: 123456,
			client_name: "João Silva",
			client_number: "(11) 98765-4321"
		},
		{
			key: "2",
			client_id: 234567,
			client_name: "Maria Santos",
			client_number: "(21) 99876-5432"
		},
		{
			key: "3",
			client_id: 345678,
			client_name: "Pedro Oliveira",
			client_number: "(31) 97654-3210"
		},
	]);
	const [form] = Form.useForm();

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

	const handleDelete = (key) => {
		setTableData(tableData.filter(item => item.key !== key));
		message.success('Cliente removido com sucesso!');
	};

	const handleAdd = (values) => {
		const newClient = {
			key: Date.now().toString(),
			client_id: Math.floor(100000 + Math.random() * 900000),
			client_name: values.client_name,
			client_number: values.client_number
		};
		setTableData([...tableData, newClient]);
		message.success('Cliente adicionado com sucesso!');
		form.resetFields();
		setModalOpen(false);
	};

	const downloadReport = async (format) => {
		try {
			message.loading({ content: `Gerando relatório de clientes em ${format.toUpperCase()}...`, key: 'report' });

			const url = `http://localhost:8000/api/reports/${format}/clients`;

			const response = await fetch(url, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			});

			if (!response.ok) {
				throw new Error('Erro ao gerar relatório');
			}

			const blob = await response.blob();
			const downloadUrl = window.URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = downloadUrl;

			const fileName = `Relatorio_Clientes_${new Date().toISOString().split('T')[0]}.${format === 'excel' ? 'xlsx' : 'pdf'}`;
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
						<AppTable columns={columns} data={tableData} onDelete={handleDelete} scroll={{ x: 768 }} />
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
