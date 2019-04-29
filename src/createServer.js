const { GraphQLServer, PubSub } = require('graphql-yoga');
const Mutation = require('./resolvers/Mutation');
const Query = require('./resolvers/Query');
const LiveStreams = require('./resolvers/LiveStreams');
const db = require('./db');
const pubSub = new PubSub();

// Create the GraphQL Yoga Server

function createServer() {
  return new GraphQLServer({
    typeDefs: 'src/schema.graphql',
    resolvers: {
      Mutation,
      Query,
      LiveStreams
    },
    resolverValidationOptions: {
      requireResolversForResolveType: false,
    },
    context: req => ({ ...req, db, pubSub }),
  });
}

module.exports = createServer;
