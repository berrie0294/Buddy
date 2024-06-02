// routes/pizzas.js
const express = require('express');
const router = express.Router();
const db = require('../models');

// Get all pizzas
router.get('/', async (req, res) => {
  try {
    const pizzas = await db.Pizza.findAll();
    res.json(pizzas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new pizza
router.post('/', async (req, res) => {
  try {
    const pizza = await db.Pizza.create(req.body);
    res.status(201).json(pizza);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a pizza by ID
router.get('/:id', async (req, res) => {
  try {
    const pizza = await db.Pizza.findByPk(req.params.id);
    if (!pizza) {
      return res.status(404).json({ error: 'Pizza not found' });
    }
    res.json(pizza);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a pizza by ID
router.put('/:id', async (req, res) => {
  try {
    const pizza = await db.Pizza.findByPk(req.params.id);
    if (!pizza) {
      return res.status(404).json({ error: 'Pizza not found' });
    }
    await pizza.update(req.body);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a pizza by ID
router.delete('/:id', async (req, res) => {
  try {
    const pizza = await db.Pizza.findByPk(req.params.id);
    if (!pizza) {
      return res.status(404).json({ error: 'Pizza not found' });
    }
    await pizza.destroy();
    res.status(200).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
