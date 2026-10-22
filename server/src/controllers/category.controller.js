import { Category } from '../models/Category.js';
import { AppError } from '../utils/AppError.js';

export const getActiveCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true })
      .select('_id name slug description baseFeePaise icon')
      .sort({ name: 1 })
      .lean();

    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminCategories = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const skip = (page - 1) * limit;

    const query = {};

    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search.trim(), 'i');
      query.$or = [{ name: searchRegex }, { slug: searchRegex }, { description: searchRegex }];
    }

    if (req.query.isActive !== undefined && req.query.isActive !== '') {
      query.isActive = req.query.isActive === 'true';
    }

    const [categories, total] = await Promise.all([
      Category.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Category.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: categories,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const { name, slug, description, baseFeePaise, icon } = req.body;

    const existingCategory = await Category.findOne({
      $or: [{ slug: slug.toLowerCase() }, { name: { $regex: new RegExp(`^${name}$`, 'i') } }],
    });

    if (existingCategory) {
      if (existingCategory.slug === slug.toLowerCase()) {
        throw new AppError(`Category slug '${slug}' is already in use`, 409);
      }
      throw new AppError(`Category name '${name}' already exists`, 409);
    }

    const category = await Category.create({
      name,
      slug: slug.toLowerCase(),
      description,
      baseFeePaise,
      icon: icon || 'alert-circle',
      isActive: true,
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, baseFeePaise, icon } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      throw new AppError('Category not found', 404);
    }

    if (name && name !== category.name) {
      const duplicate = await Category.findOne({
        _id: { $ne: id },
        name: { $regex: new RegExp(`^${name}$`, 'i') },
      });
      if (duplicate) {
        throw new AppError(`Category name '${name}' is already taken`, 409);
      }
      category.name = name;
    }

    if (description !== undefined) category.description = description;
    if (baseFeePaise !== undefined) category.baseFeePaise = baseFeePaise;
    if (icon !== undefined) category.icon = icon;

    await category.save();

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

export const toggleCategoryStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      throw new AppError('Category not found', 404);
    }

    category.isActive = Boolean(isActive);
    await category.save();

    res.json({
      success: true,
      message: `Category ${category.isActive ? 'activated' : 'disabled'} successfully`,
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getActiveCategories,
  getAdminCategories,
  createCategory,
  updateCategory,
  toggleCategoryStatus,
};
