import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Popconfirm, Space, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchComments,
  createComment,
  updateComment,
  deleteComment,
} from '../store/slices/commentSlice';

const { Option } = Select;

const Comments = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.comments);
  const { user } = useSelector((state) => state.auth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const [form] = Form.useForm();

  const canCreate = user?.role === 'admin' || user?.permissions?.comments?.create;
  const canUpdate = user?.role === 'admin' || user?.permissions?.comments?.update;
  const canDelete = user?.role === 'admin' || user?.permissions?.comments?.delete;

  useEffect(() => {
    dispatch(fetchComments());
  }, [dispatch]);

  const handleAdd = () => {
    setEditingComment(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditingComment(record);
    form.setFieldsValue({ content: record.content });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteComment(id)).unwrap();
      message.success('Comment deleted successfully');
    } catch (error) {
      message.error(error || 'Failed to delete comment');
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (editingComment) {
        await dispatch(updateComment({ id: editingComment._id, commentData: values })).unwrap();
        message.success('Comment updated successfully');
      } else {
        await dispatch(createComment(values)).unwrap();
        message.success('Comment created successfully');
      }
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      message.error(error || 'Operation failed');
    }
  };

  const columns = [
    {
      title: 'Content',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
    },
    {
      title: 'Related To',
      dataIndex: 'relatedTo',
      key: 'relatedTo',
      render: (relatedTo) => (
        <Tag color="blue" className="capitalize">
          {relatedTo}
        </Tag>
      ),
      filters: [
        { text: 'Client', value: 'client' },
        { text: 'Order', value: 'order' },
        { text: 'Product', value: 'product' },
        { text: 'General', value: 'general' },
      ],
      onFilter: (value, record) => record.relatedTo === value,
    },
    {
      title: 'Created By',
      dataIndex: ['createdBy', 'name'],
      key: 'createdBy',
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleString(),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: 'Actions',
      key: 'actions',
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
              title="Are you sure you want to delete this comment?"
              onConfirm={() => handleDelete(record._id)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="primary" danger icon={<DeleteOutlined />} size="small">
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
        <h1 className="text-3xl font-bold">Comments</h1>
        {canCreate && (
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Add Comment
          </Button>
        )}
      </div>

      <Table
        columns={columns}
        dataSource={items}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 'max-content' }}
      />

      <Modal
        title={editingComment ? 'Edit Comment' : 'Add Comment'}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="content"
            label="Comment"
            rules={[{ required: true, message: 'Please enter comment' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          {!editingComment && (
            <Form.Item
              name="relatedTo"
              label="Related To"
              rules={[{ required: true, message: 'Please select related type' }]}
            >
              <Select placeholder="Select type">
                <Option value="general">General</Option>
                <Option value="client">Client</Option>
                <Option value="order">Order</Option>
                <Option value="product">Product</Option>
              </Select>
            </Form.Item>
          )}

          <Form.Item className="mb-0 flex justify-end gap-2">
            <Button onClick={() => setIsModalOpen(false)} className="mr-2">
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              {editingComment ? 'Update' : 'Create'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Comments;
