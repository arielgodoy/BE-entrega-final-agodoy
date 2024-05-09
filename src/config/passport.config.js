const passport = require('passport');
const local = require('passport-local');
const { isValidPassword, createHash } = require('../utils/hashPassword');
const UserDaoMongo = require('../dao/usersDaoMongo.js');
const userservice = new UserDaoMongo()
const localStrategy = local.Strategy
const GithubStrategy = require('passport-github2').Strategy;
const {configObject } = require('./config.js');  


exports.initializePassport = () => {
  //estrategia de login con github
  //console.log('clg iniartilza0',configObject.gh_client_id, configObject.gh_client_secret);
  passport.use('github', new GithubStrategy({   
    clientID: configObject.gh_client_id,
    clientSecret: configObject.gh_client_secret ,
    callbackURL: "http://localhost:8080/api/sessions/githubcallback"
  }, async (accessToken, refreshToken, profile, done)=> {
    try {
      //console.log(profile)
      let user = await userservice.getBy({ email: profile._json.email })
      if (user) {
        return done(null, user);
      }
      if (!profile.emails) {
        return done(null, false, { message: 'No se puede registrar un usuario sin email' })
      }
      const newUser = {
        githubId: profile.id,
        first_name: profile._json.name,
        last_name: profile._json.name,
        username: profile.username,
        email: profile.emails[0].value,
        password: ''
       }
      const createdUser = await userservice.createUser(newUser)
      done(null, createdUser)
    } catch (error) {
      //console.log(error)
      return done(error)
    }
    
  }
))

passport.serializeUser((user, done) => {
  done(null, user._id);
})

passport.deserializeUser(async (id, done) => {
  try {
    const user = await userservice.getBy({ _id: id })
    done(null, user);
  } catch (error) {
    done(error);
  }
})

}
