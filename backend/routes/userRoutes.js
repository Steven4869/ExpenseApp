const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Get user by ID
router.get('/:id', userController.getUserById);

// Update a user
router.put('/:id', userController.updateUser);

// Delete a user
router.delete('/:id', userController.deleteUser);

module.exports = router;
