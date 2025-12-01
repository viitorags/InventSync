import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Popconfirm, Table } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
}) => {
    const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{ margin: 0 }}
                    rules={[
                        {
                            required: true,
                            message: `Por favor insira ${title}!`,
                        },
                    ]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

export default function AppTable({ columns, data, onDelete, onUpdate, scroll }) {
    const [form] = Form.useForm();
    const [tableData, setTableData] = useState(data);
    const [editingKey, setEditingKey] = useState('');

    useEffect(() => {
        setTableData(data);
    }, [data]);

    const isEditing = record => record.key === editingKey;

    const edit = record => {
        form.setFieldsValue({ ...record });
        setEditingKey(record.key);
    };

    const cancel = () => setEditingKey('');

    const save = async key => {
        try {
            const row = await form.validateFields();
            const newData = [...tableData];
            const index = newData.findIndex(item => key === item.key);
            if (index > -1) {
                const item = newData[index];
                const updatedItem = { ...item, ...row };
                newData.splice(index, 1, updatedItem);
                setTableData(newData);
                setEditingKey('');

                if (onUpdate) {
                    onUpdate(key, row);
                }
            }
        } catch (err) {
            console.log('Erro de validação:', err);
        }
    };

    const handleDelete = key => {
        const newData = tableData.filter(item => item.key !== key);
        setTableData(newData);
        if (onDelete) onDelete(key);
    };

    const actionColumns = [
        {
            title: 'Atualizar',
            dataIndex: 'edit',
            width: 50,
            align: 'center',
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <a
                            onClick={() => save(record.key)}
                            style={{ marginRight: 8 }}
                        >
                            ✔️
                        </a>
                        <Popconfirm title="Cancelar edição?" onConfirm={cancel}>
                            <a>✖️</a>
                        </Popconfirm>
                    </span>
                ) : (
                    <a
                        onClick={() => edit(record)}
                        style={{ color: '#1677ff' }}
                    >
                        <EditOutlined />
                    </a>
                );
            },
        },
        {
            title: 'Deletar',
            dataIndex: 'delete',
            width: 50,
            align: 'center',
            render: (_, record) => (
                <Popconfirm
                    title="Excluir este item?"
                    onConfirm={() => handleDelete(record.key)}
                >
                    <a style={{ color: 'red' }}>
                        <DeleteOutlined />
                    </a>
                </Popconfirm>
            ),
        },
    ];

    const mergedColumns = [
        ...columns.map(col => {
            if (!col.editable) return col;
            return {
                ...col,
                onCell: record => ({
                    record,
                    inputType: col.dataIndex === 'age' ? 'number' : 'text',
                    dataIndex: col.dataIndex,
                    title: col.title,
                    editing: isEditing(record),
                }),
            };
        }),
        ...actionColumns,
    ];

    return (
        <Form form={form} component={false}>
            <Table
                components={{
                    body: { cell: EditableCell },
                }}
                bordered
                dataSource={tableData}
                columns={mergedColumns}
                rowClassName="editable-row"
                pagination={{ onChange: cancel }}
                scroll={scroll || { x: 'max-content' }}
            />
        </Form>
    );
};
