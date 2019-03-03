const { ApolloServer } = require('apollo-server-express');
const express = require('express');
const cookieParser = require('cookie-parser');
const Mutation = require('./src/resolvers/Mutation');
const Query = require('./src/resolvers/Query');
const { importSchema } = require('graphql-import');
const path = require('path');
const helmet = require('helmet');
require('dotenv').config();
require('express-async-errors');

const upload = require('./src/libs/fileToS3');
const auth = require('./src/libs/auth');
const prisma = require('./src/dataSources/Prisma');

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
  tracing: true,
  engine: {
    apiKey: process.env.ENGINE_API_KEY,
  },
});

app.use(cookieParser(), helmet(), auth);

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
app.listen({ port: process.env.PORT || 80 }, () => {
    console.log(`Server is now runnon on port 
      http://localhost:${process.env.PORT}${server.graphqlPath}`);
  },
);