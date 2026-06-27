# Carrega lectiva profes

Google Apps Script project managed with clasp.

## Purpose

This script syncs the bound spreadsheet's `professors` sheet from the workspace
spreadsheet named `Dades de professors`.

The source spreadsheet is discovered through a registry spreadsheet:

1. The script property `Tables` stores the registry spreadsheet ID.
2. The registry spreadsheet has a sheet named `tables`.
3. Column A contains spreadsheet names.
4. Column B contains spreadsheet IDs.
5. The script finds the row where column A is exactly `Dades de professors`.
6. The matching column B value is opened as the source spreadsheet.
7. Values from source sheet `Llista` replace the bound spreadsheet's
   `professors` sheet.

## Main Function

```javascript
syncProfessors()
```

## Local Setup

Install clasp and log in:

```bash
npm install -g @google/clasp
clasp login
```

This project is already linked to its Apps Script project through `.clasp.json`.

## Commands

```bash
npm run gas:pull
npm run gas:push
npm run gas:open
npm run gas:logs
```

`npm run gas:run` calls `clasp run syncProfessors`, which requires the Apps
Script project to be available as an API executable.

## Behavior

- The registry lookup is exact and case-sensitive.
- The sync copies computed values only, not formulas.
- The destination `professors` sheet is fully cleared before values are written.
- The destination sheet is expanded when the source has more rows or columns.

## Files

- `Código.js`: Apps Script implementation.
- `appsscript.json`: Apps Script manifest.
- `SPEC.md`: Functional specification.
- `.clasp.json`: clasp project binding.
# add_profes_to_carrega_lectiva
