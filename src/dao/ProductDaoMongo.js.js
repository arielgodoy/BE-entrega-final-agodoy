const { productsModel  } = require('./models/products.model.js');

class ProductDaoMongo {
  constructor() {    
    this.productModel = productsModel;
  }
  async create(title,price,description, category,image, rating,code, stock, status) {        
    console.log(title,price,description, category,image, rating,code, stock, status);
    const existingProduct = await this.productModel.findOne({ code: code });
    if (existingProduct) {
        //return { success: false, message: `El código del producto ya existe, Code=${code}` };
    }
    const product = {
        title,price,description, category,image, rating,code, stock, status
    };

    try {
        const createdProduct = await this.productModel.create(product);
        return { success: true, message: 'Producto agregado con éxito.', productId: createdProduct._id.toString() };
    } catch (error) {
        throw new Error("Error al crear el producto", error);
    }
}


  async delete(id) {    
      const result = await this.productModel.deleteOne({ _id: id });
      if (result.deletedCount > 0) {
        console.log('Producto Eliminado Id:',id)
        return { success: true, message: `Producto con ID ${id} eliminado con éxito.` };
      } else {
        return { success: false, message: `No se encontró un producto con ID ${id}.` };
      }
    
  }

  async update(id, updatedProduct) {

    
      const result = await this.productModel.updateOne({ _id: id }, { $set: updatedProduct });
      if (result.modifiedCount > 0) {
        return { success: true, message: `Producto con ID ${id} actualizado con éxito.` };
      } else {
        return { success: false, message: `No se encontró un producto con ID ${id}` };
      }
    
  }

  async get({ limit = null, page = 1, pageSize = 10, sort = null, category = null, availability = null }) {
    
        let query = this.productModel.find();        
        if (category) {
            query = query.where('category').equals(category);
        }        
        if (availability !== null) {
            query = query.where('availability').equals(availability);
        }        
        if (sort === 'asc' || sort === 'desc') {
            const sortDirection = sort === 'asc' ? 1 : -1;
            query = query.sort({ price: sortDirection });
        }        
        if (limit !== null && limit !== undefined) {
          query = query.limit(limit);
          console.log("aplicando límite", limit);
        }        
        const products = await query.exec();        
        const startIndex = Math.max((page - 1) * pageSize, 0);
        const paginatedProducts = products.slice(startIndex, startIndex + pageSize);        
        return Promise.resolve({ products: paginatedProducts, totalItems: products.length });
}


async getby(filter) {  
  console.log('Filter :',filter);
      const product = await this.productModel.findOne(filter);      
      return { product, error: null };  
}
}
module.exports = ProductDaoMongo;
