import React, { useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Transaction, DataSourceConfig } from './types/fund';
import {
  INITIAL_MOCK_TRANSACTIONS,
  computeFundSummary,
  computeBrotherStatuses,
  computeMonthlyAggregations,
  computeCategoryExpenses,
} from './data/mockData';
import { DEFAULT_GOOGLE_SHEET_URL } from './config/defaultSheet';
import { fetchGoogleSheetData, saveTransactionToGoogleSheet, isAppsScriptUrl } from './utils/googleSheets';
import { Header } from './components/Header';
import { MobileBottomNav } from './components/MobileBottomNav';
import { SummaryCards } from './components/SummaryCards';
import { BrotherStatusCard } from './components/BrotherStatusCard';
import { MonthlyChart } from './components/MonthlyChart';
import { TransactionList } from './components/TransactionList';
import { GoogleSheetGuideModal } from './components/GoogleSheetGuideModal';
import { SheetConnectorModal } from './components/SheetConnectorModal';
import { NewEntryModal } from './components/NewEntryModal';
import { Sparkles, Heart, HelpCircle, Sheet } from 'lucide-react';

const STORAGE_KEY_TXS = 'filial_fund_transactions_v1';
const STORAGE_KEY_CONFIG = 'filial_fund_datasource_v1';

const FIXED_BROTHER_NAMES = { b1: '첫째', b2: '둘째', b3: '셋째' };

export default function App() {
  // Data source config
  const [dataSource, setDataSource] = useState<DataSourceConfig>(() => {
    let savedConfig: DataSourceConfig | null = null;
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CONFIG);
      if (saved) savedConfig = JSON.parse(saved);
    } catch {
      // fallback
    }

    const envUrl = (import.meta as { env?: Record<string, string> }).env?.VITE_GOOGLE_SHEET_URL || '';
    const effectiveUrl = savedConfig?.url || envUrl || DEFAULT_GOOGLE_SHEET_URL || '';

    return {
      mode: effectiveUrl ? 'live' : 'demo',
      url: effectiveUrl,
      sheetId: '',
      sheetName: 'Sheet1',
      lastSyncedAt: savedConfig?.lastSyncedAt || null,
      status: 'idle',
    };
  });

  // Transactions state
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TXS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_MOCK_TRANSACTIONS;
  });

  // Modals state
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isConnectorOpen, setIsConnectorOpen] = useState(false);
  const [isNewEntryOpen, setIsNewEntryOpen] = useState(false);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<'overview' | 'brothers' | 'trends' | 'transactions'>('overview');

  // Sync data from Google Sheets
  const syncFromSheet = useCallback(async (targetUrl: string) => {
    if (!targetUrl) return;

    setDataSource((prev) => ({ ...prev, status: 'loading', errorMessage: undefined }));

    try {
      const freshData = await fetchGoogleSheetData(targetUrl);
      if (freshData.length > 0) {
        setTransactions(freshData);
        localStorage.setItem(STORAGE_KEY_TXS, JSON.stringify(freshData));

        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} 동기화`;

        setDataSource((prev) => {
          const updated: DataSourceConfig = {
            ...prev,
            mode: 'live',
            url: targetUrl,
            lastSyncedAt: timeStr,
            status: 'success',
          };
          localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(updated));
          return updated;
        });

        // Trigger subtle celebration confetti
        try {
          confetti({
            particleCount: 35,
            spread: 50,
            origin: { y: 0.2 },
          });
        } catch {
          // ignore
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setDataSource((prev) => ({
        ...prev,
        status: 'error',
        errorMessage: msg,
      }));
    }
  }, []);

  // Initial sync on mount if live URL is configured
  useEffect(() => {
    if (dataSource.mode === 'live' && dataSource.url) {
      syncFromSheet(dataSource.url);
    }
  }, [dataSource.mode, dataSource.url, syncFromSheet]);

  // Handle applying a newly tested Google Sheet URL
  const handleApplySheetUrl = (newUrl: string, liveTransactions: Transaction[]) => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} 동기화`;

    const updatedConfig: DataSourceConfig = {
      mode: 'live',
      url: newUrl,
      sheetId: '',
      sheetName: 'Sheet1',
      lastSyncedAt: timeStr,
      status: 'success',
    };

    setDataSource(updatedConfig);
    setTransactions(liveTransactions);
    localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(updatedConfig));
    localStorage.setItem(STORAGE_KEY_TXS, JSON.stringify(liveTransactions));

    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.3 },
      });
    } catch {
      // ignore
    }
  };

  // Reset to demo data
  const handleResetToDemo = () => {
    const resetConfig: DataSourceConfig = {
      mode: 'demo',
      url: '',
      sheetId: '',
      sheetName: 'Sheet1',
      lastSyncedAt: null,
      status: 'idle',
    };

    setDataSource(resetConfig);
    setTransactions(INITIAL_MOCK_TRANSACTIONS);
    localStorage.removeItem(STORAGE_KEY_CONFIG);
    localStorage.removeItem(STORAGE_KEY_TXS);
  };

  // Add new transaction (supports real-time append to Google Sheets via Apps Script)
  const handleAddTransaction = async (
    newTx: Transaction
  ): Promise<{ success: boolean; message: string; sheetSaved: boolean }> => {
    let sheetSaved = false;
    let feedbackMessage = '대시보드에 내역이 추가되었습니다.';

    // If an Apps Script Web App URL is connected, perform real POST to Google Sheet!
    const targetScriptUrl = isAppsScriptUrl(dataSource.url)
      ? dataSource.url
      : dataSource.writeUrl && isAppsScriptUrl(dataSource.writeUrl)
      ? dataSource.writeUrl
      : null;

    if (targetScriptUrl) {
      try {
        const saveRes = await saveTransactionToGoogleSheet(targetScriptUrl, newTx);
        sheetSaved = saveRes.success;
        feedbackMessage = saveRes.message;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error('Failed to append to Google Sheet:', msg);
        throw new Error(`구글 시트 저장 실패: ${msg}`);
      }
    }

    const updated = [newTx, ...transactions].sort((a, b) => b.date.localeCompare(a.date));
    setTransactions(updated);
    localStorage.setItem(STORAGE_KEY_TXS, JSON.stringify(updated));

    try {
      confetti({
        particleCount: 25,
        spread: 45,
        origin: { y: 0.3 },
      });
    } catch {
      // ignore
    }

    return { success: true, message: feedbackMessage, sheetSaved };
  };

  // Computed data calculations
  const summary = useMemo(() => computeFundSummary(transactions), [transactions]);
  const brothers = useMemo(
    () => computeBrotherStatuses(transactions, FIXED_BROTHER_NAMES),
    [transactions]
  );
  const monthlyData = useMemo(() => computeMonthlyAggregations(transactions), [transactions]);
  const categoryExpenses = useMemo(() => computeCategoryExpenses(transactions), [transactions]);

  return (
    <div className="min-h-screen bg-neutral-50/60 text-neutral-900 flex flex-col font-sans antialiased selection:bg-amber-100 selection:text-amber-900">
      {/* Top Header */}
      <Header
        dataSource={dataSource}
        onRefresh={() => syncFromSheet(dataSource.url)}
        onOpenConnector={() => setIsConnectorOpen(true)}
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenNewEntry={() => setIsNewEntryOpen(true)}
        activeTab={activeTab}
        setActiveTab={(t) => setActiveTab(t as 'overview' | 'brothers' | 'trends' | 'transactions')}
      />

      {/* Main Viewport Container (optimized for modern readability) */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-7 space-y-4 sm:space-y-6 pb-24 md:pb-12">
        {/* Banner: If in demo mode, show gentle modern prompt */}
        {dataSource.mode === 'demo' && (
          <div className="bg-white rounded-2xl border border-neutral-200/80 p-3.5 sm:p-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-amber-600" />
              </span>
              <div>
                <p className="font-bold text-neutral-900 leading-snug">
                  2025년 1월부터 시작된 삼형제의 가상 효도통장 데이터입니다.
                </p>
                <p className="text-neutral-500 text-[11px] mt-0.5">
                  직접 만든 구글 시트를 연동하면 실시간 데이터 조회 및 자동 저장이 작동합니다.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-stretch sm:self-auto shrink-0">
              <button
                onClick={() => setIsGuideOpen(true)}
                className="flex-1 sm:flex-none py-1.5 px-3 font-semibold text-neutral-600 hover:text-neutral-900 text-center text-xs rounded-xl hover:bg-neutral-50 transition-all"
              >
                연동 가이드
              </button>
              <button
                onClick={() => setIsConnectorOpen(true)}
                className="flex-1 sm:flex-none h-8 px-3.5 font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-2xs active:scale-95"
              >
                <Sheet className="w-3.5 h-3.5 text-emerald-400" />
                <span>내 구글 시트 연결</span>
              </button>
            </div>
          </div>
        )}

        {/* Error notification if sync failed */}
        {dataSource.status === 'error' && dataSource.errorMessage && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3.5 text-xs text-rose-800 flex items-center justify-between gap-2">
            <div className="leading-snug">
              <span className="font-bold">시트 동기화 실패:</span> {dataSource.errorMessage}
            </div>
            <button
              onClick={() => setIsConnectorOpen(true)}
              className="text-rose-900 font-bold underline shrink-0 min-h-[36px] flex items-center"
            >
              설정 확인
            </button>
          </div>
        )}

        {/* 2. Primary Tabs Content (No duplicate sections across tabs) */}
        {activeTab === 'overview' && (
          <div className="space-y-4 sm:space-y-6">
            {/* 1. Account Balance & Savings Target (Home only) */}
            <section aria-label="효도통장 잔액 요약">
              <SummaryCards summary={summary} />
            </section>

            {/* 2. Three Brothers Profile Status Cards */}
            <section aria-label="삼형제 납입 현황">
              <BrotherStatusCard
                brothers={brothers}
                mode="cards"
              />
            </section>
          </div>
        )}

        {activeTab === 'brothers' && (
          <div className="space-y-4 sm:space-y-6">
            {/* Monthly Payment Matrix only - No duplicate balance cards */}
            <section aria-label="삼형제 월별 납입 현황표">
              <BrotherStatusCard
                brothers={brothers}
                monthlyData={monthlyData}
                mode="matrix"
              />
            </section>
          </div>
        )}

        {activeTab === 'trends' && (
          <div className="space-y-4 sm:space-y-6">
            {/* Monthly Trend & Breakdown Charts only - No duplicate balance cards */}
            <section aria-label="월별 입출금 및 항목별 분석">
              <MonthlyChart
                monthlyData={monthlyData}
                categoryExpenses={categoryExpenses}
              />
            </section>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="space-y-4 sm:space-y-6">
            {/* Ledger only - No duplicate balance cards */}
            <section aria-label="효도통장 전체 거래내역">
              <TransactionList
                transactions={transactions}
                onOpenNewEntry={() => setIsNewEntryOpen(true)}
              />
            </section>
          </div>
        )}
      </main>

      {/* Desktop Footer (Hidden on mobile to preserve screen space) */}
      <footer className="hidden md:block border-t border-neutral-200 bg-white py-6 mt-12 text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            <span className="font-semibold text-neutral-800">삼형제 효도통장 실시간 대시보드</span>
            <span aria-hidden="true">·</span>
            <span>부모님을 향한 감사와 정성을 기록합니다</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsGuideOpen(true)}
              className="hover:text-neutral-900 transition-colors underline flex items-center gap-1"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>구글 시트 연동 &amp; Vercel 배포 가이드</span>
            </button>
            <span aria-hidden="true">·</span>
            <span>2025 ~ 2026</span>
          </div>
        </div>
      </footer>

      {/* Mobile Fixed Bottom Navigation Bar (Pattern 1: Fixed Bottom Tab Bar) */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenGuide={() => setIsGuideOpen(true)}
      />

      {/* Modals (Slide-up bottom sheets on mobile) */}
      <GoogleSheetGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      <SheetConnectorModal
        isOpen={isConnectorOpen}
        onClose={() => setIsConnectorOpen(false)}
        dataSource={dataSource}
        onApplyUrl={handleApplySheetUrl}
        onResetToDemo={handleResetToDemo}
        onOpenGuide={() => setIsGuideOpen(true)}
      />

      <NewEntryModal
        isOpen={isNewEntryOpen}
        onClose={() => setIsNewEntryOpen(false)}
        onAddTransaction={handleAddTransaction}
        dataSource={dataSource}
        onOpenGuide={() => setIsGuideOpen(true)}
      />
    </div>
  );
}
