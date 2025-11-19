const { Product, User } = require('../models');

// @desc    Get all products
// @route   GET /api/products
// @access  Private (requires 'view' permission for 'products')
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [{
        model: User,
        as: 'creator',
        attributes: ['id', 'name', 'email']
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Private (requires 'view' permission for 'products')
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'creator',
        attributes: ['id', 'name', 'email']
      }]
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private (requires 'create' permission for 'products')
exports.createProduct = async (req, res) => {
  try {
    const { name, description, sku, price, stock, isActive } = req.body;

    // Check if product with SKU exists
    const skuExists = await Product.findOne({ where: { sku } });
    if (skuExists) {
      return res.status(400).json({
        success: false,
        message: 'Product with this SKU already exists'
      });
    }

    const product = await Product.create({
      name,
      description,
      sku,
      price,
      stock: stock || 0,
      isActive: isActive !== undefined ? isActive : true,
      createdBy: req.user.id
    });

    // Fetch the complete product with creator info
    const productWithCreator = await Product.findByPk(product.id, {
      include: [{
        model: User,
        as: 'creator',
        attributes: ['id', 'name', 'email']
      }]
    });

    res.status(201).json({
      success: true,
      data: productWithCreator
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (requires 'update' permission for 'products')
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const { name, description, sku, price, stock, isActive } = req.body;

    // Check if SKU is being changed and if it's already taken
    if (sku && sku !== product.sku) {
      const skuExists = await Product.findOne({ where: { sku } });
      if (skuExists) {
        return res.status(400).json({
          success: false,
          message: 'SKU already in use'
        });
      }
    }

    // Build update object
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (sku !== undefined) updateData.sku = sku;
    if (price !== undefined) updateData.price = price;
    if (stock !== undefined) updateData.stock = stock;
    if (isActive !== undefined) updateData.isActive = isActive;

    await product.update(updateData);

    // Fetch updated product with creator info
    const updatedProduct = await Product.findByPk(product.id, {
      include: [{
        model: User,
        as: 'creator',
        attributes: ['id', 'name', 'email']
      }]
    });

    res.json({
      success: true,
      data: updatedProduct
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (requires 'delete' permission for 'products')
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    await product.destroy();

    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
