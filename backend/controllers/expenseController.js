const Expense = require('../models/expenseModel');
const User = require('../models/userModel');

// Create a new expense
exports.createExpense = async (req, res) => {
  try {
    const { category, amount, description, date } = req.body;
    const userId = req.user; // Get the user ID from the request object (set by the auth middleware)

    // Create a new expense associated with the user
    const newExpense = new Expense({
      category,
      amount,
      description,
      date,
      user: userId,
    });

    // Save the expense to the database
    await newExpense.save();

    // Add the created expense to the user's expenses array
    const user = await User.findById(userId);
    user.expenses.push(newExpense);
    await user.save();

    // Return success response
    res.status(201).json({ message: 'Expense created successfully', expense: newExpense });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred', error });
  }
};


// Get all expenses
exports.getAllExpenses = async (req, res) => {
  try {
    const userId = req.user; // Get the user ID from the request object (set by the auth middleware)

    // Find the expenses associated with the user and populate both 'category' and 'user' fields
    const expenses = await Expense.find({ user: userId }).populate('category').populate('user');
    
    // Return the expenses
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'An error occurred' });
  }
};

// Get a specific expense by ID
exports.getExpenseById = async (req, res) => {
  try {
    const expenseId = req.params.id;
    const expense = await Expense.findById(expenseId).populate('user').populate('category');

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.status(200).json(expense);
  } catch (error) {
    res.status(500).json({ message: 'An error occurred' });
  }
};

// Update an expense
exports.updateExpense = async (req, res) => {
  try {
    const expenseId = req.params.id;
    const { user, amount, category, date, notes } = req.body;

    const expense = await Expense.findByIdAndUpdate(
      expenseId,
      { user, amount, category, date, notes },
      { new: true }
    );

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.status(200).json(expense);
  } catch (error) {
    res.status(500).json({ message: 'An error occurred' });
  }
};

// Delete an expense
exports.deleteExpense = async (req, res) => {
  try {
    const expenseId = req.params.id;
    const expense = await Expense.findByIdAndDelete(expenseId);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred' });
  }
};
