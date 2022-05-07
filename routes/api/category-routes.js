const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', (req, res) => {
  // find all categories
  // be sure to include its associated Products
  Category.findAll({
    include: {
      model: Product,
      attributes: ['id', 'product_name', 'price', 'stock', 'category_id']
    }
  })
    .then((categoryData) => {
      res.status(200).json(categoryData)
    })
    .catch((err) => {
      res.status(500).json(err)
    })
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  try {
    const categoryData = await Category.findOne(req.params.id, {
      include: {
        model: Product,
        attributes: ['id', 'product_name', 'price', 'stock', 'category_id']
      }
    })
    if (!categoryData) {
      throw {
        status: 404,
        message: 'No Category found with this ID'
      }
    }
    res.status(200).json(categoryData)
  }
  catch (err) {
    if (err.status === 404) {
      res.status(404).json(err)
    } else {
      res.status(500).json(err)
    }
  }
});

router.post('/', async (req, res) => {
  // create a new category
  try {
    const newCategory = await Category.create(req.body)
    res.status(201).json(newCategory)
  }
  catch (err) {
    res.status(500).json(err)
  }
});

router.put('/:id', async (req, res) => {
  // update a category by its `id` value
  try {
    const updateCategory = await Category.update(req.body, {
      where: {
        id: req.params.id
      }
    })
    if (updateCategory[0] === 0) {
      throw {
        status: 404,
        message: 'No Category was found with that ID'
      }
    }
    console.log('Updated Category', updateCategory)
    res.status(201).json({
      message: "Category has been updated!",
      data: updateCategory
    })
  }
  catch (err) {
    if (err.status === 404) {
      res.status(404).json(err)
    } else {
      res.status(500).json(err)
    }
  }
});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try {
    const deletedCategory = await Category.destroy({
      where: {
        id: req.params.id
      }
    })
    res.status(200).json(deletedCategory)
  }
  catch (err) {
    res.status(500).json(err)
  }
});

module.exports = router;
