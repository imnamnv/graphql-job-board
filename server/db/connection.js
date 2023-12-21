import knex from "knex";

export const connection = knex({
  client: "better-sqlite3",
  connection: {
    filename: "./data/db.sqlite3",
  },
  useNullAsDefault: true,
});

// N+1 query problem: want to select job by 1 query, but it send 1 + N job query form get the companies
connection.on("query", ({ sql, bindings }) => {
  const query = connection.raw(sql, bindings).toQuery();
  console.log("db: ", query);
});
