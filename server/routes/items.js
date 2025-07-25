
import express from 'express';
import Item from '../models/Item.js';

const router = express.Router();

router.post('/create-one', async (req, res) => {
  try {
    const item = await Item.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    console.error('❌ Item creation failed:', err.message);
    res.status(400).json({ error: err.message });
  }
});


router.post('/create-many', async (req, res) => {
  const items = await Item.insertMany(req.body);
  res.json(items);
});

router.patch('/update-one/:id', async (req, res) => {
  const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(item);
});

router.patch('/update-many', async (req, res) => {
  const { filter, update } = req.body;
  const result = await Item.updateMany(filter, update);
  res.json(result);
});

router.put('/replace-one/:id', async (req, res) => {
  const item = await Item.findOneAndReplace({ _id: req.params.id }, req.body, { new: true });
  res.json(item);
});

router.delete('/delete-one/:id', async (req, res) => {
  const result = await Item.findByIdAndDelete(req.params.id);
  res.json(result);
});

router.delete('/delete-many', async (req, res) => {
  const result = await Item.deleteMany(req.body);
  res.json(result);
});

router.get('/', async (req, res) => {
  const { sortBy = 'createdAt', order = 'desc', page = 1, limit = 10, fields } = req.query;
  const projection = fields ? fields.split(',').reduce((acc, field) => ({ ...acc, [field]: 1 }), {}) : {};
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const items = await Item.find({}, projection)
    .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
    .skip(skip)
    .limit(parseInt(limit));
  res.json(items);
});

export default router;
