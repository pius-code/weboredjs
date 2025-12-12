import { JWT } from "google-auth-library";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";

// Get the directory of the current file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const pathToCredentials = join(__dirname, "..", "credentials.json");

const credentialsJson = JSON.parse(fs.readFileSync(pathToCredentials, "utf-8"));

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

// Create JWT auth
export const sheetsAuth = new JWT({
  email: credentialsJson.client_email,
  key: credentialsJson.private_key,
  scopes: SCOPES,
});

export const getSheetsClient = () => {
  return sheetsAuth;
};
