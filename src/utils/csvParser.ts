/**
 * RFC 4180 Compliant CSV Parser & Serializer for Legal Datasets
 */

export interface ParsedCsvRow {
  rowIndex: number;
  raw: Record<string, string>;
  clauseText: string;
  rawLabel: string;
}

export interface CsvParseResult {
  headers: string[];
  rows: ParsedCsvRow[];
  clauseColumn: string | null;
  labelColumn: string | null;
  errors: string[];
  totalRows: number;
}

/**
 * Tokenizes and parses CSV text supporting quoted values and multiline rows.
 */
export function parseCsv(csvText: string): string[][] {
  const cleanText = csvText.replace(/^\uFEFF/, ''); // Strip BOM
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let insideQuotes = false;

  for (let i = 0; i < cleanText.length; i++) {
    const char = cleanText[i];
    const nextChar = cleanText[i + 1];

    if (insideQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          // Escaped quote: "" -> "
          currentField += '"';
          i++;
        } else {
          // End of quoted field
          insideQuotes = false;
        }
      } else {
        currentField += char;
      }
    } else {
      if (char === '"') {
        insideQuotes = true;
      } else if (char === ',') {
        currentRow.push(currentField);
        currentField = '';
      } else if (char === '\r') {
        if (nextChar === '\n') {
          i++; // Consume \n
        }
        currentRow.push(currentField);
        rows.push(currentRow);
        currentRow = [];
        currentField = '';
      } else if (char === '\n') {
        currentRow.push(currentField);
        rows.push(currentRow);
        currentRow = [];
        currentField = '';
      } else {
        currentField += char;
      }
    }
  }

  // Push last field & row if not empty
  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField);
    rows.push(currentRow);
  }

  return rows.filter(r => r.some(cell => cell.trim().length > 0));
}

/**
 * Parses and maps CSV dataset rows into structured clause rows with validation.
 */
export function parseAndValidateContractCsv(csvText: string): CsvParseResult {
  const rawRows = parseCsv(csvText);
  const errors: string[] = [];

  if (rawRows.length === 0) {
    return {
      headers: [],
      rows: [],
      clauseColumn: null,
      labelColumn: null,
      errors: ['The uploaded CSV file is empty.'],
      totalRows: 0
    };
  }

  const rawHeaders = rawRows[0].map(h => h.trim());
  const headerKeys = rawHeaders.map(h => h.toLowerCase().replace(/[^a-z0-9]/g, ''));

  // Detect clause column
  const clauseKeywords = ['clause', 'clausetext', 'text', 'contractclause', 'provision', 'sentence', 'statement'];
  let clauseColIdx = -1;
  for (let i = 0; i < headerKeys.length; i++) {
    if (clauseKeywords.some(kw => headerKeys[i].includes(kw))) {
      clauseColIdx = i;
      break;
    }
  }

  // Detect label column
  const labelKeywords = ['label', 'groundtruth', 'risklabel', 'actual', 'risk', 'actuallabel', 'category', 'class', 'target'];
  let labelColIdx = -1;
  for (let i = 0; i < headerKeys.length; i++) {
    if (i !== clauseColIdx && labelKeywords.some(kw => headerKeys[i].includes(kw))) {
      labelColIdx = i;
      break;
    }
  }

  // Fallback: If 2 columns, column 0 is text, column 1 is label
  if (clauseColIdx === -1 && rawHeaders.length >= 1) {
    clauseColIdx = 0;
  }
  if (labelColIdx === -1 && rawHeaders.length >= 2) {
    labelColIdx = 1;
  }

  if (clauseColIdx === -1) {
    errors.push('Could not identify a column containing clause text. Expected headers like "clause", "clause_text", or "text".');
  }
  if (labelColIdx === -1) {
    errors.push('Could not identify a column containing ground-truth risk labels. Expected headers like "label", "ground_truth", or "risk_label".');
  }

  const rows: ParsedCsvRow[] = [];
  const clauseColName = clauseColIdx >= 0 ? rawHeaders[clauseColIdx] : null;
  const labelColName = labelColIdx >= 0 ? rawHeaders[labelColIdx] : null;

  for (let r = 1; r < rawRows.length; r++) {
    const row = rawRows[r];
    const rawMap: Record<string, string> = {};
    rawHeaders.forEach((h, idx) => {
      rawMap[h] = row[idx] || '';
    });

    const clauseText = clauseColIdx >= 0 && row[clauseColIdx] ? row[clauseColIdx].trim() : '';
    const rawLabel = labelColIdx >= 0 && row[labelColIdx] ? row[labelColIdx].trim() : '';

    if (!clauseText && !rawLabel) {
      continue; // Skip entirely blank row
    }

    if (!clauseText) {
      errors.push(`Row ${r + 1}: Missing clause text.`);
    }
    if (!rawLabel) {
      errors.push(`Row ${r + 1}: Missing ground-truth risk label.`);
    }

    rows.push({
      rowIndex: r + 1,
      raw: rawMap,
      clauseText,
      rawLabel
    });
  }

  return {
    headers: rawHeaders,
    rows,
    clauseColumn: clauseColName,
    labelColumn: labelColName,
    errors,
    totalRows: rows.length
  };
}

/**
 * Generates CSV string from objects
 */
export function exportToCsv(headers: string[], rows: Record<string, any>[]): string {
  const escapeCell = (val: any) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const headerLine = headers.map(escapeCell).join(',');
  const lines = rows.map(row => headers.map(h => escapeCell(row[h])).join(','));
  return [headerLine, ...lines].join('\r\n');
}
