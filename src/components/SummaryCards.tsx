import React from 'react';
import { FundSummary } from '../types/fund';
import { CheckCircle2, TrendingUp, HeartHandshake } from 'lucide-react';

interface SummaryCardsProps {
  summary: FundSummary;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ summary }) => {
  const isMonthGoalMet = summary.currentMonthDeposit >= summary.monthlyTarget;

  return (
    <div className="bg-white rounded-3xl border border-neutral-200/80 p-5 sm:p-7 py-6 sm:py-8 shadow-xs space-y-5 sm:space-y-6">
      {/* 1. Master Balance Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs sm:text-sm font-semibold text-neutral-500">현재 통장 잔액</span>
            {isMonthGoalMet && (
              <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 rounded-full whitespace-nowrap">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>이달 완납</span>
              </span>
            )}
          </div>
          <div className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-neutral-950 font-mono tabular-nums whitespace-nowrap flex items-baseline leading-none py-1">
            <span>{new Intl.NumberFormat('ko-KR').format(summary.currentBalance)}</span>
            <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold ml-1.5 text-neutral-800">원</span>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 text-[11px] sm:text-xs text-neutral-400 font-medium py-1 px-2.5 bg-neutral-50 rounded-xl border border-neutral-100 self-start sm:self-end shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
          <span>매월 60만원 적립 (2025.01~)</span>
        </div>
      </div>

      {/* 2. Simple 2-Stat Summary: 총 누적 적립액 & 부모님 효도 지출 (No line wraps on any mobile device) */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-4 pt-4 sm:pt-5 border-t border-neutral-100">
        {/* 총 누적 적립액 */}
        <div className="bg-neutral-50/90 hover:bg-neutral-50 border border-neutral-200/60 rounded-2xl p-3.5 sm:p-4.5 py-3.5 sm:py-4 transition-colors">
          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-neutral-500 mb-1 whitespace-nowrap">
            <TrendingUp className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <span>총 누적 적립액</span>
          </div>
          <div className="text-base sm:text-lg md:text-xl font-bold text-neutral-900 font-mono tabular-nums whitespace-nowrap flex items-baseline leading-tight">
            <span>{new Intl.NumberFormat('ko-KR').format(summary.totalDeposit)}</span>
            <span className="text-[11px] sm:text-xs font-normal text-neutral-500 ml-0.5 shrink-0">원</span>
          </div>
        </div>

        {/* 부모님 효도 지출 */}
        <div className="bg-rose-50/40 hover:bg-rose-50/60 border border-rose-100/70 rounded-2xl p-3.5 sm:p-4.5 py-3.5 sm:py-4 transition-colors">
          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-rose-600/90 mb-1 whitespace-nowrap">
            <HeartHandshake className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span>부모님 효도 지출</span>
          </div>
          <div className="text-base sm:text-lg md:text-xl font-bold text-rose-600 font-mono tabular-nums whitespace-nowrap flex items-baseline leading-tight">
            <span>{new Intl.NumberFormat('ko-KR').format(summary.totalExpense)}</span>
            <span className="text-[11px] sm:text-xs font-normal text-rose-500 ml-0.5 shrink-0">원</span>
          </div>
        </div>
      </div>
    </div>
  );
};
