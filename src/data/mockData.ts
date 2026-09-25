import { Transaction, BrotherStatus, FundSummary, MonthlyAggregation, CategoryExpense } from '../types/fund';

/**
 * Realistic filial fund transactions starting from January 2025
 */
export const INITIAL_MOCK_TRANSACTIONS: Transaction[] = [
  // 2026 transactions
  { id: 'tx-2026-09-05', date: '2026-09-05', type: '입금', member: '첫째', category: '정기적립', amount: 200000, note: '9월 회비 입금' },
  { id: 'tx-2026-09-10', date: '2026-09-10', type: '입금', member: '둘째', category: '정기적립', amount: 200000, note: '9월 회비 입금' },
  { id: 'tx-2026-09-12', date: '2026-09-12', type: '입금', member: '셋째', category: '정기적립', amount: 200000, note: '9월 회비 입금' },
  { id: 'tx-2026-08-15', date: '2026-08-15', type: '지출', member: '둘째', category: '가족식사/여행', amount: 380000, note: '늦여름 부모님 모시고 계곡 백숙 & 가족 나들이' },
  { id: 'tx-2026-08-05', date: '2026-08-05', type: '입금', member: '첫째', category: '정기적립', amount: 200000, note: '8월 회비 입금' },
  { id: 'tx-2026-08-10', date: '2026-08-10', type: '입금', member: '둘째', category: '정기적립', amount: 200000, note: '8월 회비 입금' },
  { id: 'tx-2026-08-15', date: '2026-08-15', type: '입금', member: '셋째', category: '정기적립', amount: 200000, note: '8월 회비 입금' },
  { id: 'tx-2026-07-20', date: '2026-07-20', type: '지출', member: '첫째', category: '병원/건강', amount: 550000, note: '아버님 치과 임플란트 치료 보조금' },
  { id: 'tx-2026-07-05', date: '2026-07-05', type: '입금', member: '첫째', category: '정기적립', amount: 200000, note: '7월 회비 입금' },
  { id: 'tx-2026-07-10', date: '2026-07-10', type: '입금', member: '둘째', category: '정기적립', amount: 200000, note: '7월 회비 입금' },
  { id: 'tx-2026-07-15', date: '2026-07-15', type: '입금', member: '셋째', category: '정기적립', amount: 200000, note: '7월 회비 입금' },
  { id: 'tx-2026-06-05', date: '2026-06-05', type: '입금', member: '첫째', category: '정기적립', amount: 200000, note: '6월 회비 입금' },
  { id: 'tx-2026-06-10', date: '2026-06-10', type: '입금', member: '둘째', category: '정기적립', amount: 200000, note: '6월 회비 입금' },
  { id: 'tx-2026-06-15', date: '2026-06-15', type: '입금', member: '셋째', category: '정기적립', amount: 200000, note: '6월 회비 입금' },
  { id: 'tx-2026-05-08', date: '2026-05-08', type: '지출', member: '공동', category: '부모님용돈', amount: 600000, note: '어버이날 부모님 감사 용돈 전달 (각 30만원)' },
  { id: 'tx-2026-05-08', date: '2026-05-08', type: '지출', member: '셋째', category: '가족식사/여행', amount: 280000, note: '어버이날 기념 한정식 코스 식사' },
  { id: 'tx-2026-05-05', date: '2026-05-05', type: '입금', member: '첫째', category: '정기적립', amount: 200000, note: '5월 회비 입금' },
  { id: 'tx-2026-05-10', date: '2026-05-10', type: '입금', member: '둘째', category: '정기적립', amount: 200000, note: '5월 회비 입금' },
  { id: 'tx-2026-05-15', date: '2026-05-15', type: '입금', member: '셋째', category: '정기적립', amount: 200000, note: '5월 회비 입금' },
  { id: 'tx-2026-04-18', date: '2026-04-18', type: '지출', member: '둘째', category: '병원/건강', amount: 260000, note: '어머님 무릎 관절 주사 및 맞춤 영양제' },
  { id: 'tx-2026-04-05', date: '2026-04-05', type: '입금', member: '첫째', category: '정기적립', amount: 200000, note: '4월 회비 입금' },
  { id: 'tx-2026-04-10', date: '2026-04-10', type: '입금', member: '둘째', category: '정기적립', amount: 200000, note: '4월 회비 입금' },
  { id: 'tx-2026-04-15', date: '2026-04-15', type: '입금', member: '셋째', category: '정기적립', amount: 200000, note: '4월 회비 입금' },
  { id: 'tx-2026-03-05', date: '2026-03-05', type: '입금', member: '첫째', category: '정기적립', amount: 200000, note: '3월 회비 입금' },
  { id: 'tx-2026-03-10', date: '2026-03-10', type: '입금', member: '둘째', category: '정기적립', amount: 200000, note: '3월 회비 입금' },
  { id: 'tx-2026-03-15', date: '2026-03-15', type: '입금', member: '셋째', category: '정기적립', amount: 200000, note: '3월 회비 입금' },
  { id: 'tx-2026-02-14', date: '2026-02-14', type: '지출', member: '공동', category: '부모님용돈', amount: 600000, note: '설 명절 부모님 세뱃돈 및 귀성 지원금' },
  { id: 'tx-2026-02-05', date: '2026-02-05', type: '입금', member: '첫째', category: '정기적립', amount: 200000, note: '2월 회비 입금' },
  { id: 'tx-2026-02-10', date: '2026-02-10', type: '입금', member: '둘째', category: '정기적립', amount: 200000, note: '2월 회비 입금' },
  { id: 'tx-2026-02-15', date: '2026-02-15', type: '입금', member: '셋째', category: '정기적립', amount: 200000, note: '2월 회비 입금' },
  { id: 'tx-2026-01-10', date: '2026-01-10', type: '지출', member: '첫째', category: '병원/건강', amount: 240000, note: '신년 정관장 홍삼 및 겨울 보양 세트' },
  { id: 'tx-2026-01-05', date: '2026-01-05', type: '입금', member: '첫째', category: '정기적립', amount: 200000, note: '1월 회비 입금' },
  { id: 'tx-2026-01-10', date: '2026-01-10', type: '입금', member: '둘째', category: '정기적립', amount: 200000, note: '1월 회비 입금' },
  { id: 'tx-2026-01-15', date: '2026-01-15', type: '입금', member: '셋째', category: '정기적립', amount: 200000, note: '1월 회비 입금' },

  // 2025 transactions (Starting Jan 2025)
  { id: 'tx-2025-12-24', date: '2025-12-24', type: '지출', member: '셋째', category: '생신/기념일', amount: 480000, note: '연말 크리스마스 부모님 방한 거위털 패딩 선물' },
  { id: 'tx-2025-12-05', date: '2025-12-05', type: '입금', member: '첫째', category: '정기적립', amount: 200000, note: '12월 회비 입금' },
  { id: 'tx-2025-12-10', date: '2025-12-10', type: '입금', member: '둘째', category: '정기적립', amount: 200000, note: '12월 회비 입금' },
  { id: 'tx-2025-12-15', date: '2025-12-15', type: '입금', member: '셋째', category: '정기적립', amount: 200000, note: '12월 회비 입금' },
  { id: 'tx-2025-11-05', date: '2025-11-05', type: '입금', member: '첫째', category: '정기적립', amount: 200000, note: '11월 회비 입금' },
  { id: 'tx-2025-11-10', date: '2025-11-10', type: '입금', member: '둘째', category: '정기적립', amount: 200000, note: '11월 회비 입금' },
  { id: 'tx-2025-11-15', date: '2025-11-15', type: '입금', member: '셋째', category: '정기적립', amount: 200000, note: '11월 회비 입금' },
  { id: 'tx-2025-10-18', date: '2025-10-18', type: '지출', member: '둘째', category: '생신/기념일', amount: 720000, note: '어머니 칠순 기념 가족 1박 2일 온천 펜션 및 케이크' },
  { id: 'tx-2025-10-05', date: '2025-10-05', type: '입금', member: '첫째', category: '정기적립', amount: 200000, note: '10월 회비 입금' },
  { id: 'tx-2025-10-10', date: '2025-10-10', type: '입금', member: '둘째', category: '정기적립', amount: 200000, note: '10월 회비 입금' },
  { id: 'tx-2025-10-15', date: '2025-10-15', type: '입금', member: '셋째', category: '정기적립', amount: 200000, note: '10월 회비 입금' },
  { id: 'tx-2025-09-25', date: '2025-09-25', type: '지출', member: '공동', category: '부모님용돈', amount: 600000, note: '추석 명절 부모님 용돈' },
  { id: 'tx-2025-09-05', date: '2025-09-05', type: '입금', member: '첫째', category: '정기적립', amount: 200000, note: '9월 회비 입금' },
  { id: 'tx-2025-09-10', date: '2025-09-10', type: '입금', member: '둘째', category: '정기적립', amount: 200000, note: '9월 회비 입금' },
  { id: 'tx-2025-09-15', date: '2025-09-15', type: '입금', member: '셋째', category: '정기적립', amount: 200000, note: '9월 회비 입금' },
  { id: 'tx-2025-08-05', date: '2025-08-05', type: '입금', member: '첫째', category: '정기적립', amount: 200000, note: '8월 회비 입금' },
  { id: 'tx-2025-08-10', date: '2025-08-10', type: '입금', member: '둘째', category: '정기적립', amount: 200000, note: '8월 회비 입금' },
  { id: 'tx-2025-08-15', date: '2025-08-15', type: '입금', member: '셋째', category: '정기적립', amount: 200000, note: '8월 회비 입금' },
  { id: 'tx-2025-07-22', date: '2025-07-22', type: '지출', member: '첫째', category: '병원/건강', amount: 800000, note: '부모님 위·대장 내시경 종합건강검진 예약비' },
  { id: 'tx-2025-07-05', date: '2025-07-05', type: '입금', member: '첫째', category: '정기적립', amount: 200000, note: '7월 회비 입금' },
  { id: 'tx-2025-07-10', date: '2025-07-10', type: '입금', member: '둘째', category: '정기적립', amount: 200000, note: '7월 회비 입금' },
  { id: 'tx-2025-07-15', date: '2025-07-15', type: '입금', member: '셋째', category: '정기적립', amount: 200000, note: '7월 회비 입금' },
  { id: 'tx-2025-06-05', date: '2025-06-05', type: '입금', member: '첫째', category: '정기적립', amount: 200000, note: '6월 회비 입금' },
  { id: 'tx-2025-06-10', date: '2025-06-10', type: '입금', member: '둘째', category: '정기적립', amount: 200000, note: '6월 회비 입금' },
  { id: 'tx-2025-06-15', date: '2025-06-15', type: '입금', member: '셋째', category: '정기적립', amount: 200000, note: '6월 회비 입금' },
  { id: 'tx-2025-05-08', date: '2025-05-08', type: '지출', member: '공동', category: '부모님용돈', amount: 600000, note: '어버이날 감사 용돈' },
  { id: 'tx-2025-05-08', date: '2025-05-08', type: '지출', member: '첫째', category: '가족식사/여행', amount: 320000, note: '어버이날 온가족 외식 (한우 구이)' },
  { id: 'tx-2025-05-05', date: '2025-05-05', type: '입금', member: '첫째', category: '정기적립', amount: 200000, note: '5월 회비 입금' },
  { id: 'tx-2025-05-10', date: '2025-05-10', type: '입금', member: '둘째', category: '정기적립', amount: 200000, note: '5월 회비 입금' },
  { id: 'tx-2025-05-15', date: '2025-05-15', type: '입금', member: '셋째', category: '정기적립', amount: 200000, note: '5월 회비 입금' },
  { id: 'tx-2025-04-05', date: '2025-04-05', type: '입금', member: '첫째', category: '정기적립', amount: 200000, note: '4월 회비 입금' },
  { id: 'tx-2025-04-10', date: '2025-04-10', type: '입금', member: '둘째', category: '정기적립', amount: 200000, note: '4월 회비 입금' },
  { id: 'tx-2025-04-15', date: '2025-04-15', type: '입금', member: '셋째', category: '정기적립', amount: 200000, note: '4월 회비 입금' },
  { id: 'tx-2025-03-05', date: '2025-03-05', type: '입금', member: '첫째', category: '정기적립', amount: 200000, note: '3월 회비 입금' },
  { id: 'tx-2025-03-10', date: '2025-03-10', type: '입금', member: '둘째', category: '정기적립', amount: 200000, note: '3월 회비 입금' },
  { id: 'tx-2025-03-15', date: '2025-03-15', type: '입금', member: '셋째', category: '정기적립', amount: 200000, note: '3월 회비 입금' },
  { id: 'tx-2025-02-10', date: '2025-02-10', type: '지출', member: '공동', category: '부모님용돈', amount: 600000, note: '2025 설 명절 부모님 용돈' },
  { id: 'tx-2025-02-05', date: '2025-02-05', type: '입금', member: '첫째', category: '정기적립', amount: 200000, note: '2월 회비 입금' },
  { id: 'tx-2025-02-10', date: '2025-02-10', type: '입금', member: '둘째', category: '정기적립', amount: 200000, note: '2월 회비 입금' },
  { id: 'tx-2025-02-15', date: '2025-02-15', type: '입금', member: '셋째', category: '정기적립', amount: 200000, note: '2월 회비 입금' },
  { id: 'tx-2025-01-05', date: '2025-01-05', type: '입금', member: '첫째', category: '정기적립', amount: 200000, note: '효도통장 개설! 1월 회비' },
  { id: 'tx-2025-01-10', date: '2025-01-10', type: '입금', member: '둘째', category: '정기적립', amount: 200000, note: '효도통장 개설! 1월 회비' },
  { id: 'tx-2025-01-15', date: '2025-01-15', type: '입금', member: '셋째', category: '정기적립', amount: 200000, note: '효도통장 개설! 1월 회비' },
];

/**
 * Identify brother key from name or role
 */
export function identifyBrotherKey(member: string): 'brother1' | 'brother2' | 'brother3' | null {
  const clean = member.trim().toLowerCase();
  if (clean.includes('첫째') || clean.includes('1째') || clean.includes('민호') || clean.includes('장남')) return 'brother1';
  if (clean.includes('둘째') || clean.includes('2째') || clean.includes('준호') || clean.includes('차남')) return 'brother2';
  if (clean.includes('셋째') || clean.includes('3째') || clean.includes('진호') || clean.includes('막내')) return 'brother3';
  return null;
}

/**
 * Computes overall fund summary statistics
 */
export function computeFundSummary(
  transactions: Transaction[],
  currentDate = '2026-09-25'
): FundSummary {
  let totalDeposit = 0;
  let totalExpense = 0;
  let currentMonthDeposit = 0;
  let currentMonthExpense = 0;

  const currentMonthKey = currentDate.slice(0, 7); // '2026-09'

  transactions.forEach((tx) => {
    if (tx.type === '입금') {
      totalDeposit += tx.amount;
      if (tx.date.startsWith(currentMonthKey)) {
        currentMonthDeposit += tx.amount;
      }
    } else {
      totalExpense += tx.amount;
      if (tx.date.startsWith(currentMonthKey)) {
        currentMonthExpense += tx.amount;
      }
    }
  });

  const currentBalance = totalDeposit - totalExpense;

  // Calculate elapsed months from 2025-01 to current date
  const startYear = 2025;
  const startMonth = 1;
  const endYear = parseInt(currentDate.slice(0, 4), 10) || 2026;
  const endMonth = parseInt(currentDate.slice(5, 7), 10) || 9;
  const totalMonths = (endYear - startYear) * 12 + (endMonth - startMonth + 1);

  const targetDeposit = totalMonths * 600000;
  const depositRate = targetDeposit > 0 ? Math.min(100, Math.round((totalDeposit / targetDeposit) * 100)) : 100;

  return {
    currentBalance,
    totalDeposit,
    totalExpense,
    monthlyTarget: 600000,
    currentMonthDeposit,
    currentMonthExpense,
    startDate: '2025-01-01',
    totalMonths: Math.max(1, totalMonths),
    depositRate,
  };
}

/**
 * Computes payment status for each of the 3 brothers
 */
export function computeBrotherStatuses(
  transactions: Transaction[],
  customNames: { b1: string; b2: string; b3: string },
  currentDate = '2026-09-25'
): BrotherStatus[] {
  const currentMonthKey = currentDate.slice(0, 7);

  // Month range from 2025-01 to current
  const startYear = 2025;
  const endYear = parseInt(currentDate.slice(0, 4), 10) || 2026;
  const endMonth = parseInt(currentDate.slice(5, 7), 10) || 9;
  const totalMonths = (endYear - startYear) * 12 + endMonth;
  const expectedPerPerson = totalMonths * 200000;

  const b1: BrotherStatus = {
    key: 'brother1',
    defaultRole: '첫째',
    displayName: customNames.b1 || '첫째 (민호)',
    totalContributed: 0,
    expectedContribution: expectedPerPerson,
    isCurrentMonthPaid: false,
    streakMonths: 0,
    history: {},
  };

  const b2: BrotherStatus = {
    key: 'brother2',
    defaultRole: '둘째',
    displayName: customNames.b2 || '둘째 (준호)',
    totalContributed: 0,
    expectedContribution: expectedPerPerson,
    isCurrentMonthPaid: false,
    streakMonths: 0,
    history: {},
  };

  const b3: BrotherStatus = {
    key: 'brother3',
    defaultRole: '셋째',
    displayName: customNames.b3 || '셋째 (진호)',
    totalContributed: 0,
    expectedContribution: expectedPerPerson,
    isCurrentMonthPaid: false,
    streakMonths: 0,
    history: {},
  };

  const map = { brother1: b1, brother2: b2, brother3: b3 };

  // Track monthly amounts per brother
  const monthlyAmounts: Record<string, Record<'brother1' | 'brother2' | 'brother3', number>> = {};

  transactions.forEach((tx) => {
    if (tx.type !== '입금') return;
    const key = identifyBrotherKey(tx.member);
    if (!key) return;

    map[key].totalContributed += tx.amount;

    const mKey = tx.date.slice(0, 7);
    if (!monthlyAmounts[mKey]) {
      monthlyAmounts[mKey] = { brother1: 0, brother2: 0, brother3: 0 };
    }
    monthlyAmounts[mKey][key] += tx.amount;
  });

  // Populate history and check current month
  Object.keys(monthlyAmounts).forEach((mKey) => {
    b1.history[mKey] = monthlyAmounts[mKey].brother1 >= 200000;
    b2.history[mKey] = monthlyAmounts[mKey].brother2 >= 200000;
    b3.history[mKey] = monthlyAmounts[mKey].brother3 >= 200000;
  });

  b1.isCurrentMonthPaid = !!b1.history[currentMonthKey];
  b2.isCurrentMonthPaid = !!b2.history[currentMonthKey];
  b3.isCurrentMonthPaid = !!b3.history[currentMonthKey];

  return [b1, b2, b3];
}

/**
 * Computes monthly aggregated deposit, expense, and cumulative balance
 */
export function computeMonthlyAggregations(transactions: Transaction[]): MonthlyAggregation[] {
  // Aggregate by month key
  const monthlyData: Record<string, { deposit: number; expense: number; b1: boolean; b2: boolean; b3: boolean }> = {};

  transactions.forEach((tx) => {
    const mKey = tx.date.slice(0, 7);
    if (!monthlyData[mKey]) {
      monthlyData[mKey] = { deposit: 0, expense: 0, b1: false, b2: false, b3: false };
    }
    if (tx.type === '입금') {
      monthlyData[mKey].deposit += tx.amount;
      const bKey = identifyBrotherKey(tx.member);
      if (bKey === 'brother1') monthlyData[mKey].b1 = true;
      if (bKey === 'brother2') monthlyData[mKey].b2 = true;
      if (bKey === 'brother3') monthlyData[mKey].b3 = true;
    } else {
      monthlyData[mKey].expense += tx.amount;
    }
  });

  // Sort chronological
  const sortedKeys = Object.keys(monthlyData).sort();
  let runningBalance = 0;

  return sortedKeys.map((mKey) => {
    const data = monthlyData[mKey];
    const net = data.deposit - data.expense;
    runningBalance += net;

    const [year, month] = mKey.split('-');
    const label = `${year.slice(2)}년 ${parseInt(month, 10)}월`;

    return {
      monthKey: mKey,
      label,
      deposit: data.deposit,
      expense: data.expense,
      net,
      balance: runningBalance,
      brother1Paid: data.b1,
      brother2Paid: data.b2,
      brother3Paid: data.b3,
    };
  });
}

/**
 * Computes breakdown of expenditures by category
 */
export function computeCategoryExpenses(transactions: Transaction[]): CategoryExpense[] {
  const catMap: Record<string, { amount: number; count: number }> = {};
  let totalExpense = 0;

  transactions.forEach((tx) => {
    if (tx.type !== '지출') return;
    const cat = tx.category.trim() || '기타';
    if (!catMap[cat]) {
      catMap[cat] = { amount: 0, count: 0 };
    }
    catMap[cat].amount += tx.amount;
    catMap[cat].count += 1;
    totalExpense += tx.amount;
  });

  if (totalExpense === 0) return [];

  return Object.keys(catMap)
    .map((cat) => ({
      category: cat,
      amount: catMap[cat].amount,
      count: catMap[cat].count,
      percentage: Math.round((catMap[cat].amount / totalExpense) * 100),
    }))
    .sort((a, b) => b.amount - a.amount);
}
