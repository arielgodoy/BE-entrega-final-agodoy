const Router  = require("../advanced.router.js")
const jwt = require('jsonwebtoken')
class UserRouter extends Router {
    init(){        
        this.get('/',["PUBLIC"], (req,res)=>{           
            res.sendSuccess('Bienvenidos a la clase padre UserRouter')
        })

        this.post('/login', ["PUBLIC"], (req, res)=>{
            let user = {
                email: req.body.email,
                role: 'user'
            }
            let token = jwt.sign(user, 'mipalabrasecreta')
            res.sendSuccess({token})
        })

        this.get('/current', ["USER","ADMIN"],(req,res)=>{            
            res.sendSuccess(req.user)
        })
    }
}

module.exports = UserRouter


class ProductRouter extends Router{}
class AuthRouter extends Router{}
class CartRouter extends Router{}
class OredenRouter extends Router{}




// router.get('/', (req, res) => {
//     res.send(req.params.word)
// })


// router.get('*', async (req, res)=>{
//     res.status(404).send('no se encuentra ninguna ruta')
// })

// module.exports = router