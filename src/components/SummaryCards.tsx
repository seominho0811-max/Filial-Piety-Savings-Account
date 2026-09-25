import React from 'react';
import { FundSummary } from '../types/fund';
import { TrendingUp, HeartHandshake, CheckCircle2, ArrowDownRight } from 'lucide-react';

interface SummaryCardsProps {
  summary: FundSummary;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ summary }) => {
  const formatWon = (val: number) => {
    return new Intl.NumberFormat('ko-KR').format(val) + '원';
  };

  const currentMonthPct = Math.min(100, Math.round((summary.currentMonthDeposit / summary.monthlyTarget) * 100));

  return (
    <div className="space-y-3">
      {/* 1. Master Account Hero Card (Toss/Apple Card Inspired) */}
      <div className="bg-white rounded-3xl border border-neutral-200/80 p-5 sm:p-7 shadow-xs relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          {/* Left: Balance & Status */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-neutral-500">현재 통장 잔액</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="w-3 h-3" />
                <span>정상 적립 중</span>
              </span>
            </div>

            <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-900 font-mono tabular-nums">
              {formatWon(summary.currentBalance)}
            </div>

            <div className="flex items-center gap-2 text-xs text-neutral-500 pt-1">
              <span>누적 순적립금</span>
              <span className="text-neutral-900 font-semibold font-mono tabular-nums">
                +{formatWon(summary.totalDeposit - summary.totalExpense)}
              </span>
              <span className="text-neutral-300">|</span>
              <span>2025.01 개설</span>
            </div>
          </div>

          {/* Right: This Month's 600,000 KRW Goal Progress */}
          <div className="w-full md:w-80 bg-neutral-50/80 rounded-2xl p-4 border border-neutral-150/70 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-neutral-700">이번 달 적립 현황</span>
              <span className="font-bold text-neutral-900 font-mono tabular-nums">
                {currentMonthPct}% 달성
              </span>
            </div>

            {/* Sleek track */}
            <div className="w-full bg-neutral-200/80 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full transition-all duration-700 ease-out ${
                  currentMonthPct >= 100 ? 'bg-neutral-900' : 'bg-amber-500'
                }`}
                style={{ width: `${currentMonthPct}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-neutral-500">
              <span className="font-mono tabular-nums">
                {formatWon(summary.currentMonthDeposit)} / 600,000원
              </span>
              <span className="text-neutral-700 font-medium">
                {currentMonthPct >= 100 ? '이달 전원 완납 완료 🎉' : '입금 진행 중'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Sub Metric Tiles (3-Column Minimal Grid) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {/* Tile 1: 총 누적 적립 */}
        <div className="bg-white rounded-2xl border border-neutral-200/80 p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-medium text-neutral-500">총 누적 적립액</span>
            <TrendingUp className="w-4 h-4 text-neutral-400" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 font-mono tabular-nums">
              {formatWon(summary.totalDeposit)}
            </div>
            <div className="text-[11px] text-neutral-400 font-mono tabular-nums mt-1">
              총 {summary.totalMonths}개월 누적
            </div>
          </div>
        </div>

        {/* Tile 2: 부모님 효도 지출 */}
        <div className="bg-white rounded-2xl border border-neutral-200/80 p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-medium text-neutral-500">부모님 효도 지출</span>
            <HeartHandshake className="w-4 h-4 text-rose-500" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 font-mono tabular-nums">
              {formatWon(summary.totalExpense)}
            </div>
            <div className="text-[11px] text-rose-600 font-medium mt-1">
              용돈 · 건강검진 · 가족여행
            </div>
          </div>
        </div>

        {/* Tile 3: 약속 이행률 */}
        <div className="col-span-2 sm:col-span-1 bg-white rounded-2xl border border-neutral-200/80 p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-medium text-neutral-500">회비 약속 이행률</span>
            <span className="text-xs font-bold text-neutral-900 font-mono tabular-nums">
              {summary.depositRate}%
            </span>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 font-mono tabular-nums">
              연속 완납
            </div>
            <div className="text-[11px] text-neutral-400 mt-1">
              매달 20만원 약속 준수
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
