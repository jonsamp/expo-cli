import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache, defaultDataIdFromObject } from 'apollo-cache-inmemory';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { WebSocketLink } from 'apollo-link-ws';
import fetch from 'isomorphic-fetch';

let GRAPHQL_HTTP_URL = 'http://localhost:19000/graphql';
let GRAPHQL_WS_URL = 'ws://localhost:19000/graphql';

export default function createApolloClient(initialState) {
  if (process.browser) {
    return new ApolloClient({
      link: new WebSocketLink(
        new SubscriptionClient(GRAPHQL_WS_URL, {
          reconnect: true,
        })
      ),
      cache: new InMemoryCache({ dataIdFromObject }).restore(initialState),
    });
  } else {
    return new ApolloClient({
      ssrMode: true,
      // TODO(ville): Use apollo-link-schema on the server
      link: new HttpLink({
        uri: GRAPHQL_HTTP_URL,
        fetch,
      }),
      cache: new InMemoryCache({ dataIdFromObject }),
    });
  }
}

function dataIdFromObject(object) {
  switch (object.__typename) {
    case 'Project':
      return `Project:${object.projectDir}`;
    case 'UserSettings':
      return 'UserSettings';
    default:
      return defaultDataIdFromObject(object);
  }
}