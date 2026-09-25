import React from 'react';
import { DataSourceConfig } from '../types/fund';
import { RefreshCw, Sheet, Plus, BookOpen, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  dataSource: DataSourceConfig;
  onRefresh: () => void;
  onOpenConnector: () => void;
  onOpenGuide: () => void;
  onOpenNewEntry: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  dataSource,
  onRefresh,
  onOpenConnector,
  onOpenGuide,
  onOpenNewEntry,
  activeTab,
  setActiveTab,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/85 backdrop-blur-xl border-b border-neutral-200/70 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Brand Wordmark & Status */}
          <div className="flex items-center gap-3">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('overview');
              }}
              className="group flex items-center gap-2.5 text-neutral-900 transition-opacity hover:opacity-80"
            >
              <div className="w-8 h-8 rounded-xl bg-neutral-900 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                효
              </div>
              <div className="flex flex-col">
                <span className="text-sm sm:text-base font-bold tracking-tight text-neutral-900 leading-none">
                  삼형제 효도통장
                </span>
                <span className="text-[10px] text-neutral-400 font-medium leading-tight mt-0.5 hidden sm:inline">
                  2025.01 ~ 매월 60만원
                </span>
              </div>
            </a>

            {/* Sync status tag */}
            <div className="hidden sm:flex items-center gap-1.5 pl-3 border-l border-neutral-200/80 text-[11px]">
              {dataSource.mode === 'live' ? (
                <span className="flex items-center gap-1 text-emerald-700 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>구글 시트 실시간</span>
                </span>
              ) : (
                <span className="flex items-center gap-1 text-neutral-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  <span>데모 모드</span>
                </span>
              )}
              {dataSource.lastSyncedAt && (
                <span className="text-neutral-400 font-mono text-[10px]">· {dataSource.lastSyncedAt}</span>
              )}
            </div>
          </div>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 p-1 bg-neutral-100/80 rounded-xl text-xs font-medium text-neutral-600">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'overview'
                  ? 'bg-white text-neutral-900 shadow-2xs font-semibold'
                  : 'hover:text-neutral-900'
              }`}
            >
              대시보드
            </button>
            <button
              onClick={() => setActiveTab('brothers')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'brothers'
                  ? 'bg-white text-neutral-900 shadow-2xs font-semibold'
                  : 'hover:text-neutral-900'
              }`}
            >
              삼형제 납입
            </button>
            <button
              onClick={() => setActiveTab('trends')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'trends'
                  ? 'bg-white text-neutral-900 shadow-2xs font-semibold'
                  : 'hover:text-neutral-900'
              }`}
            >
              월별 분석
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'transactions'
                  ? 'bg-white text-neutral-900 shadow-2xs font-semibold'
                  : 'hover:text-neutral-900'
              }`}
            >
              거래내역
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={onRefresh}
              disabled={dataSource.status === 'loading'}
              title="데이터 새로고침"
              className="w-9 h-9 flex items-center justify-center text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-all disabled:opacity-40"
              aria-label="새로고침"
            >
              <RefreshCw className={`w-4 h-4 ${dataSource.status === 'loading' ? 'animate-spin text-neutral-900' : ''}`} />
            </button>

            <button
              onClick={onOpenConnector}
              title="구글 시트 연동 설정"
              className="h-9 px-3 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200/70 rounded-xl transition-all flex items-center gap-1.5"
            >
              <Sheet className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">시트 설정</span>
            </button>

            <button
              onClick={onOpenNewEntry}
              className="h-9 px-3.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 active:scale-95 rounded-xl transition-all flex items-center gap-1.5 shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>기록</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
