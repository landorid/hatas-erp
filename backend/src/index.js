const { Prisma } = require('prisma-binding');
const { ApolloServer, gql } = require('apollo-server-express');
const express = require('express');
const cookieParser = require('cookie-parser');
const Mutation = require('./resolvers/Mutation');
const Query = require('./resolvers/Query');
const { importSchema } = require('graphql-import');
const path = require('path');
const helmet = require("helmet");
const jwt = require('jsonwebtoken');
require('dotenv').config();
const auth = require('./middlewares/auth');
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
    prisma
  } ), 
});

app.use(cookieParser(), helmet());
app.use(auth);

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