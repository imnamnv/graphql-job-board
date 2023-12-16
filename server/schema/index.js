export const typeDefs = `#graphql
    type Query {
        jobs: [Job!]
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
    }
`;
