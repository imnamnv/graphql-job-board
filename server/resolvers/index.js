import {
  getJob,
  getJobs,
  getJobsByCompany,
  createJob,
  deleteJob,
  updateJob,
  countJobs,
} from "../db/jobs.js";
import { getCompany } from "../db/companies.js";
import { GraphQLError } from "graphql";

// if the property of the object was returned is not defined on schema, it will not return the properties without error
export default {
  Query: {
    jobs: async (_root, { limit, offset }) => {
      // resolver of "type Query"
      const items = await getJobs(limit, offset);
      const totalCount = await countJobs();
      return { items, totalCount };
    },
    // in this case we don't have parent schema => _root undefined
    job: async (_root, args) => {
      const job = await getJob(args.id);

      if (!job) {
        throw notFoundError("No Job found with id " + args.id);
      }
      return job;
    },
    company: async (_root, { id }) => {
      const company = await getCompany(id);

      if (!company) {
        throw notFoundError("No Company found with id " + id);
      }
      return company;
    },
  },

  Mutation: {
    createJob: (
      _root,
      { input: { title, description } },
      { user } /* auth is got from context in expressMiddleware  */
    ) => {
      if (!user) throw unauthorizedError("Missing authentication");
      return createJob({ companyId: user.companyId, title, description });
    },
    deleteJob: async (
      _root,
      { id },
      { user } /* auth is got from context in expressMiddleware  */
    ) => {
      if (!user) throw unauthorizedError("Missing authentication");

      const job = await deleteJob(id, user.companyId);

      if (!job) {
        throw notFoundError("No Job found with id " + id);
      }
      return job;
    },
    updateJob: async (
      _root,
      { input: { id, title, description } },
      { user } /* auth is got from context in expressMiddleware  */
    ) => {
      if (!user) throw unauthorizedError("Missing authentication");

      const job = await updateJob({
        id,
        title,
        description,
        companyId: user.companyId,
      });

      if (!job) {
        throw notFoundError("No Job found with id " + id);
      }
      return job;
    },
  },

  Job: {
    // underground, graphql will find if the properties that user want has resolver.
    // if not, it will using the same property that user want. By default, it is like:
    id: (job) => {
      return job.id;
    },
    // date is not a properties of getJobs, that why we need defined the resolver for that
    date: (job) => {
      // job is object was return from parent resolver: getJobs();
      return toIsoDate(job.createdAt);
    },
    company: (job, _args, { companyLoader }) => {
      // get new instance from context for EACH request
      // return getCompany(job.companyId); // normal way
      return companyLoader.load(job.companyId); // resolver N+1 problem: collect all of the companyId first => call the database to load
    },
  },

  Company: {
    jobs: (company) => {
      return getJobsByCompany(company.id);
    },
  },
};

function toIsoDate(value) {
  return value.slice(0, "yyyy-mm-dd".length);
}

function notFoundError(message) {
  return new GraphQLError(message, {
    extensions: {
      code: "NOT_FOUND",
    },
  });
}

function unauthorizedError(message) {
  return new GraphQLError(message, {
    extensions: {
      code: "UNAUTHORIZED",
    },
  });
}
