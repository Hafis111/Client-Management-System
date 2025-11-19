import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  message,
  Popconfirm,
  Space,
  Tag,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../store/slices/productSlice";

const Products = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form] = Form.useForm();

  const canCreate =
    user?.role === "admin" || user?.permissions?.products?.create;
  const canUpdate =
    user?.role === "admin" || user?.permissions?.products?.update;
  const canDelete =
    user?.role === "admin" || user?.permissions?.products?.delete;

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleAdd = () => {
    setEditingProduct(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditingProduct(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteProduct(id)).unwrap();
      message.success("Product deleted successfully");
    } catch (error) {
      message.error(error || "Failed to delete product");
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (editingProduct) {
        await dispatch(
          updateProduct({ id: editingProduct.id, productData: values })
        ).unwrap();
        message.success("Product updated successfully");
      } else {
        await dispatch(createProduct(values)).unwrap();
        message.success("Product created successfully");
      }
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      message.error(error || "Operation failed");
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      filters: [...new Set(items.map((item) => item.category))].map((cat) => ({
        text: cat,
        value: cat,
      })),
      onFilter: (value, record) => record.category === value,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `$${parseFloat(price).toFixed(2)}`,
      sorter: (a, b) => parseFloat(a.price) - parseFloat(b.price),
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
      render: (stock) => (
        <Tag color={stock > 10 ? "green" : stock > 0 ? "orange" : "red"}>
          {stock}
        </Tag>
      ),
      sorter: (a, b) => a.stock - b.stock,
    },
    {
      title: "SKU",
      dataIndex: "sku",
      key: "sku",
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive) => (
        <Tag color={isActive ? "green" : "red"}>
          {isActive ? "Active" : "Inactive"}
        </Tag>
      ),
      filters: [
        { text: "Active", value: true },
        { text: "Inactive", value: false },
      ],
      onFilter: (value, record) => record.isActive === value,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          {canUpdate && (
            <Button
              type="primary"
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleEdit(record)}
            >
              Edit
            </Button>
          )}
          {canDelete && (
            <Popconfirm
              title="Are you sure you want to delete this product?"
              onConfirm={() => handleDelete(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="primary"
                danger
                icon={<DeleteOutlined />}
                size="small"
              >
                Delete
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        {canCreate && (
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Add Product
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

      <Modal
        title={editingProduct ? "Edit Product" : "Add Product"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="Product Name"
            rules={[{ required: true, message: "Please enter product name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please enter description" }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: "Please enter category" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: "Please enter price" }]}
          >
            <InputNumber min={0} step={0.01} prefix="$" className="w-full" />
          </Form.Item>

          <Form.Item
            name="stock"
            label="Stock Quantity"
            rules={[{ required: true, message: "Please enter stock quantity" }]}
          >
            <InputNumber min={0} className="w-full" />
          </Form.Item>

          <Form.Item name="sku" label="SKU">
            <Input />
          </Form.Item>

          <Form.Item className="mb-0 flex justify-end gap-2">
            <Button onClick={() => setIsModalOpen(false)} className="mr-2">
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              {editingProduct ? "Update" : "Create"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Products;
