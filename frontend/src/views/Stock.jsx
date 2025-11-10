import React, { useState } from "react";
import { Layout, Button, Form, Input, InputNumber, message, Space, Card } from "antd";
import { MenuOutlined, PlusOutlined, FileExcelOutlined, FilePdfOutlined } from '@ant-design/icons';
import Sidebar from "../components/Sidebar.jsx";
import AppTable from "../components/AppTable.jsx";
import AppForm from "../components/AppForm.jsx";

const { Header, Content } = Layout;

export default function Stock() {
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [modalOpen, setModalOpen] = useState(false);
	const [tableData, setTableData] = useState([
		{ key: "1", name: "Teclado Mecânico", quantity: 12, price: "R$ 250,00" },
		{ key: "2", name: "Mouse Gamer", quantity: 8, price: "R$ 180,00" },
		{ key: "3", name: "Monitor 24''", quantity: 5, price: "R$ 950,00" },
	]);
	const [form] = Form.useForm();

	const columns = [
		{
			title: "Produto",
			dataIndex: "name",
			editable: true,
			width: "30%",
		},
		{
			title: "Quantidade",
			dataIndex: "quantity",
			editable: true,
			width: "20%",
		},
		{
			title: "Preço",
			dataIndex: "price",
			editable: true,
			width: "20%",
		},
	];

	const handleDelete = (key) => {
		setTableData(tableData.filter(item => item.key !== key));
		message.success('Produto removido com sucesso!');
	};

	const handleAdd = (values) => {
		const newProduct = {
			key: Date.now().toString(),
			name: values.name,
			quantity: values.quantity,
			price: `R$ ${values.price.toFixed(2).replace('.', ',')}`
		};
		setTableData([...tableData, newProduct]);
		message.success('Produto adicionado com sucesso!');
		form.resetFields();
		setModalOpen(false);
	};

	const downloadReport = async (format) => {
		try {
			message.loading({ content: `Gerando relatório de produtos em ${format.toUpperCase()}...`, key: 'report' });

			const url = `http://localhost:8000/api/reports/${format}/products`;

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

			const fileName = `Relatorio_Produtos_${new Date().toISOString().split('T')[0]}.${format === 'excel' ? 'xlsx' : 'pdf'}`;
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
						<AppTable columns={columns} data={tableData} onDelete={handleDelete} scroll={{ x: 768 }} />
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
					</AppForm>
				</Content>
			</Layout>
		</Layout>
	);
}
