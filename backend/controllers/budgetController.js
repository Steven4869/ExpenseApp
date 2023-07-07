const Budget = require('../models/budgetModel');

// Get user's budget
exports.getBudget = async (req, res, next) => {
  try {
    const userId = req.userId; // User ID from the authentication middleware
    const budget = await Budget.findOne({ user: userId });
    
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    res.json(budget);
  } catch (error) {
    next(error);
  }
};

// Create user's budget
exports.createBudget = async (req, res, next) => {
  try {
    const userId = req.userId; // User ID from the authentication middleware
    const { amount } = req.body;

    const budget = new Budget({
      user: userId,
      amount,
    });

    const savedBudget = await budget.save();

    res.status(201).json(savedBudget);
  } catch (error) {
    next(error);
  }
};

// Update user's budget
exports.updateBudget = async (req, res, next) => {
  try {
    const userId = req.userId; // User ID from the authentication middleware
    const { amount } = req.body;

    const budget = await Budget.findOneAndUpdate(
      { user: userId },
      { amount },
      { new: true }
    );

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    res.json(budget);
  } catch (error) {
    next(error);
  }
};
