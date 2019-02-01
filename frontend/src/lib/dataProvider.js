import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';
import { endpoint } from '../config';

const defaultOptions = {
  watchQuery: {
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  },
  query: {
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  },
  mutate: {
    errorPolicy: 'all',
  },
};

const client = new ApolloClient({
  link: ApolloLink.from([
    onError(({ graphQLErrors, networkError, operation, forward }) => {
      if (graphQLErrors) {
        for (let err of graphQLErrors) {
          switch (err.extensions.code) {
            case 'UNAUTHENTICATED':
              window.location = '/login';
              break;
            default:
              return;
          }
        }
      }
    }),
    new HttpLink({
      uri: process.env.NODE_ENV === 'development' ? endpoint : endpoint,
      credentials: 'include',
    }),
  ]),
  cache: new InMemoryCache({
    cacheRedirects: {
      Query: {
        user: (_, args, { getCacheKey }) => {
          return getCacheKey({ __typename: 'User', id: args.where.id });
        },
        customer: (_, args, { getCacheKey }) => {
          return getCacheKey({ __typename: 'Customer', id: args.where.id });
        },
        stockItem: (_, args, { getCacheKey }) => {
          return getCacheKey({ __typename: 'StockItem', id: args.where.id });
        },
        supplier: (_, args, { getCacheKey }) => {
          console.log(getCacheKey({ __typename: 'Supplier', id: args.where.id }));
          return getCacheKey({ __typename: 'Supplier', id: args.where.id });
        },
      },
    },
  }),
  defaultOptions,
});

export default client;
