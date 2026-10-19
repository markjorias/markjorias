import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { loadExperience } from "@/lib/experience";
import { publicFileExists } from "@/lib/public-file";
import { loadSite } from "@/lib/site";

let tmp: string;

beforeEach(() => {
  tmp = fs.mkdtempSync(path.join(os.tmpdir(), "portfolio-content-"));
});

afterEach(() => {
  fs.rmSync(tmp, { recursive: true, force: true });
});

test("loads the real site config", async () => {
  const s = await loadSite("tests/fixtures/content");
  expect(s.name).toBe("Joseph Orias");
  expect(s.email).toBe("oriasmjc@gmail.com");
});

test("experience keeps file order", async () => {
  const e = await loadExperience("tests/fixtures/content");
  expect(e.map((x) => x.org)).toEqual(["Camarines Sur Polytechnic Colleges", "JPCS – CSPC Chapter"]);
});

test("invalid JSON names the file", async () => {
  fs.writeFileSync(path.join(tmp, "experience.json"), "{ nope");
  await expect(loadExperience(tmp)).rejects.toThrow(/experience\.json/);
});

test("missing field names the file and field", async () => {
  fs.writeFileSync(path.join(tmp, "experience.json"), '[{"org":"X"}]');
  await expect(loadExperience(tmp)).rejects.toThrow(/experience\.json.*title/);
});

test("site email must be an email", async () => {
  const site = JSON.parse(fs.readFileSync("tests/fixtures/content/site.json", "utf8"));
  fs.writeFileSync(path.join(tmp, "site.json"), JSON.stringify({ ...site, email: "nope" }));
  await expect(loadSite(tmp)).rejects.toThrow(/site\.json.*email/);
});

test("publicFileExists reflects public/", () => {
  expect(publicFileExists("definitely-not-here.pdf")).toBe(false);
});
