import Sidebar from "../components/Sidebar.jsx";
import AppTable from "../components/AppTable.jsx";
import AppForm from "../components/AppForm.jsx";
import { Layout, Button, Tag, Form, Input, Select, DatePicker, InputNumber, message, Space } from 'antd';
import { MenuOutlined, PlusOutlined, UserOutlined, PhoneOutlined, DollarOutlined, FileExcelOutlined, FilePdfOutlined } from '@ant-design/icons';
import { useState } from 'react';
import dayjs from 'dayjs';

const { Header, Content } = Layout;
const { TextArea } = Input;

export default function Orders() {
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [modalOpen, setModalOpen] = useState(false);
	const [tableData, setTableData] = useState([
		{
			key: "1",
			order_id: 456789,
			client_name: "João Silva",
			client_number: "(11) 98765-4321",
			product_name: "Teclado Mecânico, Mouse Gamer",
			order_details: "Entrega urgente",
			order_date: "08/11/2025",
			order_price: "R$ 430,00",
			order_status: "pendente"
		},
		{
			key: "2",
			order_id: 567890,
			client_name: "Maria Santos",
			client_number: "(21) 99876-5432",
			product_name: "Monitor 24''",
			order_details: "Retirada na loja",
			order_date: "07/11/2025",
			order_price: "R$ 950,00",
			order_status: "concluído"
		},
		{
			key: "3",
			order_id: 678901,
			client_name: "Pedro Oliveira",
			client_number: "(31) 97654-3210",
			product_name: "Mouse Gamer",
			order_details: "Embalagem para presente",
			order_date: "06/11/2025",
			order_price: "R$ 180,00",
			order_status: "em andamento"
		},
	]);
	const [form] = Form.useForm();

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

	const data = [
		{
			key: "1",
			order_id: 456789,
			client_name: "João Silva",
			client_number: "(11) 98765-4321",
			product_name: "Teclado Mecânico, Mouse Gamer",
			order_details: "Entrega urgente",
			order_date: "08/11/2025",
			order_price: "R$ 430,00",
			order_status: "pendente"
		},
		{
			key: "2",
			order_id: 567890,
			client_name: "Maria Santos",
			client_number: "(21) 99876-5432",
			product_name: "Monitor 24''",
			order_details: "Retirada na loja",
			order_date: "07/11/2025",
			order_price: "R$ 950,00",
			order_status: "concluído"
		},
		{
			key: "3",
			order_id: 678901,
			client_name: "Pedro Oliveira",
			client_number: "(31) 97654-3210",
			product_name: "Mouse Gamer",
			order_details: "Embalagem para presente",
			order_date: "06/11/2025",
			order_price: "R$ 180,00",
			order_status: "em andamento"
		},
	];

	const handleDelete = (key) => {
		setTableData(tableData.filter(item => item.key !== key));
		message.success('Pedido removido com sucesso!');
	};

	const handleAdd = (values) => {
		const newOrder = {
			key: Date.now().toString(),
			order_id: Math.floor(100000 + Math.random() * 900000),
			client_name: values.client_name,
			client_number: values.client_number,
			product_name: values.product_name,
			order_details: values.order_details,
			order_date: values.order_date.format('DD/MM/YYYY'),
			order_price: `R$ ${values.order_price.toFixed(2).replace('.', ',')}`,
			order_status: values.order_status
		};
		setTableData([...tableData, newOrder]);
		message.success('Pedido adicionado com sucesso!');
		form.resetFields();
		setModalOpen(false);
	};

	const downloadReport = async (format) => {
		try {
			message.loading({ content: `Gerando relatório de vendas em ${format.toUpperCase()}...`, key: 'report' });

			const url = `http://localhost:8000/api/reports/${format}/sales`;

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

			const fileName = `Relatorio_Vendas_${new Date().toISOString().split('T')[0]}.${format === 'excel' ? 'xlsx' : 'pdf'}`;
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
						<AppTable columns={columns} data={tableData} onDelete={handleDelete} scroll={{ x: 1200 }} />
					</div>

					<AppForm
						open={modalOpen}
						onCancel={() => {
							setModalOpen(false);
							form.resetFields();
						}}
						onFinish={handleAdd}
						title="Adicionar Novo Pedido"
						form={form}
						width={600}
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

							<Form.Item
								name="product_name"
								label={<span style={{ color: 'rgba(255, 255, 255, 0.85)' }}>Produtos</span>}
								rules={[{ required: true, message: 'Por favor, insira os produtos!' }]}
							>
								<Input placeholder="Ex: Teclado Mecânico, Mouse Gamer" />
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
