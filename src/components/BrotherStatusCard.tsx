import React, { useState } from 'react';
import { BrotherStatus, MonthlyAggregation } from '../types/fund';
import { Check, Clock, Edit2, Sparkles } from 'lucide-react';

interface BrotherStatusCardProps {
  brothers: BrotherStatus[];
  monthlyData: MonthlyAggregation[];
  customNames: { b1: string; b2: string; b3: string };
  onUpdateNames: (names: { b1: string; b2: string; b3: string }) => void;
}

export const BrotherStatusCard: React.FC<BrotherStatusCardProps> = ({
  brothers,
  monthlyData,
  customNames,
  onUpdateNames,
}) => {
  const [isEditingNames, setIsEditingNames] = useState(false);
  const [editB1, setEditB1] = useState(customNames.b1);
  const [editB2, setEditB2] = useState(customNames.b2);
  const [editB3, setEditB3] = useState(customNames.b3);
  const [showFullHistory, setShowFullHistory] = useState(false);

  const formatWon = (val: number) => {
    return new Intl.NumberFormat('ko-KR').format(val) + '원';
  };

  const handleSaveNames = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateNames({
      b1: editB1.trim() || '첫째 (민호)',
      b2: editB2.trim() || '둘째 (준호)',
      b3: editB3.trim() || '셋째 (진호)',
    });
    setIsEditingNames(false);
  };

  const displayedHistory = showFullHistory
    ? [...monthlyData].reverse()
    : [...monthlyData].reverse().slice(0, 6);

  return (
    <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-5 sm:p-6 border-b border-neutral-100 flex items-center justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-neutral-900 tracking-tight">
            삼형제 회비 납입 현황
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            각자 매월 20만원씩 부모님을 위한 약속
          </p>
        </div>

        <button
          onClick={() => setIsEditingNames(!isEditingNames)}
          className="h-8 px-2.5 text-xs font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-all flex items-center gap-1.5"
        >
          <Edit2 className="w-3.5 h-3.5" />
          <span>{isEditingNames ? '닫기' : '이름 변경'}</span>
        </button>
      </div>

      {/* Inline Name Editor Form */}
      {isEditingNames && (
        <form onSubmit={handleSaveNames} className="p-4 sm:p-5 bg-neutral-50/80 border-b border-neutral-200/80 space-y-3">
          <div className="text-xs font-semibold text-neutral-700">형제 호칭/실명 설정</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] text-neutral-400 mb-1">첫째</label>
              <input
                type="text"
                value={editB1}
                onChange={(e) => setEditB1(e.target.value)}
                placeholder="예: 첫째 (민호)"
                className="w-full text-xs px-3 py-2 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
            </div>
            <div>
              <label className="block text-[11px] text-neutral-400 mb-1">둘째</label>
              <input
                type="text"
                value={editB2}
                onChange={(e) => setEditB2(e.target.value)}
                placeholder="예: 둘째 (준호)"
                className="w-full text-xs px-3 py-2 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
            </div>
            <div>
              <label className="block text-[11px] text-neutral-400 mb-1">셋째</label>
              <input
                type="text"
                value={editB3}
                onChange={(e) => setEditB3(e.target.value)}
                placeholder="예: 셋째 (진호)"
                className="w-full text-xs px-3 py-2 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsEditingNames(false)}
              className="px-3 py-1.5 text-xs text-neutral-500 hover:bg-neutral-200 rounded-lg"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg font-semibold"
            >
              저장
            </button>
          </div>
        </form>
      )}

      {/* 3 Brothers Profile Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-neutral-100">
        {brothers.map((b, idx) => {
          const paidMonths = Object.values(b.history).filter(Boolean).length;
          const totalMonths = Math.max(1, Math.round(b.expectedContribution / 200000));
          const rate = Math.min(100, Math.round((b.totalContributed / b.expectedContribution) * 100));

          return (
            <div key={b.key} className="p-5 sm:p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-2xl bg-neutral-100 flex items-center justify-center font-bold text-xs text-neutral-800">
                      0{idx + 1}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-neutral-900">{b.displayName}</div>
                      <div className="text-[11px] text-neutral-400">월 20만원 자동이체</div>
                    </div>
                  </div>

                  {/* Status Indicator */}
                  {b.isCurrentMonthPaid ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                      <Check className="w-3 h-3 stroke-[2.5px]" />
                      <span>완납</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full">
                      <Clock className="w-3 h-3" />
                      <span>예정</span>
                    </span>
                  )}
                </div>

                <div className="space-y-1 mb-4">
                  <div className="text-[11px] text-neutral-400">누적 적립액</div>
                  <div className="text-2xl font-extrabold text-neutral-900 font-mono tabular-nums">
                    {formatWon(b.totalContributed)}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-neutral-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      rate >= 100 ? 'bg-neutral-900' : 'bg-amber-500'
                    }`}
                    style={{ width: `${Math.min(100, rate)}%` }}
                  />
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
                <span>완납 회차</span>
                <span className="font-semibold text-neutral-900 font-mono tabular-nums">
                  {paidMonths} / {totalMonths}회 ({rate}%)
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Monthly Timeline Matrix Grid */}
      <div className="p-5 sm:p-6 bg-neutral-50/50 border-t border-neutral-100">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-neutral-800">
            월별 회비 납입 현황표
          </span>
          <div className="flex items-center gap-2.5 text-[11px] text-neutral-400">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
              완납
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-neutral-300 inline-block"></span>
              미납
            </span>
          </div>
        </div>

        <div className="overflow-x-auto -mx-5 sm:mx-0 px-5 sm:px-0 scrollbar-none">
          <table className="w-full text-left text-xs border-collapse min-w-[340px]">
            <thead>
              <tr className="border-b border-neutral-200/80 text-neutral-400 font-medium text-[11px]">
                <th className="py-2.5 pr-2 whitespace-nowrap">월차</th>
                <th className="py-2.5 px-2 text-center whitespace-nowrap">{customNames.b1.split(' ')[0]}</th>
                <th className="py-2.5 px-2 text-center whitespace-nowrap">{customNames.b2.split(' ')[0]}</th>
                <th className="py-2.5 px-2 text-center whitespace-nowrap">{customNames.b3.split(' ')[0]}</th>
                <th className="py-2.5 pl-2 text-right whitespace-nowrap">월 적립액</th>
                <th className="py-2.5 pl-2 text-right whitespace-nowrap">누적 잔액</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-neutral-800">
              {displayedHistory.map((m) => {
                const allPaid = m.brother1Paid && m.brother2Paid && m.brother3Paid;
                return (
                  <tr key={m.monthKey} className="hover:bg-white/80 transition-colors">
                    <td className="py-2.5 pr-2 font-medium whitespace-nowrap text-xs flex items-center gap-1.5 text-neutral-700">
                      <span>{m.label}</span>
                      {allPaid && <Sparkles className="w-3 h-3 text-amber-500 inline shrink-0" />}
                    </td>

                    <td className="py-2.5 px-2 text-center">
                      {m.brother1Paid ? (
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                          ✓
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-neutral-100 text-neutral-300 text-[10px]">
                          -
                        </span>
                      )}
                    </td>

                    <td className="py-2.5 px-2 text-center">
                      {m.brother2Paid ? (
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                          ✓
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-neutral-100 text-neutral-300 text-[10px]">
                          -
                        </span>
                      )}
                    </td>

                    <td className="py-2.5 px-2 text-center">
                      {m.brother3Paid ? (
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                          ✓
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-neutral-100 text-neutral-300 text-[10px]">
                          -
                        </span>
                      )}
                    </td>

                    <td className="py-2.5 pl-2 text-right font-mono tabular-nums text-neutral-900 font-medium">
                      +{formatWon(m.deposit)}
                    </td>

                    <td className="py-2.5 pl-2 text-right font-mono tabular-nums font-bold text-neutral-900">
                      {formatWon(m.balance)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {monthlyData.length > 6 && (
          <div className="mt-3 text-center">
            <button
              onClick={() => setShowFullHistory(!showFullHistory)}
              className="text-xs text-neutral-600 hover:text-neutral-900 font-medium py-1.5 px-3.5 bg-white border border-neutral-200/80 rounded-xl transition-all shadow-2xs hover:shadow-xs"
            >
              {showFullHistory ? '최근 6개월만 보기' : `전체 ${monthlyData.length}개월 내역 보기`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
