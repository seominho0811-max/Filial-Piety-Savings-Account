import React from 'react';
import { FundSummary } from '../types/fund';
import { CheckCircle2 } from 'lucide-react';

interface SummaryCardsProps {
  summary: FundSummary;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ summary }) => {
  const formatWon = (val: number) => {
    return new Intl.NumberFormat('ko-KR').format(val) + '원';
  };

  const isMonthGoalMet = summary.currentMonthDeposit >= summary.monthlyTarget;

  return (
    <div className="bg-white rounded-3xl border border-neutral-200/80 p-6 sm:p-7 shadow-xs space-y-6">
      {/* 1. Master Balance Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-semibold text-neutral-400">현재 통장 잔액</span>
            {isMonthGoalMet && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="w-3 h-3" />
                <span>이달 60만원 완납 완료</span>
              </span>
            )}
          </div>
          <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-900 font-mono tabular-nums">
            {formatWon(summary.currentBalance)}
          </div>
        </div>

        <div className="text-xs text-neutral-400 font-mono tabular-nums">
          매월 60만원 적립 (2025.01 개설)
        </div>
      </div>

      {/* 2. Simple 2-Stat Summary: 총 누적 적립액 & 부모님 효도 지출 */}
      <div className="grid grid-cols-2 gap-3 pt-5 border-t border-neutral-100">
        {/* 총 누적 적립액 */}
        <div className="bg-neutral-50/70 rounded-2xl p-4 sm:p-4.5">
          <div className="text-xs font-medium text-neutral-400 mb-1">
            총 누적 적립액
          </div>
          <div className="text-xl sm:text-2xl font-bold text-neutral-900 font-mono tabular-nums">
            {formatWon(summary.totalDeposit)}
          </div>
        </div>

        {/* 부모님 효도 지출 */}
        <div className="bg-neutral-50/70 rounded-2xl p-4 sm:p-4.5">
          <div className="text-xs font-medium text-neutral-400 mb-1">
            부모님 효도 지출
          </div>
          <div className="text-xl sm:text-2xl font-bold text-rose-600 font-mono tabular-nums">
            {formatWon(summary.totalExpense)}
          </div>
        </div>
      </div>
    </div>
  );
};
