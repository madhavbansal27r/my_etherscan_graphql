const { ApolloServer } = require("apollo-server");
// Import schema and datasource 
const { importSchema } = require("graphql-import"); 
const EtherDataSource = require("./datasource/ethDatasource");

// Import schema from schema.graphql file
const typeDefs = importSchema("./schema.graphql"); 

// Load environment variables
require("dotenv").config();

// Resolvers match schema fields to data source methods
const resolvers = {
  Query: {
    etherBalanceByAddress: (root, _args, { dataSources }) =>
      dataSources.ethDataSource.etherBalanceByAddress(),

    totalSupplyOfEther: (root, _args, { dataSources }) =>  
      dataSources.ethDataSource.totalSupplyOfEther(),

    latestEthereumPrice: (root, _args, { dataSources }) =>
      dataSources.ethDataSource.getLatestEthereumPrice(),

    blockConfirmationTime: (root, _args, { dataSources }) =>
      dataSources.ethDataSource.getBlockConfirmationTime(),
  },
};

// Create ApolloServer instance
const server = new ApolloServer({
  typeDefs,
  resolvers,
  
  // DataSource passed to resolvers
  dataSources: () => ({
    ethDataSource: new EtherDataSource(), 
  }), 
});

// Set timeout and start server 
server.timeout = 0;
server.listen("9000").then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`); 
});
