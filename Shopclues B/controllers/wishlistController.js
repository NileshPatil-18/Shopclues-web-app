const Wishlist = require('../models/wishlistModel')

exports.getWishlist = async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id });

  res.json({
    products: wishlist ? wishlist.products : []
  });
};

exports.addToWishlist = async (req, res) => {
  const { _id, name, price, image } = req.body;

  let wishlist = await Wishlist.findOne({ user: req.user._id });

  if (!wishlist) {
    wishlist = new Wishlist({
      user: req.user._id,
      products: []
    });
  }

  const exists = wishlist.products.find(
    (p) => p.productId.toString() === _id
  );

  if (!exists) {
    wishlist.products.push({
      productId: _id,
      name,
      price,
      image
    });
  }

  await wishlist.save();
  res.json({ products: wishlist.products });
};

exports.removeFromWishlist = async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id });

  if (!wishlist) return res.json({ products: [] });

  wishlist.products = wishlist.products.filter(
    (p) => p.productId.toString() !== req.params.productId
  );

  await wishlist.save();
  res.json({ products: wishlist.products });
};
