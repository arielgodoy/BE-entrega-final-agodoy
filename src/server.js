const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const { Server } = require('socket.io');
const cookieParser= require('cookie-parser');
const passport = require('passport');
const { initializePassport } = require('./config/passport.config.js');
const { connectDB, configObject } = require('./config/config.js');  

const appRouter = require('./routes/index.js');
const fetch = require('node-fetch');
const session = require('express-session');

const ProductDaoMongo = require('./dao/ProductDaoMongo.js.js');
const productDaoMongo = new ProductDaoMongo();


const { addLogger,logger } = require('./utils/logger.js');


connectDB()
const app = express();
const port = configObject.PORT;

//midleware para consologuear las petriciones--- reemplazada por winston-logger
app.use((req, res, next) => {
  //console.log(`Server: Solicitud recibida: ${req.method} ${req.url}`);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public')));

initializePassport()
app.use(session({
  secret: configObject.jwt_secret_key,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())



// Configuración de Handlebars
const handlebars = exphbs.create({
  helpers: {
    jsonStringify: function(context) {
      return JSON.stringify(context);
    }    
  },    
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('views', path.resolve(__dirname, 'views'));
app.use(addLogger)
//todas las rutas en un solo archivo
app.use(appRouter);





const httpServer = app.listen(port, (err) => {
  if (err) throw err;
  logger.info(`Server running on ${port}`);
});

// Winsocket
const io = new Server(httpServer);
io.on('connection', socket => {
  logger.info('Nueva conexión entrante por WS');
  socket.on('addproduct', formData => {
    const status = productDaoMongo.addProduct(
      formData.title,
      formData.description,
      formData.price,
      formData.thumbnail,
      formData.code,
      formData.stock,
      formData.status,
      formData.category
    );
    socket.emit('resultado.addproduct', status);
    socket.broadcast.emit('productosactualizados', status);
  });
  socket.on('getproducts', async () => {
    console.log('entro a getproducts de WS');
    try {
      const response = await fetch('http://localhost:8080/api/products/');
      if (!response.ok) {
        console.error('Error al obtener productos desde la API:', response.statusText);
        return;
      }
      try {
        const products = await response.json() || [];
        socket.emit('resultado.getproducts', products);
      } catch (error) {
        console.error('Error al convertir la respuesta a JSON:', error);
      }
    } catch (error) {
      console.error('Error al obtener productos:', error);
      socket.emit('resultado.getproducts', { error: 'Error al obtener productos' });
    }
  });

  socket.on('eliminaProducto', id => {
    logger.info('Eliminando Producto ID = ' + id);
    let resultado = productDaoMongo.deleteProduct(id);
    socket.broadcast.emit('productosactualizados', resultado);
  });
});

