import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Popconfirm,
  Space,
  Tag,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchClients,
  createClient,
  updateClient,
  deleteClient,
} from "../store/slices/clientSlice";

const Clients = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.clients);
  const { user } = useSelector((state) => state.auth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [form] = Form.useForm();

  const canCreate =
    user?.role === "admin" || user?.permissions?.clients?.create;
  const canUpdate =
    user?.role === "admin" || user?.permissions?.clients?.update;
  const canDelete =
    user?.role === "admin" || user?.permissions?.clients?.delete;

  useEffect(() => {
    dispatch(fetchClients());
  }, [dispatch]);

  const handleAdd = () => {
    setEditingClient(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditingClient(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteClient(id)).unwrap();
      message.success("Client deleted successfully");
    } catch (error) {
      message.error(error || "Failed to delete client");
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (editingClient) {
        await dispatch(
          updateClient({ id: editingClient.id, clientData: values })
        ).unwrap();
        message.success("Client updated successfully");
      } else {
        await dispatch(createClient(values)).unwrap();
        message.success("Client created successfully");
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
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Company",
      dataIndex: "company",
      key: "company",
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
              title="Are you sure you want to delete this client?"
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
        <h1 className="text-3xl font-bold">Clients</h1>
        {canCreate && (
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Add Client
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
        title={editingClient ? "Edit Client" : "Add Client"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="Client Name"
            rules={[{ required: true, message: "Please enter client name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please enter email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone"
            rules={[{ required: true, message: "Please enter phone number" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="company" label="Company">
            <Input />
          </Form.Item>

          <Form.Item name={["address", "street"]} label="Street Address">
            <Input />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item name={["address", "city"]} label="City">
              <Input />
            </Form.Item>

            <Form.Item name={["address", "state"]} label="State">
              <Input />
            </Form.Item>

            <Form.Item name={["address", "zipCode"]} label="Zip Code">
              <Input />
            </Form.Item>

            <Form.Item name={["address", "country"]} label="Country">
              <Input />
            </Form.Item>
          </div>

          <Form.Item name="notes" label="Notes">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item className="mb-0 flex justify-end gap-2">
            <Button onClick={() => setIsModalOpen(false)} className="mr-2">
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              {editingClient ? "Update" : "Create"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Clients;
