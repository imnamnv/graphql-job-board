import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  concat,
  gql,
  ApolloLink,
} from "@apollo/client"; // the main reasion to change to ApolloClient is more future: Cache. ApolloClient only work with gql from graphql-tag. It returns DocumentNode
import { GraphQLClient /*, gql*/ } from "graphql-request"; //gql is return string, it just makes extendsion detech the code
import { getAccessToken } from "../auth";

//graphql-request
const client = new GraphQLClient("http://localhost:9000/graphql", {
  headers: () => {
    // set for all request
    const accessToken = getAccessToken();
    if (accessToken) {
      return {
        Authorization: `Bearer ${accessToken}`,
      };
    }
    return {};
  },
});

// apollo-client setting the header is different way : https://www.apollographql.com/docs/react/api/link/introduction
const httpLink = createHttpLink({ uri: "http://localhost:9000/graphql" });

const authLink = new ApolloLink((operation, forward) => {
  // set for all request
  const accessToken = getAccessToken();
  if (accessToken) {
    operation.setContext(({ headers }) => {
      console.log("headers", headers);
      return {
        headers: { ...headers, Authorization: `Bearer ${accessToken}` },
      };
    });
  }
  return forward(operation);
});

// https://www.apollographql.com/docs/react/networking/advanced-http-networking/#:~:text=own%20custom%20links.-,Customizing%20request%20logic,-The%20following%20example
const apolloClient = new ApolloClient({
  link: concat(authLink, httpLink),
  cache: new InMemoryCache(),
});

export async function getJobs() {
  // we can add #graphql for help extendsion know the graphql code
  const query = gql`
    query {
      jobs {
        id
        title
        date
        company {
          name
          id
        }
      }
    }
  `;
  // graphql-request
  // const { jobs } = await client.request(query);
  // return jobs;

  // apollo-client
  const { data } = await apolloClient.query({ query });
  return data.jobs;
}

export async function getJob(id) {
  const query = gql`
    query ($id: ID!) {
      job(id: $id) {
        id
        date
        description
        title
        company {
          id
          name
        }
      }
    }
  `;

  // graphql-request
  // const { job } = await client.request(query, { id }); // second parameter is variables
  // return job;

  // apollo-client
  const { data } = await apolloClient.query({
    query,
    variables: { id },
  });

  return data.job;
}

export async function getCompany(id) {
  const query = gql`
    query ($id: ID!) {
      company(id: $id) {
        id
        name
        description
        jobs {
          id
          date
          title
        }
      }
    }
  `;
  // graphql-request
  // const { company } = await client.request(query, { id });
  // return company;

  // apollo-client
  const { data } = await apolloClient.query({ query, variables: { id } });
  return data.company;
}

export async function createJob({ title, description }) {
  const mutation = gql`
    mutation CreateJob($input: CreateJobInput) {
      job: createJob(input: $input) {
        # "job" is for rename of te property that return from server: createJob
        id
      }
    }
  `;

  // graphql-request
  // const { job } = await client.request(
  //   mutation,
  //   {
  //     input: { title, description },
  //   },
  //   {} /* we can set header for earch request */
  // );

  // apollo-client
  const { data } = await apolloClient.mutate({
    mutation,
    variables: {
      input: { title, description },
    },
  });
  return data.job;
}
