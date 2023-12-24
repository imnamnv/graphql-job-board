export const typeDefs = `#graphql
    type Query {
        job(id: ID!): Job # pass a agument by query
        jobs(limit: Int, offset: Int): JobSubList
        company(id: ID!): Company
    }

    type JobSubList {
        items: [Job!]!,
        totalCount: Int!
    }

    type Mutation {
        createJob(input: CreateJobInput): Job
        deleteJob(id: ID!): Job
        updateJob(input: UpdateJobInput!): Job
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

    # type Company,.. is for output type
    # input CreateJobInput is for input type that use for Mutation
    input CreateJobInput {
        title:String!
        description: String
    }

    input UpdateJobInput {
        id: ID!
        title:String!
        description: String
    }
`;
