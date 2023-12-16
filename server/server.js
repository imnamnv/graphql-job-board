import cors from "cors";
import express from "express";
import { authMiddleware, handleLogin } from "./auth.js";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { typeDefs } from "./schema/index.js";
import resolvers from "./resolvers/index.js";

const PORT = 9000;

const app = express();
app.use(cors(), express.json(), authMiddleware);

app.post("/login", handleLogin);

const apolloServer = new ApolloServer({ typeDefs, resolvers });
await apolloServer.start();

// using Apollo like a middleware, Apollo can using stand alone: startStandaloneServer
// or combine with express by: expressMiddleware
app.use("/graphql", expressMiddleware(apolloServer));

app.listen({ port: PORT }, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Graphql running on port http://localhost:${PORT}/graphql`);
});
