import React, { useEffect } from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import {
  ShoppingOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
  CommentOutlined,
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../store/slices/productSlice';
import { fetchOrders } from '../store/slices/orderSlice';
import { fetchClients } from '../store/slices/clientSlice';
import { fetchComments } from '../store/slices/commentSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { items: products } = useSelector((state) => state.products);
  const { items: orders } = useSelector((state) => state.orders);
  const { items: clients } = useSelector((state) => state.clients);
  const { items: comments } = useSelector((state) => state.comments);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user?.role === 'admin' || user?.permissions?.products?.view) {
      dispatch(fetchProducts());
    }
    if (user?.role === 'admin' || user?.permissions?.orders?.view) {
      dispatch(fetchOrders());
    }
    if (user?.role === 'admin' || user?.permissions?.clients?.view) {
      dispatch(fetchClients());
    }
    if (user?.role === 'admin' || user?.permissions?.comments?.view) {
      dispatch(fetchComments());
    }
  }, [dispatch, user]);

  const stats = [
    {
      title: 'Total Products',
      value: products.length,
      icon: <ShoppingOutlined />,
      color: '#3f8600',
      show: user?.role === 'admin' || user?.permissions?.products?.view,
    },
    {
      title: 'Total Orders',
      value: orders.length,
      icon: <ShoppingCartOutlined />,
      color: '#1890ff',
      show: user?.role === 'admin' || user?.permissions?.orders?.view,
    },
    {
      title: 'Total Clients',
      value: clients.length,
      icon: <TeamOutlined />,
      color: '#722ed1',
      show: user?.role === 'admin' || user?.permissions?.clients?.view,
    },
    {
      title: 'Total Comments',
      value: comments.length,
      icon: <CommentOutlined />,
      color: '#fa8c16',
      show: user?.role === 'admin' || user?.permissions?.comments?.view,
    },
  ].filter((stat) => stat.show);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <Row gutter={[16, 16]}>
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card bordered={false} className="shadow-md">
              <Statistic
                title={stat.title}
                value={stat.value}
                prefix={
                  <span style={{ color: stat.color, fontSize: '24px' }}>{stat.icon}</span>
                }
                valueStyle={{ color: stat.color }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Card className="mt-6 shadow-md">
        <h2 className="text-xl font-semibold mb-4">Welcome, {user?.name}!</h2>
        <p className="text-gray-600">
          You are logged in as <strong>{user?.role}</strong>. Use the menu to navigate through
          different sections of the application.
        </p>
        {user?.role !== 'admin' && (
          <div className="mt-4 p-4 bg-blue-50 rounded">
            <h3 className="font-semibold mb-2">Your Permissions:</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {Object.entries(user?.permissions || {}).map(([resource, perms]) => (
                <div key={resource}>
                  <strong className="capitalize">{resource}:</strong>{' '}
                  {Object.entries(perms)
                    .filter(([_, value]) => value)
                    .map(([key]) => key)
                    .join(', ') || 'None'}
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Dashboard;
