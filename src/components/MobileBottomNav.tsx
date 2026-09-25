import React from 'react';
import { Home, Users, BarChart3, ReceiptText, Sheet } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: 'overview' | 'brothers' | 'trends' | 'transactions';
  setActiveTab: (tab: 'overview' | 'brothers' | 'trends' | 'transactions') => void;
  onOpenGuide: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenGuide,
}) => {
  return (
    <nav
      aria-label="모바일 하단 내비게이션"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/85 backdrop-blur-xl border-t border-neutral-200/70 pb-[env(safe-area-inset-bottom,0px)]"
    >
      <div className="grid grid-cols-5 items-center h-16 max-w-md mx-auto px-2">
        {/* Tab 1: 홈 */}
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-all active:scale-95 ${
            activeTab === 'overview' ? 'text-neutral-900' : 'text-neutral-400 hover:text-neutral-600'
          }`}
        >
          <Home className={`w-5 h-5 transition-transform ${activeTab === 'overview' ? 'stroke-[2.5px] scale-105' : 'stroke-[1.8px]'}`} />
          <span className={`text-[10px] tracking-tight mt-1 ${activeTab === 'overview' ? 'font-bold' : 'font-medium'}`}>
            홈
          </span>
        </button>

        {/* Tab 2: 삼형제 */}
        <button
          type="button"
          onClick={() => setActiveTab('brothers')}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-all active:scale-95 ${
            activeTab === 'brothers' ? 'text-neutral-900' : 'text-neutral-400 hover:text-neutral-600'
          }`}
        >
          <Users className={`w-5 h-5 transition-transform ${activeTab === 'brothers' ? 'stroke-[2.5px] scale-105' : 'stroke-[1.8px]'}`} />
          <span className={`text-[10px] tracking-tight mt-1 ${activeTab === 'brothers' ? 'font-bold' : 'font-medium'}`}>
            삼형제
          </span>
        </button>

        {/* Tab 3: 월별분석 */}
        <button
          type="button"
          onClick={() => setActiveTab('trends')}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-all active:scale-95 ${
            activeTab === 'trends' ? 'text-neutral-900' : 'text-neutral-400 hover:text-neutral-600'
          }`}
        >
          <BarChart3 className={`w-5 h-5 transition-transform ${activeTab === 'trends' ? 'stroke-[2.5px] scale-105' : 'stroke-[1.8px]'}`} />
          <span className={`text-[10px] tracking-tight mt-1 ${activeTab === 'trends' ? 'font-bold' : 'font-medium'}`}>
            월별분석
          </span>
        </button>

        {/* Tab 4: 거래내역 */}
        <button
          type="button"
          onClick={() => setActiveTab('transactions')}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-all active:scale-95 ${
            activeTab === 'transactions' ? 'text-neutral-900' : 'text-neutral-400 hover:text-neutral-600'
          }`}
        >
          <ReceiptText className={`w-5 h-5 transition-transform ${activeTab === 'transactions' ? 'stroke-[2.5px] scale-105' : 'stroke-[1.8px]'}`} />
          <span className={`text-[10px] tracking-tight mt-1 ${activeTab === 'transactions' ? 'font-bold' : 'font-medium'}`}>
            내역
          </span>
        </button>

        {/* Tab 5: 시트가이드 */}
        <button
          type="button"
          onClick={onOpenGuide}
          className="flex flex-col items-center justify-center h-full min-h-[44px] text-neutral-400 hover:text-neutral-900 transition-all active:scale-95"
        >
          <Sheet className="w-5 h-5 stroke-[1.8px] text-emerald-600" />
          <span className="text-[10px] tracking-tight mt-1 font-medium text-emerald-700">
            시트가이드
          </span>
        </button>
      </div>
    </nav>
  );
};
