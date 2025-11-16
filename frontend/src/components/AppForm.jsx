import React, { useEffect, useState } from 'react';
import { Modal, Form } from 'antd';

export default function AppForm({
    open,
    onCancel,
    onFinish,
    title,
    children,
    form,
    width = 500
}) {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleOk = () => {
        form.validateFields()
            .then(values => {
                onFinish(values);
            })
            .catch(err => {
                console.error('Erro de validação:', err);
            });
    };

    const modalWidth = isMobile ? '90%' : width;

    return (
        <Modal
            title={title}
            open={open}
            onOk={handleOk}
            onCancel={onCancel}
            okText="Adicionar"
            cancelText="Cancelar"
            width={modalWidth}
            centered={!isMobile}
            destroyOnClose
            styles={{
                body: {
                    background: '#1f1f1f',
                    padding: isMobile ? '16px' : '20px',
                    maxHeight: isMobile ? 'calc(100vh - 200px)' : '70vh',
                    overflowY: 'auto'
                },
                header: {
                    background: '#1f1f1f',
                    borderBottom: '1px solid #2a2a2a',
                    padding: isMobile ? '12px 16px' : '16px 20px'
                },
                footer: {
                    background: '#1f1f1f',
                    borderTop: '1px solid #2a2a2a',
                    padding: isMobile ? '10px 16px' : '12px 20px'
                },
                content: {
                    background: '#1f1f1f',
                    borderRadius: isMobile ? '8px' : '10px',
                    border: '1px solid #2a2a2a'
                }
            }}
        >
            <Form
                form={form}
                layout="vertical"
                autoComplete="off"
                style={{
                    maxWidth: '100%'
                }}
            >
                {children}
            </Form>
        </Modal>
    );
}
