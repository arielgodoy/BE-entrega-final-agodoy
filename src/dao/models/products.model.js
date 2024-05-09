const { model, Schema } = require('mongoose');

const productsCollection = 'Products';

// Define el esquema del producto
const productSchema =  Schema({
  title: String,
  price: Number,
  description: String,
  category: String,
  image: String,
  rating:{
    rate:Number,
    count:Number
  },  
  code: String,
  stock: Number,
  status: String,
})

const productsModel = model(productsCollection, productSchema);

module.exports = {
  productsModel
};
