const { Router } = require('express')
const jwt = require('jsonwebtoken')
class ClassRouter {
    constructor(){
        this.router = Router() 
        this.init()
    }

    getRouter(){
        return this.router
    }
    init(){}
    applyCallbacks(callbacks){ // params req, res, next, etc
        return callbacks.map(callback => async (...params)=>{
            try {
                await callback.apply(this, params)
            } catch (error) {
                console.log(error)
                params[1].status(500).send(error)
            }
        })
    }

    generateCustomResponses(req,res,next){
        res.sendSuccess = payload => res.send({status: 'success', payload})
        res.sendServerError = error => res.send({status: 'error', error})
        res.sendUserError = error => res.send({status: 'error', error})
        next()
    }

    handlePolicies = policies =>  (req, res, next) =>{
        if(policies[0]=== 'PUBLIC') return next() 
        const authHeaders = req.headers.authorization
        if (!authHeaders) return res.status(401).send({status: 'error', error: 'Unauthorized'})
        const token  = authHeaders.split(' ')[1] // beare tasdfhashdkfa 
        let user = jwt.verify(token, 'mipalabrasecreta')
        if(!policies.includes(user.role.toUpperCase())) return res.status(401).send({status: 'error', error: 'No permissions'})
        req.user =user 
        next()
    }
    
    get(path, policies,...callbacks){
        this.router.get(path, this.handlePolicies(policies), this.generateCustomResponses, this.applyCallbacks(callbacks))
    }
    post(path, policies,...callbacks){    
        this.router.post(path, this.handlePolicies(policies), this.generateCustomResponses,this.applyCallbacks(callbacks))
    }
    put(path, policies,...callbacks){     
        this.router.put(path, this.handlePolicies(policies), this.generateCustomResponses, this.applyCallbacks(callbacks))
    }
    delete(path, policies,...callbacks){     
        this.router.delete(path, this.handlePolicies(policies), this.generateCustomResponses, this.applyCallbacks(callbacks))
    }

}


module.exports = ClassRouter

