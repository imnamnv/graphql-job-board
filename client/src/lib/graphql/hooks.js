import { useMutation, useQuery } from "@apollo/client";
import {
  companyByIdQuery,
  createJobMutation,
  jobByIdQuery,
  jobsQuery,
} from "./queries";

export const useCompany = (id) => {
  const { data, error, loading } = useQuery(companyByIdQuery, {
    variables: { id },
  });

  return { company: data?.company, error: Boolean(error), loading };
};

export const useJob = (id) => {
  const { data, error, loading } = useQuery(jobByIdQuery, {
    variables: { id },
  });

  return { job: data?.job, error: Boolean(error), loading };
};

export const useJobs = () => {
  const { data, error, loading } = useQuery(jobsQuery, {
    fetchPolicy: "network-only",
  });

  return { jobs: data?.jobs, error: Boolean(error), loading };
};

export const useCreateJob = () => {
  const [mutate, { loading }] = useMutation(createJobMutation);
  const createJob = async (input) => {
    //use through hook
    const {
      data: { job },
    } = await mutate({
      variables: {
        input,
      },
      //function that is called when we get the response
      update: (cache, { data } /* it is result */) => {
        cache.writeQuery({
          query: jobByIdQuery, // we want to use the same query that we will use for getJob function, if not: it will return incorrect data when we call getJob: it will call cache first
          variables: { id: data.job.id },
          data,
        });
      },
    });
    return job;
  };

  return { createJob, loading };
};
