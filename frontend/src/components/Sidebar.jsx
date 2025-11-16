import React, { useState } from 'react';
import { Layout, Menu, Avatar, Typography, Drawer } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import {
    DashboardOutlined,
    ShoppingCartOutlined,
    UserOutlined,
    FileTextOutlined,
    SettingOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;
const { Text } = Typography;

const navItems = [
    { icon: DashboardOutlined, name: 'Dashboard', link: '/' },
    { icon: ShoppingCartOutlined, name: 'Estoque', link: '/stock' },
    { icon: UserOutlined, name: 'Clientes', link: '/customer' },
    { icon: FileTextOutlined, name: 'Pedidos', link: '/orders' },
    { icon: SettingOutlined, name: 'Configurações', link: '/config' },
];

export default function Sidebar({ open, onClose }) {
    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();

    const siderStyle = {
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        insetInlineStart: 0,
        top: 0,
        bottom: 0,
        scrollbarWidth: 'thin',
        scrollbarGutter: 'stable',
        zIndex: 100,
        background: '#1a1a1a',
        borderRight: '1px solid #2a2a2a',
    };

    const user = {
        name: 'Vitor',
        avatar: 'https://i.pravatar.cc/100',
    };

    const today = new Date().toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
    });

    const SidebarContent = () => (
        <>
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '16px',
                    gap: '12px',
                    color: 'white',
                    borderBottom: '1px solid #2a2a2a',
                    marginBottom: '8px',
                    background: '#1a1a1a',
                }}
            >
                <Avatar size={48} src={user.avatar} style={{ border: '2px solid #9146ff' }} />
                <div style={{ lineHeight: 1.2 }}>
                    <Text strong style={{ color: 'rgba(255, 255, 255, 0.95)' }}>
                        {user.name}
                    </Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 12, color: '#8c8c8c' }}>
                        {today.charAt(0).toUpperCase() + today.slice(1)}
                    </Text>
                </div>
            </div>
            <Menu
                mode="inline"
                selectedKeys={[location.pathname]}
                items={navItems.map((item) => ({
                    key: item.link,
                    icon: React.createElement(item.icon),
                    label: <Link to={item.link} onClick={onClose}>{item.name}</Link>,
                }))}
                style={{
                    background: '#1a1a1a',
                    border: 'none',
                }}
            />
        </>
    );

    return (
        <>
            <Sider
                trigger={null}
                style={siderStyle}
                breakpoint='lg'
                collapsedWidth='0'
                onBreakpoint={(broken) => {
                    setCollapsed(broken);
                }}
                onCollapse={setCollapsed}
                className="desktop-sidebar"
            >
                <SidebarContent />
            </Sider>

            <Drawer
                placement="left"
                onClose={onClose}
                open={open}
                className="mobile-drawer"
                styles={{
                    body: { padding: 0, background: '#1a1a1a' }
                }}
                width={200}
            >
                <SidebarContent />
            </Drawer>

            <style>{`
				@media (min-width: 992px) {
					.mobile-drawer { display: none !important; }
				}
				@media (max-width: 991px) {
					.desktop-sidebar { display: none !important; }
				}
			`}</style>
        </>
    );
}
