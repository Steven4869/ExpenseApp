const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budgetController');
const { authMiddleware } = require('../middleware/authMiddleware');

// GET user's budget
router.get('/', authMiddleware, budgetController.getBudget);

// POST create user's budget
router.post('/', authMiddleware, budgetController.createBudget);

// PUT update user's budget
router.put('/', authMiddleware, budgetController.updateBudget);

module.exports = router;
