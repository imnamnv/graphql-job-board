import cors from "cors";
import express from "express";
import { authMiddleware, handleLogin } from "./auth.js";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { typeDefs } from "./schema/index.js";
import resolvers from "./resolvers/index.js";
import { getUser } from "./db/users.js";
import { createCompanyLoader } from "./db/companies.js";

const PORT = 9000;

const app = express();
app.use(
  cors(),
  express.json(),
  authMiddleware
); /* authMiddleware will return the available user to request.auth */

app.post("/login", handleLogin);

const apolloServer = new ApolloServer({ typeDefs, resolvers });
await apolloServer.start();

// setting context for EACH request
async function getContext({ req }) {
  const companyLoader = createCompanyLoader();

  const context = { companyLoader };
  if (req.auth) {
    context.user = await getUser(req.auth.sub);
  }
  return context;
}

// using Apollo like a middleware, Apollo can using stand alone: startStandaloneServer
// or combine with express by: expressMiddleware
app.use(
  "/graphql",
  expressMiddleware(apolloServer, {
    context:
      getContext /* we can get the context as the 3rd arguments at resolver */,
  })
);

app.listen({ port: PORT }, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Graphql running on port http://localhost:${PORT}/graphql`);
});
