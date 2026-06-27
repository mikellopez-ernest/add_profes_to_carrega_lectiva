# Professor List Sync Specification

## Goal

The Apps Script project runs from a bound spreadsheet. Its job is to refresh the
bound spreadsheet's `professors` sheet with data copied from the `Llista` sheet
inside the workspace spreadsheet named `Dades de professors`.

## Source Registry

- The script property `Tables` stores the ID of a spreadsheet.
- That spreadsheet contains a sheet named `tables`.
- The `tables` sheet has:
  - Column A: spreadsheet name
  - Column B: spreadsheet ID
- The script must find the row where column A is exactly `Dades de professors`.
  The match is exact and case-sensitive.
- The corresponding column B value is the source spreadsheet ID.

## Sync Flow

1. Read the script property `Tables`.
2. Open the spreadsheet whose ID is stored in `Tables`.
3. Open its `tables` sheet.
4. Find `Dades de professors` in column A.
5. Read the spreadsheet ID from column B on the same row.
6. Open that source spreadsheet.
7. Read all display-independent cell values from its `Llista` sheet.
8. Open the spreadsheet that owns the script.
9. Open its `professors` sheet.
10. Clear the existing contents, formatting, validations, notes, and other sheet
    state from `professors`.
11. Write the copied `Llista` values into `professors`, starting at cell A1.
12. Fill column O in `professors` with the concatenated values from columns C,
    D, and E for each copied row, joined with a single space.

## Expected Behavior

- The destination sheet should contain exactly the copied values from `Llista`.
- Formulas from `Llista` should not be copied as formulas; only their computed
  values should be written.
- Previous destination values outside the new copied range should be removed.
- Existing destination formatting, notes, validations, filters, frozen rows, and
  other sheet state should be cleared before writing the copied values.
- After the copied values are written, column O should contain the full professor
  name built from columns C, D, and E.
- Example: if column C is `Mikel`, column D is `López`, and column E is
  `Villarroya`, column O should be `Mikel López Villarroya`.

## Error Cases

The script should fail clearly when:

- The `Tables` script property is missing or empty.
- The registry spreadsheet cannot be opened.
- The registry spreadsheet has no `tables` sheet.
- `Dades de professors` is not found in column A.
- The matching row has no spreadsheet ID in column B.
- The source spreadsheet cannot be opened.
- The source spreadsheet has no `Llista` sheet.
- The bound spreadsheet has no `professors` sheet.

## Resolved Decisions

- The registry lookup is exact and case-sensitive.
- The sync copies values only, not formulas.
- The destination `professors` sheet is fully cleared before values are written.
- Column O is generated after the value copy by joining columns C, D, and E with
  a single space.
