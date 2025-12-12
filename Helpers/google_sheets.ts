import { GoogleSpreadsheet } from "google-spreadsheet";
import { sheetsAuth } from "../core/google_sheets.js";

const SHEET_ID = "1e5mbXbad012ouwTCuXMAgFHjBMdCF2Iw8kcs07VOGiU";

// raw method to get from any sheet
const getSheetData = async (sheetName: string) => {
  try {
    const doc = new GoogleSpreadsheet(SHEET_ID, sheetsAuth);
    await doc.loadInfo();

    const sheet = doc.sheetsByTitle[sheetName];
    const rows = await sheet.getRows();
    return rows;
  } catch (error) {
    console.error(`Error fetching data from ${sheetName}:`, error);
    throw error;
  }
};

export const getRandomData = async (sheetName: string) => {
  const data = await getSheetData(sheetName);
  const randomData = data[Math.floor(Math.random() * (await data).length)];
  console.log(randomData.get("Question"));
  return randomData.get("Question");
};
