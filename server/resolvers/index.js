import {
  getJob,
  getJobs,
  getJobsByCompany,
  createJob,
  deleteJob,
  updateJob,
} from "../db/jobs.js";
import { getCompany } from "../db/companies.js";
import { GraphQLError } from "graphql";

// if the property of the object was returned is not defined on schema, it will not return the properties without error
export default {
  Query: {
    jobs: async () => {
      // resolver of "type Query"
      return await getJobs();
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
    createJob: (_root, { input: { title, description } }) => {
      const companyId = "FjcJCHJALA4i";
      return createJob({ companyId, title, description });
    },
    deleteJob: (_root, { id }) => {
      return deleteJob(id);
    },
    updateJob: (_root, { input: { id, title, description } }) => {
      return updateJob({ id, title, description });
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
    company: (job) => {
      return getCompany(job.companyId);
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
