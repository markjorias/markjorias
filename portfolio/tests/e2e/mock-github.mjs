// Stand-in for the GitHub API during e2e runs: serves the unit-test fixture repos.
import fs from "node:fs";
import http from "node:http";

const repos = fs.readFileSync(new URL("../fixtures/github-repos.json", import.meta.url));

http
  .createServer((req, res) => {
    const { pathname } = new URL(req.url ?? "/", "http://localhost");
    if (req.method === "GET" && pathname === "/users/markjorias/repos") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(repos);
      return;
    }
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end('{"message":"Not Found"}');
  })
  .listen(4010, () => console.log("mock GitHub on http://localhost:4010"));
