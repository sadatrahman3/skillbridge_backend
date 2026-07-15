import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Item } from '../models/Item';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = express.Router();

const categories = [
  'Development',
  'Design',
  'Marketing',
  'Writing',
  'Consulting',
  'Photography',
  'Music',
  'Other',
];

router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      sort,
      page = '1',
      limit = '12',
    } = req.query;

    const query: Record<string, any> = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let sortOption: Record<string, 1 | -1> = { createdAt: -1 };
    if (sort === 'price-asc') sortOption = { price: 1 };
    if (sort === 'price-desc') sortOption = { price: -1 };
    if (sort === 'rating') sortOption = { rating: -1 };
    if (sort === 'newest') sortOption = { createdAt: -1 };

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(50, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [items, total] = await Promise.all([
      Item.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum)
        .populate('createdBy', 'name email')
        .lean(),
      Item.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: items,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch items',
    });
  }
});

router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, message: 'Invalid item ID' });
      return;
    }

    const item = await Item.findById(id).populate('createdBy', 'name email');

    if (!item) {
      res.status(404).json({ success: false, message: 'Item not found' });
      return;
    }

    res.status(200).json({ success: true, data: item });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch item',
    });
  }
});

router.post('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, shortDescription, fullDescription, price, category, location, image } = req.body;

    if (!title || !shortDescription || !fullDescription || !price || !category || !location) {
      res.status(400).json({
        success: false,
        message: 'Title, short description, full description, price, category, and location are required',
      });
      return;
    }

    if (!categories.includes(category)) {
      res.status(400).json({
        success: false,
        message: `Category must be one of: ${categories.join(', ')}`,
      });
      return;
    }

    const item = await Item.create({
      title,
      shortDescription,
      fullDescription,
      price: Number(price),
      category,
      location,
      image: image || '',
      createdBy: req.user?._id,
    });

    const populatedItem = await item.populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Item created successfully',
      data: populatedItem,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create item',
    });
  }
});

router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, message: 'Invalid item ID' });
      return;
    }

    const item = await Item.findById(id);

    if (!item) {
      res.status(404).json({ success: false, message: 'Item not found' });
      return;
    }

    if (item.createdBy.toString() !== req.user?._id.toString() && req.user?.role !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this item',
      });
      return;
    }

    await Item.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Item deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete item',
    });
  }
});

export default router;
