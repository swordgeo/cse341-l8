require('dotenv').config();
const express = require('express');
const app = express();
const mongodb = require('./db/connect');
const bodyParser = require('body-parser');
//graphQL
const {graphqlHTTP} = require('express-graphql');
const schema = require('./schema');


//Oauth stuff, don't know where to dump it so here it goes
const { auth, requiresAuth } = require('express-openid-connect');

//Update .env file with render link before pushing
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL
};


// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// req.isAuthenticated is provided from the auth router
app.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});
// app.use((req, res, next) => {
//   if (!req.oidc.isAuthenticated()) {
//     return res.status(401).json({error: 'Not authorized'});
//   }
//   next();
// })

app.get('/profile', requiresAuth(), (req, res) => {
  console.log(JSON.stringify(req.oidc.user))
  res.send(JSON.stringify(req.oidc.user));
}) 
//End OAuth



//GraphQL
app.use('/graphql', graphqlHTTP({
  schema,
  pretty: true,
  graphiql: true,
}));
//End GraphQL


const port = process.env.PORT || 3000;

//go to routes
app 
  .use(bodyParser.json())
  .use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Z-Key'
    );
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, PATCH, OPTIONS, DELETE');
    next();
  })
  .use('/', require('./routes'));


//only if mongodb is connected do we listen
mongodb.initDb((err, mongodb) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port);
    console.log(`Connected to DB and listening on ${port}`);
  }
});