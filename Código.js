const TABLES_PROPERTY = 'Tables';
const TABLES_SHEET_NAME = 'tables';
const SOURCE_SPREADSHEET_NAME = 'Dades de professors';
const SOURCE_SHEET_NAME = 'Llista';
const DESTINATION_SHEET_NAME = 'professors';

function syncProfessors() {
  const sourceSpreadsheetId = getSourceSpreadsheetId_();
  const sourceSheet = openSpreadsheetById_(sourceSpreadsheetId, 'source spreadsheet')
    .getSheetByName(SOURCE_SHEET_NAME);

  if (!sourceSheet) {
    throw new Error(`Source spreadsheet has no "${SOURCE_SHEET_NAME}" sheet.`);
  }

  const destinationSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  if (!destinationSpreadsheet) {
    throw new Error('This script must be bound to a spreadsheet.');
  }

  const destinationSheet = destinationSpreadsheet.getSheetByName(DESTINATION_SHEET_NAME);
  if (!destinationSheet) {
    throw new Error(`Bound spreadsheet has no "${DESTINATION_SHEET_NAME}" sheet.`);
  }

  const values = readSheetValues_(sourceSheet);
  clearSheet_(destinationSheet);

  if (values.length === 0) {
    console.log(`Cleared "${DESTINATION_SHEET_NAME}"; source sheet was empty.`);
    return;
  }

  ensureSheetSize_(destinationSheet, values.length, values[0].length);

  destinationSheet
    .getRange(1, 1, values.length, values[0].length)
    .setValues(values);

  console.log(`Copied ${values.length} rows from "${SOURCE_SHEET_NAME}" to "${DESTINATION_SHEET_NAME}".`);
}

function getSourceSpreadsheetId_() {
  const registrySpreadsheetId = PropertiesService
    .getScriptProperties()
    .getProperty(TABLES_PROPERTY);

  if (!registrySpreadsheetId) {
    throw new Error(`Missing required script property "${TABLES_PROPERTY}".`);
  }

  const registrySpreadsheet = openSpreadsheetById_(registrySpreadsheetId, 'registry spreadsheet');
  const registrySheet = registrySpreadsheet.getSheetByName(TABLES_SHEET_NAME);

  if (!registrySheet) {
    throw new Error(`Registry spreadsheet has no "${TABLES_SHEET_NAME}" sheet.`);
  }

  const lastRow = registrySheet.getLastRow();
  if (lastRow === 0) {
    throw new Error(`"${TABLES_SHEET_NAME}" sheet is empty.`);
  }

  const rows = registrySheet.getRange(1, 1, lastRow, 2).getValues();
  const match = rows.find((row) => row[0] === SOURCE_SPREADSHEET_NAME);

  if (!match) {
    throw new Error(`Could not find "${SOURCE_SPREADSHEET_NAME}" in column A of "${TABLES_SHEET_NAME}".`);
  }

  const sourceSpreadsheetId = match[1];
  if (!sourceSpreadsheetId) {
    throw new Error(`"${SOURCE_SPREADSHEET_NAME}" row has no spreadsheet ID in column B.`);
  }

  return String(sourceSpreadsheetId);
}

function openSpreadsheetById_(spreadsheetId, description) {
  try {
    return SpreadsheetApp.openById(String(spreadsheetId));
  } catch (error) {
    throw new Error(`Could not open ${description}: ${error.message}`);
  }
}

function readSheetValues_(sheet) {
  const lastRow = sheet.getLastRow();
  const lastColumn = sheet.getLastColumn();

  if (lastRow === 0 || lastColumn === 0) {
    return [];
  }

  return sheet.getRange(1, 1, lastRow, lastColumn).getValues();
}

function clearSheet_(sheet) {
  const filter = sheet.getFilter();
  if (filter) {
    filter.remove();
  }

  sheet.setConditionalFormatRules([]);
  sheet.getBandings().forEach((banding) => banding.remove());
  sheet.getCharts().forEach((chart) => sheet.removeChart(chart));
  sheet.clear();
  sheet.setFrozenRows(0);
  sheet.setFrozenColumns(0);
}

function ensureSheetSize_(sheet, requiredRows, requiredColumns) {
  const currentRows = sheet.getMaxRows();
  const currentColumns = sheet.getMaxColumns();

  if (currentRows < requiredRows) {
    sheet.insertRowsAfter(currentRows, requiredRows - currentRows);
  }

  if (currentColumns < requiredColumns) {
    sheet.insertColumnsAfter(currentColumns, requiredColumns - currentColumns);
  }
}
