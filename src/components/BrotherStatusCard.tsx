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
      {/* 1. Mobile Optimized Brother Status Cards (Home Screen) */}
      {showCards && (
        <div className="bg-white rounded-3xl border border-neutral-200/80 p-4 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between mb-3.5 sm:mb-4">
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-neutral-900 tracking-tight">
                삼형제 회비 납입 현황
              </h3>
              <span className="text-[10px] sm:text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                매월 10일
              </span>
            </div>
            <span className="text-[11px] sm:text-xs font-mono text-neutral-400">
              각 월 20만원
            </span>
          </div>

          {/* Mobile: 1 row per brother (첫째 한 줄, 둘째 한 줄, 셋째 한 줄) / Desktop: 3-column grid */}
          <div className="space-y-2.5 sm:grid sm:grid-cols-3 sm:gap-3.5 sm:space-y-0">
            {brothers.map((b, idx) => {
              const fixedName = idx === 0 ? '첫째' : idx === 1 ? '둘째' : '셋째';
              const brotherNum = idx + 1;

              return (
                <div
                  key={b.key}
                  className="bg-neutral-50/80 hover:bg-neutral-50 rounded-2xl p-3.5 sm:p-4 flex items-center justify-between sm:flex-col sm:items-stretch sm:justify-between border border-neutral-200/60 transition-colors"
                >
                  {/* Left (Mobile) / Top (Desktop): Number + Name + Status Badge */}
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-xl bg-neutral-900 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                      {brotherNum}
                    </span>
                    <span className="text-sm font-bold text-neutral-900">
                      {fixedName}
                    </span>
                    {b.isCurrentMonthPaid ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full whitespace-nowrap">
                        <Check className="w-3 h-3 stroke-[2.5px]" />
                        <span>이달 완납</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-full whitespace-nowrap">
                        <Clock className="w-3 h-3" />
                        <span>입금 예정</span>
                      </span>
                    )}
                  </div>

                  {/* Right (Mobile) / Bottom (Desktop): 누적 적립액 */}
                  <div className="text-right sm:text-left sm:mt-3 flex flex-col items-end sm:items-start">
                    <span className="text-[10px] sm:text-[11px] text-neutral-400 font-medium mb-0.5 whitespace-nowrap">
                      누적 적립액
                    </span>
                    <div className="text-sm sm:text-base md:text-lg font-bold text-neutral-900 font-mono tabular-nums whitespace-nowrap flex items-baseline leading-tight">
                      <span>{new Intl.NumberFormat('ko-KR').format(b.totalContributed)}</span>
                      <span className="text-[11px] sm:text-xs font-normal text-neutral-500 ml-0.5 shrink-0">원</span>
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
          <div className="p-4 sm:p-6 border-b border-neutral-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-800">
                <CalendarDays className="w-4 h-4" />
              </span>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-neutral-900 tracking-tight">
                  월별 회비 납입 현황표
                </h2>
                <p className="text-[11px] text-neutral-400">
                  2025년 1월부터 삼형제(첫째 · 둘째 · 셋째)의 매월 20만원 납입 기록
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 text-xs text-neutral-500">
              <span className="flex items-center gap-1 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                완납
              </span>
              <span className="flex items-center gap-1 text-neutral-400">
                <span className="w-2 h-2 rounded-full bg-neutral-300 inline-block"></span>
                미납
              </span>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0 scrollbar-none">
              <table className="w-full text-left text-xs border-collapse min-w-[340px]">
                <thead>
                  <tr className="border-b border-neutral-200/80 text-neutral-400 font-medium text-[11px]">
                    <th className="py-2.5 pr-2 whitespace-nowrap">납입 월차</th>
                    <th className="py-2.5 px-2 text-center whitespace-nowrap">첫째</th>
                    <th className="py-2.5 px-2 text-center whitespace-nowrap">둘째</th>
                    <th className="py-2.5 px-2 text-center whitespace-nowrap">셋째</th>
                    <th className="py-2.5 pl-2 text-right whitespace-nowrap">이달 적립</th>
                    <th className="py-2.5 pl-2 text-right whitespace-nowrap">누적 잔액</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-neutral-800">
                  {displayedHistory.map((m) => {
                    const allPaid = m.brother1Paid && m.brother2Paid && m.brother3Paid;
                    return (
                      <tr key={m.monthKey} className="hover:bg-neutral-50/80 transition-colors">
                        <td className="py-3 pr-2 font-semibold whitespace-nowrap text-xs flex items-center gap-1.5 text-neutral-900">
                          <span>{m.label}</span>
                          {allPaid && <Sparkles className="w-3 h-3 text-amber-500 inline shrink-0" />}
                        </td>

                        <td className="py-3 px-2 text-center">
                          {m.brother1Paid ? (
                            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                              ✓
                            </span>
                          ) : (
                            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-neutral-100 text-neutral-400 text-[10px]">
                              -
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-2 text-center">
                          {m.brother2Paid ? (
                            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                              ✓
                            </span>
                          ) : (
                            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-neutral-100 text-neutral-400 text-[10px]">
                              -
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-2 text-center">
                          {m.brother3Paid ? (
                            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                              ✓
                            </span>
                          ) : (
                            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-neutral-100 text-neutral-400 text-[10px]">
                              -
                            </span>
                          )}
                        </td>

                        <td className="py-3 pl-2 text-right font-mono tabular-nums text-neutral-900 font-semibold whitespace-nowrap">
                          +{formatWon(m.deposit)}
                        </td>

                        <td className="py-3 pl-2 text-right font-mono tabular-nums font-extrabold text-neutral-900 whitespace-nowrap">
                          {formatWon(m.balance)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {monthlyData.length > 8 && (
              <div className="mt-3 pt-2 text-center">
                <button
                  onClick={() => setShowFullHistory(!showFullHistory)}
                  className="text-xs text-neutral-700 hover:text-neutral-900 font-medium py-1.5 px-3.5 bg-white border border-neutral-200/80 rounded-xl transition-all shadow-2xs hover:shadow-xs"
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
