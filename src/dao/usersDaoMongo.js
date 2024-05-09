const { usersModel } = require("./models/users.model.js");

class UserDaoMongo { 
  constructor() {
    // Inicializar la base de datos
    this.userModel = usersModel;    
    this.get = this.get.bind(this);
    this.getBy = this.getBy.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  } 
 
  async get() {
    try {
      return await this.userModel.find({}); 
    } catch (error) {
      throw new Error("Error al obtener usuarios", error);
    }
  }

  async getBy(filter) {
    try {
      console.log(filter);
      return await this.userModel.findOne(filter); 
    } catch (error) {
      throw new Error("Error al obtener usuario por filtro", error);
    }
  }

  async create(newUser) {
    try {
      console.log(newUser);
      return await this.userModel.create(newUser); 
    } catch (error) {
      throw new Error("Error al crear usuario", error);
    }
  }

  async update(uid, userUpdate) {
    try {
      return await this.userModel.findOneAndUpdate({_id: uid}, userUpdate); 
    } catch (error) {
      throw new Error("Error al actualizar usuario", error);
    }
  }

  async delete(uid) {
    try {
      return await this.userModel.findOneAndDelete({_id: uid}); 
    } catch (error) {
      throw new Error("Error al eliminar usuario", error);
    }
  }
}
  
module.exports = UserDaoMongo;
