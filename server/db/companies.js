import { connection } from "./connection.js";
import DataLoader from "dataloader";
const getCompanyTable = () => connection.table("company");

export async function getCompany(id) {
  return await getCompanyTable().first().where({ id });
}

// ids is array of companyID that we want to load. DataLoader will wait until it has all of id.
export const companyLoader = new DataLoader(async (ids) => {
  const companies = await getCompanyTable().select().whereIn("id", ids); // select multiple company by Ids: select * from ... where ... IN [...]
  return ids.map((id) => companies.find((company) => company.id === id)); // getCompanyTable will not return the array with correct order => we should return manually
});
// above strategy is will save to cache forever => it means we will get the same data when we call this request
// => we want to create new instance EACH request

export const createCompanyLoader = () => {
  return new DataLoader(async (ids) => {
    const companies = await getCompanyTable().select().whereIn("id", ids); // select multiple company by Ids: select * from ... where ... IN [...]
    return ids.map((id) => companies.find((company) => company.id === id)); // getCompanyTable will not return the array with correct order => we should return manually
  });
};
