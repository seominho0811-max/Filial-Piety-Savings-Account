import React, { useState, useMemo } from 'react';
import { Transaction, TransactionType } from '../types/fund';
import { Search, Download, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  onOpenNewEntry: () => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  onOpenNewEntry,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | TransactionType>('all');
  const [memberFilter, setMemberFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const pageSize = 12;

  const formatWon = (val: number) => {
    return new Intl.NumberFormat('ko-KR').format(val) + '원';
  };

  // Filter transactions
  const filtered = useMemo(() => {
    return transactions.filter((tx) => {
      if (typeFilter !== 'all' && tx.type !== typeFilter) return false;

      if (memberFilter !== 'all') {
        if (!tx.member.includes(memberFilter)) return false;
      }

      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesNote = tx.note.toLowerCase().includes(query);
        const matchesCategory = tx.category.toLowerCase().includes(query);
        const matchesMember = tx.member.toLowerCase().includes(query);
        const matchesDate = tx.date.includes(query);
        const matchesAmount = tx.amount.toString().includes(query);

        if (!matchesNote && !matchesCategory && !matchesMember && !matchesDate && !matchesAmount) {
          return false;
        }
      }

      return true;
    });
  }, [transactions, typeFilter, memberFilter, searchTerm]);

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginatedList = filtered.slice((page - 1) * pageSize, page * pageSize);

  // CSV Export handler
  const handleExportCsv = () => {
    const headers = ['날짜', '구분', '입금자/담당자', '금액', '카테고리', '비고'];
    const rows = filtered.map((tx) => [
      tx.date,
      tx.type,
      `"${tx.member.replace(/"/g, '""')}"`,
      tx.amount,
      `"${tx.category.replace(/"/g, '""')}"`,
      `"${tx.note.replace(/"/g, '""')}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `효도통장_거래내역_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-xs overflow-hidden">
      {/* Top Filter & Search Header */}
      <div className="p-5 sm:p-6 border-b border-neutral-100 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-neutral-900 tracking-tight">
              거래 내역
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              총 {filtered.length}건의 입출금 기록
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCsv}
              className="h-8 px-3 text-xs font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-all flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">CSV 내보내기</span>
              <span className="sm:hidden">CSV</span>
            </button>
            <button
              onClick={onOpenNewEntry}
              className="h-8 px-3.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-xl transition-all shadow-2xs"
            >
              + 추가
            </button>
          </div>
        </div>

        {/* Filter controls row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          {/* Segmented Control */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-neutral-100 rounded-2xl">
            <button
              onClick={() => {
                setTypeFilter('all');
                setPage(1);
              }}
              className={`py-1.5 text-xs font-medium rounded-xl transition-all text-center ${
                typeFilter === 'all'
                  ? 'bg-white text-neutral-900 shadow-2xs font-bold'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              전체
            </button>
            <button
              onClick={() => {
                setTypeFilter('입금');
                setPage(1);
              }}
              className={`py-1.5 text-xs font-medium rounded-xl transition-all text-center ${
                typeFilter === '입금'
                  ? 'bg-white text-neutral-900 shadow-2xs font-bold'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              입금만
            </button>
            <button
              onClick={() => {
                setTypeFilter('지출');
                setPage(1);
              }}
              className={`py-1.5 text-xs font-medium rounded-xl transition-all text-center ${
                typeFilter === '지출'
                  ? 'bg-white text-neutral-900 shadow-2xs font-bold'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              지출만
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Member selector */}
            <select
              value={memberFilter}
              onChange={(e) => {
                setMemberFilter(e.target.value);
                setPage(1);
              }}
              aria-label="형제 필터"
              className="text-xs px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900 text-neutral-700 shrink-0 font-medium"
            >
              <option value="all">전체 구성원</option>
              <option value="첫째">첫째</option>
              <option value="둘째">둘째</option>
              <option value="셋째">셋째</option>
              <option value="공동">공동</option>
            </select>

            {/* Search Input */}
            <div className="relative flex-1 sm:w-56">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                placeholder="내역, 항목 검색..."
                className="w-full text-xs pl-8 pr-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 1. Mobile Feed (Toss/KakaoBank style) */}
      <div className="md:hidden divide-y divide-neutral-100">
        {paginatedList.length === 0 ? (
          <div className="py-12 text-center text-xs text-neutral-400">
            조건에 일치하는 거래 내역이 없습니다.
          </div>
        ) : (
          paginatedList.map((tx) => {
            const isDeposit = tx.type === '입금';

            return (
              <div
                key={tx.id}
                className="p-4 flex items-center justify-between gap-3 hover:bg-neutral-50 active:bg-neutral-100 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                      isDeposit ? 'bg-neutral-100 text-neutral-800' : 'bg-rose-50 text-rose-600'
                    }`}
                  >
                    {isDeposit ? (
                      <ArrowDownRight className="w-4 h-4 text-neutral-900" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4 text-rose-500" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-neutral-900 truncate">
                        {tx.category}
                      </span>
                      <span className="text-[11px] text-neutral-400 font-medium shrink-0">
                        · {tx.member}
                      </span>
                    </div>

                    <div className="text-[11px] text-neutral-400 font-mono tabular-nums truncate mt-0.5">
                      {tx.date}
                      {tx.note && <span className="text-neutral-600 font-sans"> · {tx.note}</span>}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div
                    className={`text-sm font-bold font-mono tabular-nums ${
                      isDeposit ? 'text-neutral-900' : 'text-rose-600'
                    }`}
                  >
                    {isDeposit ? '+' : '-'}
                    {formatWon(tx.amount)}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 2. Desktop High-Density Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-neutral-100 bg-neutral-50/50 text-neutral-400 font-medium">
              <th className="py-3 px-5 whitespace-nowrap">날짜</th>
              <th className="py-3 px-4 whitespace-nowrap">구분</th>
              <th className="py-3 px-4 whitespace-nowrap">입금자 / 담당자</th>
              <th className="py-3 px-4 whitespace-nowrap">카테고리</th>
              <th className="py-3 px-4 whitespace-nowrap">비고 및 세부내역</th>
              <th className="py-3 px-5 text-right whitespace-nowrap">금액</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 text-neutral-800">
            {paginatedList.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-neutral-400">
                  조건에 일치하는 거래 내역이 없습니다.
                </td>
              </tr>
            ) : (
              paginatedList.map((tx) => {
                const isDeposit = tx.type === '입금';

                return (
                  <tr key={tx.id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="py-3.5 px-5 whitespace-nowrap font-mono tabular-nums text-neutral-500">
                      {tx.date}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 font-semibold ${
                          isDeposit ? 'text-neutral-900' : 'text-rose-600'
                        }`}
                      >
                        {isDeposit ? (
                          <ArrowDownRight className="w-3.5 h-3.5 text-neutral-700" />
                        ) : (
                          <ArrowUpRight className="w-3.5 h-3.5 text-rose-500" />
                        )}
                        <span>{tx.type}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap font-bold text-neutral-900">
                      {tx.member}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-neutral-600 font-medium">
                      {tx.category}
                    </td>
                    <td className="py-3.5 px-4 text-neutral-500 max-w-xs truncate" title={tx.note}>
                      {tx.note || '-'}
                    </td>
                    <td className="py-3.5 px-5 text-right whitespace-nowrap font-mono tabular-nums font-bold">
                      <span className={isDeposit ? 'text-neutral-900' : 'text-rose-600'}>
                        {isDeposit ? '+' : '-'}
                        {formatWon(tx.amount)}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 sm:p-5 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-400">
        <div>
          <span>
            {(page - 1) * pageSize + 1}-
            {Math.min(page * pageSize, filtered.length)} / 전체 {filtered.length}건
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="h-8 px-3 border border-neutral-200 rounded-xl hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            이전
          </button>
          <span className="font-mono tabular-nums px-2 text-neutral-700 font-medium">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="h-8 px-3 border border-neutral-200 rounded-xl hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            다음
          </button>
        </div>
      </div>
    </div>
  );
};
