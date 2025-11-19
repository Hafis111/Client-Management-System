const { Client, User } = require('../models');

// @desc    Get all clients
// @route   GET /api/clients
// @access  Private (requires 'view' permission for 'clients')
exports.getClients = async (req, res) => {
  try {
    const clients = await Client.findAll({
      include: [{
        model: User,
        as: 'creator',
        attributes: ['id', 'name', 'email']
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      count: clients.length,
      data: clients
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single client
// @route   GET /api/clients/:id
// @access  Private (requires 'view' permission for 'clients')
exports.getClient = async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'creator',
        attributes: ['id', 'name', 'email']
      }]
    });

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }

    res.json({
      success: true,
      data: client
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new client
// @route   POST /api/clients
// @access  Private (requires 'create' permission for 'clients')
exports.createClient = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;

    // Check if client exists
    const clientExists = await Client.findOne({ where: { email } });
    if (clientExists) {
      return res.status(400).json({
        success: false,
        message: 'Client already exists with this email'
      });
    }

    const client = await Client.create({
      name,
      email,
      phone,
      address,
      createdBy: req.user.id
    });

    // Fetch the complete client with creator info
    const clientWithCreator = await Client.findByPk(client.id, {
      include: [{
        model: User,
        as: 'creator',
        attributes: ['id', 'name', 'email']
      }]
    });

    res.status(201).json({
      success: true,
      data: clientWithCreator
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update client
// @route   PUT /api/clients/:id
// @access  Private (requires 'update' permission for 'clients')
exports.updateClient = async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id);

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }

    const { name, email, phone, address } = req.body;

    // Check if email is being changed and if it's already taken
    if (email && email !== client.email) {
      const emailExists = await Client.findOne({ where: { email } });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: 'Email already in use'
        });
      }
    }

    await client.update({
      name: name !== undefined ? name : client.name,
      email: email !== undefined ? email : client.email,
      phone: phone !== undefined ? phone : client.phone,
      address: address !== undefined ? address : client.address
    });

    // Fetch updated client with creator info
    const updatedClient = await Client.findByPk(client.id, {
      include: [{
        model: User,
        as: 'creator',
        attributes: ['id', 'name', 'email']
      }]
    });

    res.json({
      success: true,
      data: updatedClient
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete client
// @route   DELETE /api/clients/:id
// @access  Private (requires 'delete' permission for 'clients')
exports.deleteClient = async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id);

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }

    await client.destroy();

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
