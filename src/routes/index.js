const {Router} = require('express');
const productRouter = require('../routes/products.router.js');
const cartRouter = require('../routes/carts.router.js');
const hbsrouter = require('../routes/handlebars.router.js');
const sessionsRouter = require('../routes/apis/sessions.router.js');
const usersRouter = require('../routes/users.router.js');
const mailrouter = require('../routes/mail.router.js');
const testrouter =require("./test.router.js")
const advUserRouter  = require("./apis/adv.user.router.js");
const router = Router();

const advanceduserrouter = new advUserRouter()

router.use('/api/products', productRouter);
router.use('/api/carts', cartRouter);
router.use('/api/sessions', sessionsRouter);
router.use('/mail', mailrouter);
router.use('/api/users', usersRouter);
router.use('/', hbsrouter);
router.use("/adv/users",  advanceduserrouter.getRouter())
router.use('/api/test',testrouter)



//
router.use('*', (req, res) => {
   res.status(404).send('404 | Page Not Found');
})
// Middleware de manejo de errores
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Error de server');
  });

  
module.exports = router;