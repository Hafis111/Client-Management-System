import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Select,
  Input,
  InputNumber,
  message,
  Space,
  Tag,
  Card,
  Divider,
} from "antd";
import { PlusOutlined, EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOrders,
  createOrder,
  deleteOrder,
} from "../store/slices/orderSlice";
import { fetchClients } from "../store/slices/clientSlice";
import { fetchProducts } from "../store/slices/productSlice";

const { Option } = Select;

const Orders = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.orders);
  const { items: clients } = useSelector((state) => state.clients);
  const { items: products } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingOrder, setViewingOrder] = useState(null);
  const [form] = Form.useForm();
  const [orderItems, setOrderItems] = useState([
    { product: null, quantity: 1 },
  ]);
  const [paymentMethods, setPaymentMethods] = useState([
    { method: "cash", amount: 0 },
  ]);

  const canCreate = user?.role === "admin" || user?.permissions?.orders?.create;
  const canDelete = user?.role === "admin" || user?.permissions?.orders?.delete;

  useEffect(() => {
    dispatch(fetchOrders());
    dispatch(fetchClients());
    dispatch(fetchProducts());
  }, [dispatch]);

  const calculateTotal = () => {
    return orderItems.reduce((total, item) => {
      const product = products.find((p) => p.id === item.product);
      return total + (product ? parseFloat(product.price) * item.quantity : 0);
    }, 0);
  };

  const handleAddItem = () => {
    setOrderItems([...orderItems, { product: null, quantity: 1 }]);
  };

  const handleRemoveItem = (index) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...orderItems];
    newItems[index][field] = value;
    setOrderItems(newItems);
  };

  const handleAddPayment = () => {
    setPaymentMethods([...paymentMethods, { method: "cash", amount: 0 }]);
  };

  const handleRemovePayment = (index) => {
    setPaymentMethods(paymentMethods.filter((_, i) => i !== index));
  };

  const handlePaymentChange = (index, field, value) => {
    const newPayments = [...paymentMethods];
    newPayments[index][field] = value;
    setPaymentMethods(newPayments);
  };

  const handleSubmit = async (values) => {
    const total = calculateTotal();
    const paymentTotal = paymentMethods.reduce((sum, pm) => sum + pm.amount, 0);

    if (Math.abs(paymentTotal - total) > 0.01) {
      message.error("Payment total must equal order total");
      return;
    }

    const orderData = {
      clientId: values.client,
      items: orderItems.map((item) => ({
        productId: item.product,
        quantity: item.quantity,
      })),
      paymentMethods,
      notes: values.notes,
    };

    try {
      await dispatch(createOrder(orderData)).unwrap();
      message.success("Order created successfully");
      setIsModalOpen(false);
      form.resetFields();
      setOrderItems([{ product: null, quantity: 1 }]);
      setPaymentMethods([{ method: "cash", amount: 0 }]);
    } catch (error) {
      message.error(error || "Failed to create order");
    }
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteOrder(id)).unwrap();
      message.success("Order deleted successfully");
    } catch (error) {
      message.error(error || "Failed to delete order");
    }
  };

  const columns = [
    {
      title: "Order Number",
      dataIndex: "orderNumber",
      key: "orderNumber",
    },
    {
      title: "Client",
      dataIndex: ["client", "name"],
      key: "client",
    },
    {
      title: "Items",
      dataIndex: "items",
      key: "items",
      render: (items) => items.length,
    },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount) => `$${parseFloat(amount).toFixed(2)}`,
      sorter: (a, b) => parseFloat(a.totalAmount) - parseFloat(b.totalAmount),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const colors = {
          pending: "orange",
          processing: "blue",
          completed: "green",
          cancelled: "red",
        };
        return <Tag color={colors[status]}>{status.toUpperCase()}</Tag>;
      },
      filters: [
        { text: "Pending", value: "pending" },
        { text: "Processing", value: "processing" },
        { text: "Completed", value: "completed" },
        { text: "Cancelled", value: "cancelled" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString(),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="default"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => setViewingOrder(record)}
          >
            View
          </Button>
          {canDelete && (
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              size="small"
              onClick={() => handleDelete(record.id)}
            >
              Delete
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Orders</h1>
        {canCreate && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalOpen(true)}
          >
            Create Order
          </Button>
        )}
      </div>

      <Table
        columns={columns}
        dataSource={items}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: "max-content" }}
      />

      {/* Create Order Modal */}
      <Modal
        title="Create Order"
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
          setOrderItems([{ product: null, quantity: 1 }]);
          setPaymentMethods([{ method: "cash", amount: 0 }]);
        }}
        footer={null}
        width={800}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="client"
            label="Select Client"
            rules={[{ required: true, message: "Please select a client" }]}
          >
            <Select
              placeholder="Select client"
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {clients.map((client) => (
                <Option key={client.id} value={client.id}>
                  {client.name} - {client.email}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Divider>Order Items</Divider>
          {orderItems.map((item, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <Select
                placeholder="Select product"
                value={item.product}
                onChange={(value) => handleItemChange(index, "product", value)}
                className="flex-1"
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
              >
                {products.map((product) => (
                  <Option key={product.id} value={product.id}>
                    {product.name} - ${parseFloat(product.price).toFixed(2)}{" "}
                    (Stock: {product.stock})
                  </Option>
                ))}
              </Select>
              <InputNumber
                min={1}
                value={item.quantity}
                onChange={(value) => handleItemChange(index, "quantity", value)}
                placeholder="Qty"
                className="w-24"
              />
              {orderItems.length > 1 && (
                <Button danger onClick={() => handleRemoveItem(index)}>
                  Remove
                </Button>
              )}
            </div>
          ))}
          <Button type="dashed" onClick={handleAddItem} block className="mb-4">
            + Add Item
          </Button>

          <Divider>Payment Methods</Divider>
          {paymentMethods.map((payment, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <Select
                value={payment.method}
                onChange={(value) =>
                  handlePaymentChange(index, "method", value)
                }
                className="w-32"
              >
                <Option value="cash">Cash</Option>
                <Option value="card">Card</Option>
              </Select>
              <InputNumber
                min={0}
                step={0.01}
                value={payment.amount}
                onChange={(value) =>
                  handlePaymentChange(index, "amount", value)
                }
                placeholder="Amount"
                prefix="$"
                className="flex-1"
              />
              {paymentMethods.length > 1 && (
                <Button danger onClick={() => handleRemovePayment(index)}>
                  Remove
                </Button>
              )}
            </div>
          ))}
          <Button
            type="dashed"
            onClick={handleAddPayment}
            block
            className="mb-4"
          >
            + Add Payment Method
          </Button>

          <Card className="mb-4 bg-gray-50">
            <div className="flex justify-between">
              <span className="font-semibold">Order Total:</span>
              <span className="text-lg font-bold">
                ${calculateTotal().toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between mt-2">
              <span>Payment Total:</span>
              <span>
                $
                {paymentMethods
                  .reduce((sum, pm) => sum + pm.amount, 0)
                  .toFixed(2)}
              </span>
            </div>
          </Card>

          <Form.Item name="notes" label="Notes">
            <Input.TextArea rows={2} />
          </Form.Item>

          <Form.Item className="mb-0 flex justify-end gap-2">
            <Button
              onClick={() => {
                setIsModalOpen(false);
                form.resetFields();
              }}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Create Order
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* View Order Modal */}
      <Modal
        title="Order Details"
        open={!!viewingOrder}
        onCancel={() => setViewingOrder(null)}
        footer={[
          <Button key="close" onClick={() => setViewingOrder(null)}>
            Close
          </Button>,
        ]}
        width={700}
      >
        {viewingOrder && (
          <div>
            <Card className="mb-4">
              <p>
                <strong>Order Number:</strong> {viewingOrder.orderNumber}
              </p>
              <p>
                <strong>Client:</strong> {viewingOrder.client?.name} (
                {viewingOrder.client?.email})
              </p>
              <p>
                <strong>Status:</strong> <Tag>{viewingOrder.status}</Tag>
              </p>
            </Card>

            <Card title="Items" className="mb-4">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Product</th>
                    <th className="text-right py-2">Quantity</th>
                    <th className="text-right py-2">Price</th>
                    <th className="text-right py-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {viewingOrder.items?.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2">{item.product?.name}</td>
                      <td className="text-right">{item.quantity}</td>
                      <td className="text-right">${item.price?.toFixed(2)}</td>
                      <td className="text-right">
                        ${(item.price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>

            <Card title="Payment Methods" className="mb-4">
              {viewingOrder.paymentMethods?.map((pm, index) => (
                <div key={index} className="flex justify-between py-1">
                  <span className="capitalize">{pm.method}:</span>
                  <span>${parseFloat(pm.amount).toFixed(2)}</span>
                </div>
              ))}
              <Divider className="my-2" />
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>
                  ${parseFloat(viewingOrder.totalAmount || 0).toFixed(2)}
                </span>
              </div>
            </Card>

            {viewingOrder.notes && (
              <Card title="Notes">
                <p>{viewingOrder.notes}</p>
              </Card>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Orders;
