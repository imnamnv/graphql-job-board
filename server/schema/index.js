export const typeDefs = `#graphql
    type Query {
        job(id: ID!): Job # pass a agument by query
        jobs: [Job!]
        company(id: ID!): Company
    }
    """
    This is a documentation comment
    """
    type Job {
        id: ID!
        title: String!
        """
        This is a documentation comment. syntax: __bold__ 
        """
        date: String!
        description: String
        company: Company!
    }

    type Company {
        id: ID!
        name: String!
        description: String
        jobs: [Job!]! # first ! is make element is not null, the second is make array is not null
    }
`;
