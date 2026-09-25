import React, { useState } from 'react';
import { MonthlyAggregation, CategoryExpense } from '../types/fund';
import { BarChart3, PieChart } from 'lucide-react';

interface MonthlyChartProps {
  monthlyData: MonthlyAggregation[];
  categoryExpenses: CategoryExpense[];
}

export const MonthlyChart: React.FC<MonthlyChartProps> = ({
  monthlyData,
  categoryExpenses,
}) => {
  const [selectedMonth, setSelectedMonth] = useState<MonthlyAggregation | null>(null);

  const formatWon = (val: number) => {
    return new Intl.NumberFormat('ko-KR').format(val) + '원';
  };

  const maxBarValue = Math.max(
    ...monthlyData.map((d) => Math.max(d.deposit, d.expense)),
    1000000
  );

  const recentMonths = monthlyData.slice(-10);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* 1. Monthly Trends Chart (2 cols) */}
      <div className="lg:col-span-2 bg-white rounded-3xl border border-neutral-200/80 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
            <div>
              <h3 className="text-base font-bold text-neutral-900 tracking-tight flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-neutral-400" />
                <span>월별 적립 및 지출 추이</span>
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                매월 회비(60만원) 적립과 부모님을 위한 효도 지출
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs text-neutral-500 self-start sm:self-auto">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-neutral-900 inline-block"></span>
                회비 적립
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
                효도 지출
              </span>
            </div>
          </div>

          {/* Interactive Inspection Pill */}
          <div className="min-h-[36px] mb-4 flex items-center justify-between text-xs bg-neutral-50/80 px-4 py-2 rounded-2xl border border-neutral-100">
            {selectedMonth ? (
              <>
                <span className="font-bold text-neutral-900">{selectedMonth.label}</span>
                <div className="flex items-center gap-3 font-mono tabular-nums">
                  <span className="text-neutral-900 font-semibold">+{formatWon(selectedMonth.deposit)}</span>
                  <span className="text-rose-600 font-semibold">-{formatWon(selectedMonth.expense)}</span>
                  <span className="font-extrabold text-neutral-900">잔액 {formatWon(selectedMonth.balance)}</span>
                </div>
              </>
            ) : (
              <span className="text-neutral-400">
                각 월 막대를 누르거나 마우스를 올리면 상세 내역이 표시됩니다.
              </span>
            )}
          </div>

          {/* Bar chart container */}
          <div className="pt-2 pb-1">
            <div className="h-44 sm:h-52 flex items-end justify-between gap-2 sm:gap-3 border-b border-neutral-100 pb-1">
              {recentMonths.map((m) => {
                const depositH = (m.deposit / maxBarValue) * 100;
                const expenseH = (m.expense / maxBarValue) * 100;
                const isSelected = selectedMonth?.monthKey === m.monthKey;

                return (
                  <div
                    key={m.monthKey}
                    className={`flex-1 flex flex-col items-center h-full justify-end group cursor-pointer transition-transform ${
                      isSelected ? 'scale-105' : ''
                    }`}
                    onClick={() => setSelectedMonth(m)}
                    onMouseEnter={() => setSelectedMonth(m)}
                  >
                    <div className="w-full flex items-end justify-center gap-1 sm:gap-1.5 h-full pb-1">
                      {/* Deposit Bar */}
                      <div
                        className={`w-1/2 max-w-[14px] bg-neutral-900 rounded-t-md transition-all duration-200 ${
                          isSelected ? 'bg-neutral-950' : 'group-hover:bg-neutral-800'
                        }`}
                        style={{ height: `${depositH}%` }}
                      />
                      {/* Expense Bar */}
                      <div
                        className={`w-1/2 max-w-[14px] bg-rose-500 rounded-t-md transition-all duration-200 ${
                          isSelected ? 'bg-rose-600' : 'group-hover:bg-rose-600'
                        }`}
                        style={{ height: `${Math.max(expenseH, 2)}%` }}
                      />
                    </div>

                    {/* Month Label */}
                    <span
                      className={`text-[10px] font-mono tabular-nums whitespace-nowrap mt-1.5 ${
                        isSelected ? 'font-bold text-neutral-900' : 'text-neutral-400'
                      }`}
                    >
                      {m.monthKey.slice(5)}월
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between items-center text-[11px] text-neutral-400 mt-3">
              <span>2025.01 시작</span>
              <span>최대 {formatWon(maxBarValue)} 기준</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Category Expense Breakdown */}
      <div className="bg-white rounded-3xl border border-neutral-200/80 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-neutral-900 tracking-tight flex items-center gap-2">
              <PieChart className="w-4 h-4 text-neutral-400" />
              <span>지출 항목 분석</span>
            </h3>
            <span className="text-xs text-neutral-400">누적</span>
          </div>

          {categoryExpenses.length === 0 ? (
            <div className="py-12 text-center text-xs text-neutral-400">
              아직 지출 내역이 없습니다.
            </div>
          ) : (
            <div className="space-y-3.5">
              {categoryExpenses.map((cat, idx) => {
                const colors = [
                  'bg-neutral-900',
                  'bg-rose-500',
                  'bg-amber-500',
                  'bg-blue-600',
                  'bg-emerald-600',
                  'bg-neutral-400',
                ];
                const color = colors[idx % colors.length];

                return (
                  <div key={cat.category} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-neutral-800 flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${color}`}></span>
                        <span>{cat.category}</span>
                        <span className="text-neutral-400 text-[11px] font-normal">({cat.count}건)</span>
                      </span>
                      <span className="font-mono tabular-nums font-bold text-neutral-900">
                        {formatWon(cat.amount)}
                      </span>
                    </div>

                    <div className="w-full bg-neutral-100 rounded-full h-1.5 overflow-hidden">
                      <div className={`h-full ${color}`} style={{ width: `${cat.percentage}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-5 pt-3.5 border-t border-neutral-100 text-xs text-neutral-400">
          부모님 명절 용돈, 건강검진, 가족 여행이 주요 효도 항목입니다.
        </div>
      </div>
    </div>
  );
};
