// productController.js
const Product = require("../../models/Inventory/Inventory");

exports.createProduct = async (req, res) => {
  try {
    console.log("im in");
    const createdProduct = await Product.create({
      name: req.body.name,
      type: req.body.type,
      category: req.body.category,
      date: req.body.date,
      rquantity: req.body.rquantity,
      
      totalPrice: req.body.totalPrice,
    });

    console.log(createdProduct);
    res.status(201).json({
      message: "Product created successfully",
      product: createdProduct,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error creating product" });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching products" });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete({
      _id: req.params.id,
    });
    console.log(deletedProduct);
    res.status(200).json({
      message: "Product deleted successfully",
      deletedProduct: deletedProduct,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error deleting product" });
  }
};

exports.getProductForUpdate = async (req, res) => {
  try {
    const upProduct = await Product.findById(req.params.id);
    if (!upProduct) {
      return res.status(404).json({ error: "Update Product not found" });
    }
    res.status(200).json(upProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      { _id: req.params.id },
      {
        name: req.body.name,
        type: req.body.type,
        category: req.body.category,
        date: req.body.date,
        rquantity: req.body.rquantity,
       
        totalPrice: req.body.totalPrice,
      },
      { new: true } // To return the updated document
    );

    console.log(updatedProduct);
    res.status(200).json({
      message: "Product updated successfully",
      updatedProduct: updatedProduct,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error updating product" });
  }
};
