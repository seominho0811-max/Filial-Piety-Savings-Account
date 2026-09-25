import { Transaction, TransactionType } from '../types/fund';

/**
 * Extracts Google Spreadsheet ID from any format of Google Sheets URL
 */
export function extractSpreadsheetId(url: string): string | null {
  if (!url) return null;
  const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : null;
}

/**
 * Converts user-provided Google Sheets URL to direct CSV export URL
 */
export function buildGoogleSheetsCsvUrl(rawUrl: string): string {
  const trimmed = rawUrl.trim();

  // If it's already an Apps Script endpoint or direct CSV link
  if (trimmed.includes('script.google.com') || trimmed.endsWith('.csv') || trimmed.includes('output=csv')) {
    return trimmed;
  }

  const id = extractSpreadsheetId(trimmed);
  if (id) {
    // Check if a specific gid was specified in url
    const gidMatch = trimmed.match(/[#&?]gid=([0-9]+)/);
    const gid = gidMatch ? gidMatch[1] : '0';
    return `https://docs.google.com/spreadsheets/d/${id}/export?format=csv&gid=${gid}`;
  }

  return trimmed;
}

/**
 * Parses CSV string into structured Transaction objects
 * Supports flexible column headers in Korean or English
 */
export function parseGoogleSheetsCsv(csvText: string): Transaction[] {
  const lines = parseCsvRows(csvText);
  if (lines.length < 2) return [];

  // Parse header line
  const header = lines[0].map(h => h.trim().toLowerCase().replace(/\s+/g, ''));
  
  // Find indices for standard columns
  const dateIdx = header.findIndex(h => h.includes('날짜') || h.includes('일자') || h.includes('date'));
  const typeIdx = header.findIndex(h => h.includes('구분') || h.includes('유형') || h.includes('type'));
  const memberIdx = header.findIndex(h => h.includes('입금자') || h.includes('담당자') || h.includes('이름') || h.includes('사용처') || h.includes('member'));
  const amountIdx = header.findIndex(h => h.includes('금액') || h.includes('amount') || h.includes('원'));
  const categoryIdx = header.findIndex(h => h.includes('카테고리') || h.includes('항목') || h.includes('분류') || h.includes('category'));
  const noteIdx = header.findIndex(h => h.includes('비고') || h.includes('내역') || h.includes('메모') || h.includes('상세') || h.includes('note'));

  const transactions: Transaction[] = [];

  for (let i = 1; i < lines.length; i++) {
    const row = lines[i];
    if (row.length === 0 || row.every(cell => !cell.trim())) continue;

    const rawDate = (dateIdx >= 0 ? row[dateIdx] : row[0])?.trim() || '';
    const rawType = (typeIdx >= 0 ? row[typeIdx] : row[1])?.trim() || '';
    const rawMember = (memberIdx >= 0 ? row[memberIdx] : row[2])?.trim() || '';
    const rawAmount = (amountIdx >= 0 ? row[amountIdx] : row[3])?.trim() || '0';
    const rawCategory = (categoryIdx >= 0 ? row[categoryIdx] : row[4])?.trim() || '기타';
    const rawNote = (noteIdx >= 0 ? row[noteIdx] : row[5])?.trim() || '';

    // Normalize date (YYYY-MM-DD)
    const normalizedDate = normalizeDateString(rawDate);
    if (!normalizedDate) continue;

    // Normalize type
    const normalizedType: TransactionType = 
      rawType.includes('지출') || rawType.includes('출금') || rawType.toLowerCase() === 'expense'
        ? '지출'
        : '입금';

    // Normalize amount
    const cleanAmount = parseInt(rawAmount.replace(/[^0-9-]/g, ''), 10);
    if (isNaN(cleanAmount) || cleanAmount === 0) continue;

    transactions.push({
      id: `row-${i}-${normalizedDate}-${cleanAmount}`,
      date: normalizedDate,
      type: normalizedType,
      member: rawMember || (normalizedType === '입금' ? '형제' : '부모님'),
      amount: Math.abs(cleanAmount),
      category: rawCategory || (normalizedType === '입금' ? '정기적립' : '기타'),
      note: rawNote,
    });
  }

  // Sort by date descending (most recent first)
  return transactions.sort((a, b) => b.date.localeCompare(a.date));
}

/**
 * Robust CSV parser that handles quoted cells, commas inside quotes, and newlines
 */
function parseCsvRows(text: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentCell += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      currentRow.push(currentCell);
      currentCell = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++; // skip \n in CRLF
      }
      currentRow.push(currentCell);
      if (currentRow.some(c => c.trim().length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentCell = '';
    } else {
      currentCell += char;
    }
  }

  if (currentCell.length > 0 || currentRow.length > 0) {
    currentRow.push(currentCell);
    if (currentRow.some(c => c.trim().length > 0)) {
      rows.push(currentRow);
    }
  }

  return rows;
}

/**
 * Normalizes different date formats to YYYY-MM-DD
 */
export function normalizeDateString(dateStr: string): string | null {
  if (!dateStr) return null;
  const clean = dateStr.trim();

  // Match 2025-01-05 or 2025/01/05 or 2025.01.05
  const match1 = clean.match(/^(\d{4})[-./](\d{1,2})[-./](\d{1,2})/);
  if (match1) {
    const year = match1[1];
    const month = match1[2].padStart(2, '0');
    const day = match1[3].padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Match 25-01-05 or 25.1.5
  const match2 = clean.match(/^(\d{2})[-./](\d{1,2})[-./](\d{1,2})/);
  if (match2) {
    const year = `20${match2[1]}`;
    const month = match2[2].padStart(2, '0');
    const day = match2[3].padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  return null;
}

/**
 * Fetch and parse data from Google Sheets or Apps Script Web App
 */
export async function fetchGoogleSheetData(rawUrl: string): Promise<Transaction[]> {
  const url = buildGoogleSheetsCsvUrl(rawUrl);

  // 1. Direct fetch
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'text/csv, application/json, text/plain, */*'
      }
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    const contentType = res.headers.get('content-type') || '';
    const text = await res.text();

    // Check if JSON from Google Apps Script or GViz
    if (contentType.includes('application/json') || text.trim().startsWith('{') || text.trim().startsWith('[')) {
      try {
        const json = JSON.parse(text);
        if (Array.isArray(json)) {
          return mapJsonArrayToTransactions(json);
        } else if (json.data && Array.isArray(json.data)) {
          return mapJsonArrayToTransactions(json.data);
        }
      } catch {
        // Fallback to text parser
      }
    }

    // Check if Google Visualization API response: google.visualization.Query.setResponse({...})
    if (text.includes('google.visualization.Query.setResponse')) {
      const gvizTransactions = parseGVizResponse(text);
      if (gvizTransactions.length > 0) return gvizTransactions;
    }

    // Default: CSV parsing
    const parsed = parseGoogleSheetsCsv(text);
    if (parsed.length > 0) {
      return parsed;
    }
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.warn('Direct fetch failed, attempting proxy fallback...', errorMessage);

    // 2. CORS fallback via public proxy if direct fetch is blocked
    try {
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
      const proxyRes = await fetch(proxyUrl);
      if (proxyRes.ok) {
        const proxyText = await proxyRes.text();
        const proxyParsed = parseGoogleSheetsCsv(proxyText);
        if (proxyParsed.length > 0) {
          return proxyParsed;
        }
      }
    } catch (proxyErr) {
      console.error('Proxy fetch failed too:', proxyErr);
    }

    throw new Error(
      '구글 시트 데이터를 불러오지 못했습니다. ' +
      '시트 공유 설정이 [링크가 있는 모든 사용자 - 뷰어]로 되어 있는지, 혹은 [파일 > 공유 > 웹에 게시]로 CSV 게시가 되었는지 확인해 주세요.'
    );
  }

  throw new Error('시트에서 유효한 행을 찾을 수 없습니다. 컬럼(날짜, 구분, 입금자, 금액, 카테고리, 비고)을 확인해 주세요.');
}

/**
 * Maps arbitrary JSON array (e.g. from Google Apps Script) to Transaction array
 */
function mapJsonArrayToTransactions(rows: Record<string, unknown>[]): Transaction[] {
  return rows.map((row, idx) => {
    const date = normalizeDateString(String(row.날짜 || row.date || row.Date || '')) || '2025-01-01';
    const typeStr = String(row.구분 || row.type || row.Type || '');
    const type: TransactionType = typeStr.includes('지출') ? '지출' : '입금';
    const member = String(row.입금자 || row.이름 || row.담당자 || row.member || row.Member || (type === '입금' ? '형제' : '부모님'));
    const amountVal = Number(row.금액 || row.amount || row.Amount || 0);
    const category = String(row.카테고리 || row.category || row.Category || '기타');
    const note = String(row.비고 || row.note || row.Note || '');

    return {
      id: `gas-${idx}-${date}-${amountVal}`,
      date,
      type,
      member,
      amount: Math.abs(amountVal),
      category,
      note,
    };
  }).filter(t => t.amount > 0).sort((a, b) => b.date.localeCompare(a.date));
}

/**
 * Parses Google Visualization API (GViz) response
 */
function parseGVizResponse(rawText: string): Transaction[] {
  try {
    const jsonStr = rawText.substring(rawText.indexOf('{'), rawText.lastIndexOf('}') + 1);
    const gviz = JSON.parse(jsonStr);
    const cols = gviz.table.cols.map((c: { label?: string }) => (c.label || '').trim());
    const rows = gviz.table.rows;

    const dateColIdx = cols.findIndex((c: string) => c.includes('날짜') || c.includes('일자')) !== -1 ? cols.findIndex((c: string) => c.includes('날짜') || c.includes('일자')) : 0;
    const typeColIdx = cols.findIndex((c: string) => c.includes('구분')) !== -1 ? cols.findIndex((c: string) => c.includes('구분')) : 1;
    const memberColIdx = cols.findIndex((c: string) => c.includes('입금자') || c.includes('담당자')) !== -1 ? cols.findIndex((c: string) => c.includes('입금자') || c.includes('담당자')) : 2;
    const amountColIdx = cols.findIndex((c: string) => c.includes('금액')) !== -1 ? cols.findIndex((c: string) => c.includes('금액')) : 3;
    const catColIdx = cols.findIndex((c: string) => c.includes('카테고리')) !== -1 ? cols.findIndex((c: string) => c.includes('카테고리')) : 4;
    const noteColIdx = cols.findIndex((c: string) => c.includes('비고')) !== -1 ? cols.findIndex((c: string) => c.includes('비고')) : 5;

    const transactions: Transaction[] = [];

    rows.forEach((r: { c: Array<{ v?: unknown; f?: string } | null> }, i: number) => {
      const getVal = (idx: number) => {
        const cell = r.c[idx];
        if (!cell) return '';
        return cell.f || (cell.v !== null && cell.v !== undefined ? String(cell.v) : '');
      };

      const rawDate = getVal(dateColIdx);
      const rawType = getVal(typeColIdx);
      const rawMember = getVal(memberColIdx);
      const rawAmount = getVal(amountColIdx);
      const rawCat = getVal(catColIdx);
      const rawNote = getVal(noteColIdx);

      const normalizedDate = normalizeDateString(rawDate);
      if (!normalizedDate) return;

      const type: TransactionType = rawType.includes('지출') ? '지출' : '입금';
      const cleanAmount = parseInt(rawAmount.replace(/[^0-9-]/g, ''), 10);
      if (isNaN(cleanAmount) || cleanAmount === 0) return;

      transactions.push({
        id: `gviz-${i}-${normalizedDate}`,
        date: normalizedDate,
        type,
        member: rawMember || (type === '입금' ? '형제' : '공동'),
        amount: Math.abs(cleanAmount),
        category: rawCat || '기타',
        note: rawNote,
      });
    });

    return transactions.sort((a, b) => b.date.localeCompare(a.date));
  } catch {
    return [];
  }
}

/**
 * Checks if a given URL is a Google Apps Script Web App URL
 */
export function isAppsScriptUrl(url: string): boolean {
  if (!url) return false;
  return url.includes('script.google.com/macros/s/');
}

/**
 * Sends a POST request to Google Apps Script Web App to append a new transaction row to Google Sheets
 */
export async function saveTransactionToGoogleSheet(
  scriptUrl: string,
  tx: Transaction
): Promise<{ success: boolean; message: string }> {
  if (!scriptUrl || !isAppsScriptUrl(scriptUrl)) {
    throw new Error('구글 시트에 직접 자동 저장하려면 Google Apps Script 웹 앱 URL이 필요합니다.');
  }

  const payload = {
    날짜: tx.date,
    구분: tx.type,
    입금자: tx.member,
    금액: tx.amount,
    카테고리: tx.category,
    비고: tx.note,
  };

  try {
    // Note: Google Apps Script requires text/plain to avoid preflight CORS issues upon HTTP 302 redirect
    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      try {
        const json = await response.json();
        if (json.status === 'error') {
          throw new Error(json.error || '시트 저장 중 오류가 발생했습니다.');
        }
        return { success: true, message: json.message || '구글 시트에 저장 완료!' };
      } catch {
        // If response is not JSON or redirected
        return { success: true, message: '구글 시트에 저장되었습니다.' };
      }
    } else {
      throw new Error(`HTTP ${response.status}: 시트 저장에 실패했습니다.`);
    }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    // If it's a TypeError: Failed to fetch (sometimes caused by CORS redirect in some browsers),
    // we also try mode: 'no-cors' fallback as Google Apps Script still executes the script!
    try {
      await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(payload),
      });
      return {
        success: true,
        message: '구글 시트로 저장 요청을 전송했습니다. (시트에서 행이 추가되었는지 확인해 주세요)',
      };
    } catch {
      throw new Error(`구글 시트 저장 실패: ${errorMsg}`);
    }
  }
}

/**
 * Sample CSV template content to download or copy
 */
export const SAMPLE_CSV_TEMPLATE = `날짜,구분,입금자/담당자,금액,카테고리,비고
2025-01-05,입금,첫째,200000,정기적립,1월 회비 입금
2025-01-10,입금,둘째,200000,정기적립,1월 회비 입금
2025-01-15,입금,셋째,200000,정기적립,1월 회비 입금
2025-01-28,지출,첫째,600000,부모님용돈,설 명절 부모님 용돈 전달
2025-02-05,입금,첫째,200000,정기적립,2월 회비 입금
2025-02-10,입금,둘째,200000,정기적립,2월 회비 입금
2025-02-15,입금,셋째,200000,정기적립,2월 회비 입금
2025-05-08,지출,둘째,450000,가족식사/여행,어버이날 부모님과 일식당 식사
2025-07-15,지출,셋째,800000,병원/건강,부모님 위·대장 내시경 종합건강검진
`;

/**
 * Perfect Google Apps Script code that users can paste in Google Sheets > Extensions > Apps Script
 * Supports BOTH reading (doGet) and writing (doPost) for two-way live sync!
 */
export const GOOGLE_APPS_SCRIPT_CODE = `/**
 * [삼형제 효도통장] 구글 시트 양방향 실시간 연동 스크립트 (읽기 + 쓰기)
 * 1. 구글 시트 상단 메뉴: [확장 프로그램] > [Apps Script] 클릭
 * 2. 기존 코드를 모두 지우고 이 코드를 붙여넣은 뒤 저장(Ctrl+S)
 * 3. 오른쪽 상단 [배포] > [새 배포] 클릭
 * 4. 유형: [웹 앱] 선택
 * 5. 다음 사용자로 실행: [나]
 * 6. 액세스 권한: [모든 사용자] 선택 후 [배포] 클릭
 * 7. 발급된 '웹 앱 URL'을 대시보드에 입력하면 읽기 및 쓰기(자동 저장)가 모두 실시간 작동합니다!
 */

// 1. [읽기] 대시보드로 시트 데이터 전달
function doGet(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = sheet.getDataRange().getValues();
    if (data.length < 2) {
      return responseJson([]);
    }

    const result = [];
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (!row[0] && !row[1] && !row[3]) continue; // 빈 행 건너뛰기

      const dateObj = row[0] instanceof Date 
        ? Utilities.formatDate(row[0], "Asia/Seoul", "yyyy-MM-dd") 
        : String(row[0]).trim();

      result.push({
        날짜: dateObj,
        구분: String(row[1] || '입금').trim(),
        입금자: String(row[2] || '').trim(),
        금액: Number(String(row[3] || '0').replace(/[^0-9-]/g, '')) || 0,
        카테고리: String(row[4] || '기타').trim(),
        비고: String(row[5] || '').trim()
      });
    }

    return responseJson(result);
  } catch (err) {
    return responseJson({ error: err.message });
  }
}

// 2. [쓰기] 앱에서 입력한 거래 내역을 구글 시트 맨 아래에 행으로 자동 추가
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    let data;
    try {
      data = JSON.parse(e.postData.contents);
    } catch (parseErr) {
      data = e.parameter;
    }

    const dateVal = data.날짜 || data.date || Utilities.formatDate(new Date(), "Asia/Seoul", "yyyy-MM-dd");
    const typeVal = data.구분 || data.type || "입금";
    const memberVal = data.입금자 || data.member || "";
    const amountVal = Number(String(data.금액 || data.amount || 0).replace(/[^0-9-]/g, '')) || 0;
    const catVal = data.카테고리 || data.category || "기타";
    const noteVal = data.비고 || data.note || "";

    // 구글 시트에 새 행 추가!
    sheet.appendRow([dateVal, typeVal, memberVal, amountVal, catVal, noteVal]);

    return responseJson({ status: "success", message: "구글 시트에 성공적으로 저장되었습니다." });
  } catch (err) {
    return responseJson({ status: "error", error: err.message });
  }
}

function responseJson(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
`;
