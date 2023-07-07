const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const { authMiddleware }= require('../middleware/authMiddleware')
// Create a new expense
router.post('/', authMiddleware, expenseController.createExpense);

// Get all expenses
router.get('/', authMiddleware, expenseController.getAllExpenses);

// Get an expense by ID
router.get('/:id', authMiddleware, expenseController.getExpenseById);

// Update an expense
router.put('/:id', authMiddleware, expenseController.updateExpense);

// Delete an expense
router.delete('/:id', authMiddleware, expenseController.deleteExpense);

module.exports = router;
