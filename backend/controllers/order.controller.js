const { Order, Client, Product, User, sequelize } = require('../models');

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private (requires 'view' permission for 'orders')
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: Client,
          as: 'client',
          attributes: ['id', 'name', 'email', 'phone']
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private (requires 'view' permission for 'orders')
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        {
          model: Client,
          as: 'client',
          attributes: ['id', 'name', 'email', 'phone', 'address']
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Populate product details for items
    const itemsWithProducts = await Promise.all(
      order.items.map(async (item) => {
        const product = await Product.findByPk(item.productId);
        return {
          ...item,
          product: product ? {
            id: product.id,
            name: product.name,
            sku: product.sku,
            price: product.price
          } : null
        };
      })
    );

    const orderData = order.toJSON();
    orderData.items = itemsWithProducts;

    res.json({
      success: true,
      data: orderData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private (requires 'create' permission for 'orders')
exports.createOrder = async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const { clientId, items, paymentMethods, notes } = req.body;

    // Verify client exists
    const client = await Client.findByPk(clientId);
    if (!client) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }

    // Validate and prepare items
    let totalAmount = 0;
    const preparedItems = [];

    for (const item of items) {
      const product = await Product.findByPk(item.productId, { transaction: t });
      
      if (!product) {
        await t.rollback();
        return res.status(404).json({
          success: false,
          message: `Product with ID ${item.productId} not found`
        });
      }

      if (!product.isActive) {
        await t.rollback();
        return res.status(400).json({
          success: false,
          message: `Product ${product.name} is not available`
        });
      }

      if (product.stock < item.quantity) {
        await t.rollback();
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}`
        });
      }

      const itemTotal = parseFloat(product.price) * item.quantity;
      totalAmount += itemTotal;

      preparedItems.push({
        productId: product.id,
        quantity: item.quantity,
        price: parseFloat(product.price),
        total: itemTotal
      });

      // Reduce stock
      await product.update(
        { stock: product.stock - item.quantity },
        { transaction: t }
      );
    }

    // Create order
    const order = await Order.create({
      clientId,
      items: preparedItems,
      totalAmount,
      paymentMethods,
      status: 'pending',
      notes,
      createdBy: req.user.id
    }, { transaction: t });

    await t.commit();

    // Fetch the complete order with associations
    const orderWithAssociations = await Order.findByPk(order.id, {
      include: [
        {
          model: Client,
          as: 'client',
          attributes: ['id', 'name', 'email', 'phone', 'address']
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    res.status(201).json({
      success: true,
      data: orderWithAssociations
    });
  } catch (error) {
    await t.rollback();
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update order
// @route   PUT /api/orders/:id
// @access  Private (requires 'update' permission for 'orders')
exports.updateOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const { status, paymentMethods, notes } = req.body;

    // Build update object
    const updateData = {};
    if (status !== undefined) updateData.status = status;
    if (paymentMethods !== undefined) updateData.paymentMethods = paymentMethods;
    if (notes !== undefined) updateData.notes = notes;

    await order.update(updateData);

    // Fetch updated order with associations
    const updatedOrder = await Order.findByPk(order.id, {
      include: [
        {
          model: Client,
          as: 'client',
          attributes: ['id', 'name', 'email', 'phone']
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    res.json({
      success: true,
      data: updatedOrder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private (requires 'delete' permission for 'orders')
exports.deleteOrder = async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const order = await Order.findByPk(req.params.id, { transaction: t });

    if (!order) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Restore stock for each item
    for (const item of order.items) {
      const product = await Product.findByPk(item.productId, { transaction: t });
      if (product) {
        await product.update(
          { stock: product.stock + item.quantity },
          { transaction: t }
        );
      }
    }

    await order.destroy({ transaction: t });
    await t.commit();

    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    await t.rollback();
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
