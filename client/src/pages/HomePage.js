import { useEffect, useState } from "react";
import JobList from "../components/JobList";
import { getJobs } from "../lib/graphql/queries";
import { useJobs } from "../lib/graphql/hooks";

// how can we call grapql manually
// getJobs().then((jobs) => {
//   console.log(jobs);
// });
const JOBS_PER_PAGE = 5;
function HomePage() {
  const [currentPage, setCurrentPage] = useState(1);
  // const [jobs, setJobs] = useState([]);

  // useEffect(() => {
  //   (async () => {
  //     setJobs(await getJobs());
  //   })();
  // }, []);

  const { jobs, error, loading } = useJobs(
    JOBS_PER_PAGE,
    (currentPage - 1) * JOBS_PER_PAGE // first page should from 0
  );

  if (loading) return <>Loading...</>;
  if (error) return <>Data unavailable</>;

  const totalPage = Math.ceil(jobs.totalCount / JOBS_PER_PAGE);

  return (
    <div>
      <h1 className="title">Job Board</h1>
      <div>
        <button
          disabled={currentPage === 1}
          onClick={() => {
            setCurrentPage(currentPage - 1);
          }}
        >
          Previous
        </button>
        <span>
          {" "}
          {currentPage} of {totalPage}{" "}
        </span>
        <button
          disabled={totalPage === currentPage}
          onClick={() => {
            setCurrentPage(currentPage + 1);
          }}
        >
          Next
        </button>
      </div>
      <JobList jobs={jobs.items} />
    </div>
  );
}

export default HomePage;
