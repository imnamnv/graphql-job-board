import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { getCompany } from "../lib/graphql/queries";
import JobList from "../components/JobList";

function CompanyPage() {
  const { companyId } = useParams();

  const [state, setState] = useState({
    company: null,
    loading: true,
    error: false,
  });

  useEffect(() => {
    (async () => {
      try {
        const company = await getCompany(companyId);
        setState({
          company,
          loading: false,
          error: false,
        });
      } catch (error) {
        console.log("error", error.response.errors[0].message);

        setState({
          company: null,
          loading: false,
          error: true,
        });
      }
    })();
  }, [companyId]);

  const { company, loading, error } = state;

  if (loading) return <>Loading...</>;

  if (error) return <>Data unavailable</>;

  return (
    <div>
      <h1 className="title">{company.name}</h1>
      <div className="box">{company.description}</div>

      <h2>Jobs list at {company.name}</h2>
      <JobList jobs={company.jobs} />
    </div>
  );
}

export default CompanyPage;
