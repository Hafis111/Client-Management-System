import React, { useState } from 'react';
import { Layout, Menu, Button, Dropdown, Avatar } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  UserOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
  CommentOutlined,
  UsergroupAddOutlined,
  DashboardOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { logout } from '../../store/slices/authSlice';

const { Header, Sider, Content } = Layout;

const MainLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const hasPermission = (resource, action) => {
    if (user?.role === 'admin') return true;
    return user?.permissions?.[resource]?.[action] || false;
  };

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    hasPermission('products', 'view') && {
      key: '/products',
      icon: <ShoppingOutlined />,
      label: 'Products',
    },
    hasPermission('orders', 'view') && {
      key: '/orders',
      icon: <ShoppingCartOutlined />,
      label: 'Orders',
    },
    hasPermission('clients', 'view') && {
      key: '/clients',
      icon: <TeamOutlined />,
      label: 'Clients',
    },
    hasPermission('comments', 'view') && {
      key: '/comments',
      icon: <CommentOutlined />,
      label: 'Comments',
    },
    hasPermission('users', 'view') && {
      key: '/users',
      icon: <UsergroupAddOutlined />,
      label: 'Users',
    },
  ].filter(Boolean);

  const userMenuItems = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ];

  return (
    <Layout className="min-h-screen">
      <Sider trigger={null} collapsible collapsed={collapsed} className="bg-gray-800">
        <div className="h-16 flex items-center justify-center text-white text-xl font-bold">
          {collapsed ? 'CMS' : 'Client Management'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Header className="bg-white shadow-md px-4 flex justify-between items-center">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="text-lg"
          />
          <div className="flex items-center gap-4">
            <span className="text-gray-700">
              {user?.name} <span className="text-gray-500">({user?.role})</span>
            </span>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Avatar icon={<UserOutlined />} className="cursor-pointer bg-blue-500" />
            </Dropdown>
          </div>
        </Header>
        <Content className="m-6 p-6 bg-white rounded-lg shadow-sm min-h-[calc(100vh-120px)]">
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
