import { useEffect, useState } from "react";
import JobList from "../components/JobList";
import { getJobs } from "../lib/graphql/queries";
import { useJobs } from "../lib/graphql/hooks";

getJobs().then((jobs) => {
  console.log(jobs);
});

function HomePage() {
  // const [jobs, setJobs] = useState([]);

  // useEffect(() => {
  //   (async () => {
  //     setJobs(await getJobs());
  //   })();
  // }, []);

  const { jobs, error, loading } = useJobs();

  if (loading) return <>Loading...</>;
  if (error) return <>Data unavailable</>;

  return (
    <div>
      <h1 className="title">Job Board</h1>
      <JobList jobs={jobs} />
    </div>
  );
}

export default HomePage;
