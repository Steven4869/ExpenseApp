const Category = require('../models/categoryModel');
const User = require('../models/userModel');

// Create a new category
exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user && req.user._id; // Get the user ID from the request object

    // Check if the user ID is available
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Create a new category associated with the user
    const newCategory = new Category({
      name,
      user: userId,
    });

    // Save the category to the database
    await newCategory.save();

    // Add the created category to the user's categories array
    const user = await User.findById(userId);
    user.categories.push(newCategory);
    await user.save();

    // Return success response
    res.status(201).json({ message: 'Category created successfully', category: newCategory });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred', error });
  }
};



// Get all categories for a specific user
exports.getUserCategories = async (req, res) => {
  try {
    const userId = req.user; // Get the user ID from the request object (set by the auth middleware)

    // Find the user and populate their categories
    const user = await User.findById(userId).populate('categories');
    
    // If the user has no categories, return an empty array
    if (!user.categories) {
      return res.status(200).json([]);
    }
    
    // Return the user's categories
    res.status(200).json(user.categories);
  } catch (error) {
    res.status(500).json({ message: 'An error occurred' });
  }
};

// Get a specific category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: 'An error occurred' });
  }
};

// Update a category
exports.updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { name } = req.body;

    const category = await Category.findByIdAndUpdate(
      categoryId,
      { name },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: 'An error occurred' });
  }
};

// Delete a category
exports.deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const category = await Category.findByIdAndDelete(categoryId);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred' });
  }
};
