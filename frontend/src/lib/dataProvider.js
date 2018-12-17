import ApolloClient from 'apollo-boost';
import { endpoint } from '../config';

const client = new ApolloClient({
  uri: process.env.NODE_ENV === 'development' ? endpoint : endpoint,
  request: operation => {
    operation.setContext({
      fetchOptions: {
        credentials: 'include',
      },
    });
  },
});

client.defaultOptions = {
  query: {
    fetchPolicy: 'cache-and-network',
    partialRefetch: true,
  },
};
export default client;