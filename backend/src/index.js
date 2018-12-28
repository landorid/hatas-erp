const { ApolloServer, gql } = require('apollo-server-express');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const Mutation = require('./resolvers/Mutation');
const Query = require('./resolvers/Query');
const { importSchema } = require('graphql-import');
const path = require('path');
const helmet = require('helmet');
require('dotenv').config();
require('express-async-errors');

const upload = require('./libs/fileToS3');
const auth = require('./libs/auth');
const prisma = require('./dataSources/Prisma');

const app = express();
const typeDefs = importSchema(path.resolve('src/schema.graphql'));

const server = new ApolloServer({
  typeDefs,
  resolvers: {
    Query,
    Mutation,
  },
  context: req => ( {
    ...req,
    prisma,
  } ),
});

app.use(cookieParser(), helmet());
app.use(auth);

app.use(cors({
  credentials: true,
  origin: process.env.FRONTEND_URL,
}));

app.post('/upload', upload.single('data'), function(req, res, next) {
  if (!req.userId) {
    res.status(401).send('Lépj be!');
    next();
  }
  res.status(201).json({ file: req.file.location });
  next();
});

server.applyMiddleware({
  app,
  path: '/',
  cors: {
    credentials: true,
    origin: process.env.FRONTEND_URL,
  },
}); // app is from an existing express app

// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
app.listen({ port: 4000 }, () => {
    console.log(`Server is now runnon on port 
      http://localhost:4000${server.graphqlPath}`);
  },
);