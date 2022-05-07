const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {
    const tagData = await Tag.findAll({
      include: {
        model: Product,
        attributes: ['id', 'product_name', 'price', 'stock', 'category_id'],
      }
    })
    res.status(200).json(tagData)
  }
  catch (err) {
    res.status(500).json(err)
  }
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try {
    const tagData = await Tag.findByPk(req.params.id, {
      include: {
        model: Product,
        attributes: ["id", "product_name", "price", "stock", "category_id"],
      },
    });
    if (!tagData) {
      throw {
        status: 404,
        message: "No Tag found with this ID",
      };
    }
    res.status(200).json(tagData);
  } catch (err) {
    if (err.status === 404) {
      res.status(404).json(err);
    } else {
      res.status(500).json(err);
    }
  }
});

router.post('/', async (req, res) => {
  // create a new tag
  try {
    const newTag = await Tag.create(req.body)
    res.status(201).json(newTag)
  }
  catch (err) {
    res.status(500).json(err)
  }
});

router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value
  try {
    const updateTag = await Tag.update(req.body, {
      where: {
        id: req.params.id
      }
    })
    if (updateTag[0] === 0) {
      throw {
        status: 404,
        message: 'No Tag was found with that ID'
      }
    }
    console.log('Updated Tag', updateTag)
    res.status(201).json({
      message: "Tag has been updated!",
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
  // delete on tag by its `id` value
  try {
    const deletedTag = await Tag.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(deletedTag);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
