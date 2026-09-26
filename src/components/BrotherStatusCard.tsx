import React, { useState } from 'react';
import { BrotherStatus, MonthlyAggregation } from '../types/fund';
import { Check, Clock, Sparkles, CalendarDays } from 'lucide-react';

interface BrotherStatusCardProps {
  brothers: BrotherStatus[];
  monthlyData?: MonthlyAggregation[];
  mode?: 'cards' | 'matrix' | 'both';
}

export const BrotherStatusCard: React.FC<BrotherStatusCardProps> = ({
  brothers,
  monthlyData = [],
  mode = 'cards',
}) => {
  const [showFullHistory, setShowFullHistory] = useState(false);

  const formatWon = (val: number) => {
    return new Intl.NumberFormat('ko-KR').format(val) + '원';
  };

  const displayedHistory = showFullHistory
    ? [...monthlyData].reverse()
    : [...monthlyData].reverse().slice(0, 8);

  const showCards = mode === 'cards' || mode === 'both';
  const showMatrix = mode === 'matrix' || mode === 'both';

  return (
    <div className="space-y-4">
      {/* 1. Simple Brother Status Cards (Home Screen) */}
      {showCards && (
        <div className="bg-white rounded-3xl border border-neutral-200/80 p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm sm:text-base font-bold text-neutral-900 tracking-tight">
              삼형제 회비 납입 현황
            </h3>
            <span className="text-xs text-neutral-400">
              각 월 20만원
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {brothers.map((b, idx) => {
              const fixedName = idx === 0 ? '첫째' : idx === 1 ? '둘째' : '셋째';

              return (
                <div
                  key={b.key}
                  className="bg-neutral-50/70 rounded-2xl p-4 sm:p-5 flex flex-col justify-between gap-3 border border-neutral-100"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-neutral-900">
                      {fixedName}
                    </span>
                    {b.isCurrentMonthPaid ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100/70 px-2.5 py-0.5 rounded-full">
                        <Check className="w-3 h-3 stroke-[2.5px]" />
                        <span>이달 완납</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-100/70 px-2.5 py-0.5 rounded-full">
                        <Clock className="w-3 h-3" />
                        <span>입금 예정</span>
                      </span>
                    )}
                  </div>

                  <div>
                    <div className="text-[11px] text-neutral-400 mb-0.5">
                      누적 적립액
                    </div>
                    <div className="text-xl sm:text-2xl font-extrabold text-neutral-900 font-mono tabular-nums">
                      {formatWon(b.totalContributed)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Monthly Timeline Matrix Grid (삼형제 Tab only) */}
      {showMatrix && (
        <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-xs overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-neutral-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-9 h-9 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-800">
                <CalendarDays className="w-4 h-4" />
              </span>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-neutral-900 tracking-tight">
                  월별 회비 납입 현황표
                </h2>
                <p className="text-xs text-neutral-400 mt-0.5">
                  2025년 1월부터 삼형제(첫째 · 둘째 · 셋째)의 매월 20만원 납입 기록
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-neutral-500">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                완납
              </span>
              <span className="flex items-center gap-1.5 text-neutral-400">
                <span className="w-2.5 h-2.5 rounded-full bg-neutral-300 inline-block"></span>
                미납
              </span>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            <div className="overflow-x-auto -mx-5 sm:mx-0 px-5 sm:px-0 scrollbar-none">
              <table className="w-full text-left text-xs border-collapse min-w-[360px]">
                <thead>
                  <tr className="border-b border-neutral-200/80 text-neutral-400 font-medium text-[11px]">
                    <th className="py-3 pr-3 whitespace-nowrap">납입 월차</th>
                    <th className="py-3 px-3 text-center whitespace-nowrap">첫째 (20만)</th>
                    <th className="py-3 px-3 text-center whitespace-nowrap">둘째 (20만)</th>
                    <th className="py-3 px-3 text-center whitespace-nowrap">셋째 (20만)</th>
                    <th className="py-3 pl-3 text-right whitespace-nowrap">이달 적립액</th>
                    <th className="py-3 pl-3 text-right whitespace-nowrap">누적 통장잔액</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-neutral-800">
                  {displayedHistory.map((m) => {
                    const allPaid = m.brother1Paid && m.brother2Paid && m.brother3Paid;
                    return (
                      <tr key={m.monthKey} className="hover:bg-neutral-50/80 transition-colors">
                        <td className="py-3.5 pr-3 font-semibold whitespace-nowrap text-xs flex items-center gap-1.5 text-neutral-900">
                          <span>{m.label}</span>
                          {allPaid && <Sparkles className="w-3.5 h-3.5 text-amber-500 inline shrink-0" />}
                        </td>

                        <td className="py-3.5 px-3 text-center">
                          {m.brother1Paid ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
                              ✓
                            </span>
                          ) : (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-neutral-100 text-neutral-400 text-xs">
                              -
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-3 text-center">
                          {m.brother2Paid ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
                              ✓
                            </span>
                          ) : (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-neutral-100 text-neutral-400 text-xs">
                              -
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-3 text-center">
                          {m.brother3Paid ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
                              ✓
                            </span>
                          ) : (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-neutral-100 text-neutral-400 text-xs">
                              -
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 pl-3 text-right font-mono tabular-nums text-neutral-900 font-semibold">
                          +{formatWon(m.deposit)}
                        </td>

                        <td className="py-3.5 pl-3 text-right font-mono tabular-nums font-extrabold text-neutral-900">
                          {formatWon(m.balance)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {monthlyData.length > 8 && (
              <div className="mt-4 pt-2 text-center">
                <button
                  onClick={() => setShowFullHistory(!showFullHistory)}
                  className="text-xs text-neutral-700 hover:text-neutral-900 font-medium py-2 px-4 bg-white border border-neutral-200/80 rounded-xl transition-all shadow-2xs hover:shadow-xs"
                >
                  {showFullHistory ? '최근 8개월만 보기' : `전체 ${monthlyData.length}개월 전체 보기`}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
