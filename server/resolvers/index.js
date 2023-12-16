import { getJobs } from "../db/jobs.js";
import { getCompany } from "../db/companies.js";

// if the property of the object was returned is not defined on schema, it will not return the properties without error
export default {
  Query: {
    jobs: async () => {
      // resolver of type Query
      return await getJobs();
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
};

function toIsoDate(value) {
  return value.slice(0, "yyyy-mm-dd".length);
}
