import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { formatDate } from "../lib/formatters";
import { useEffect, useState } from "react";
import { getJob } from "../lib/graphql/queries";
import { useJob } from "../lib/graphql/hooks";

function JobPage() {
  const { jobId } = useParams();

  //use manually
  // const [job, setJob] = useState();

  // useEffect(() => {
  //   getJob(jobId).then(setJob); // we only set getJobs to call network every time. If getJob has cache => it will not call => we set by writeQuery function
  // }, [jobId]);

  // if (!job) return <>Loading...</>;

  //use through hook

  const { job, loading, error } = useJob(jobId);

  if (loading) return <>Loading...</>;
  if (error) return <>Data unavailable</>;

  return (
    <div>
      <h1 className="title is-2">{job.title}</h1>
      <h2 className="subtitle is-4">
        <Link to={`/companies/${job.company.id}`}>{job.company.name}</Link>
      </h2>
      <div className="box">
        <div className="block has-text-grey">
          Posted: {formatDate(job.date, "long")}
        </div>
        <p className="block">{job.description}</p>
      </div>
    </div>
  );
}

export default JobPage;
