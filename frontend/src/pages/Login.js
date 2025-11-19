import React, { useEffect } from "react";
import { Form, Input, Button, Card, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login, clearError } from "../store/slices/authSlice";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (error) {
      message.error(error);
      dispatch(clearError());
    }
    if (isAuthenticated) {
      navigate("/");
    }
  }, [error, isAuthenticated, navigate, dispatch]);

  const onFinish = (values) => {
    dispatch(login(values));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card className="w-full max-w-md shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Client Management System
          </h1>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>
        <Form name="login" onFinish={onFinish} size="large" autoComplete="off">
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Sign In
            </Button>
          </Form.Item>
        </Form>
        <div className="text-center text-sm text-gray-600 mt-4">
          <p>Demo Admin: admin@example.com / admin123</p>
        </div>
      </Card>
    </div>
  );
};

export default Login;
