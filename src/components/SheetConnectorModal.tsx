import React, { useState } from 'react';
import { X, Sheet, Link as LinkIcon, CheckCircle2, AlertCircle, RefreshCw, HelpCircle, ArrowRight } from 'lucide-react';
import { DataSourceConfig, Transaction } from '../types/fund';
import { fetchGoogleSheetData } from '../utils/googleSheets';

interface SheetConnectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  dataSource: DataSourceConfig;
  onApplyUrl: (url: string, transactions: Transaction[]) => void;
  onResetToDemo: () => void;
  onOpenGuide: () => void;
}

export const SheetConnectorModal: React.FC<SheetConnectorModalProps> = ({
  isOpen,
  onClose,
  dataSource,
  onApplyUrl,
  onResetToDemo,
  onOpenGuide,
}) => {
  const [inputUrl, setInputUrl] = useState(dataSource.url || '');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    status: 'idle' | 'success' | 'error';
    message: string;
    rowCount?: number;
    transactions?: Transaction[];
  }>({
    status: 'idle',
    message: '',
  });

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    if (!inputUrl.trim()) {
      setTestResult({
        status: 'error',
        message: '구글 시트 URL을 입력해 주세요.',
      });
      return;
    }

    setTesting(true);
    setTestResult({ status: 'idle', message: '데이터를 가져와 파싱하는 중...' });

    try {
      const data = await fetchGoogleSheetData(inputUrl.trim());
      if (data.length === 0) {
        throw new Error('시트에서 유효한 거래 내역을 찾지 못했습니다.');
      }

      setTestResult({
        status: 'success',
        message: `연결 성공! 총 ${data.length}건의 거래 내역을 파싱했습니다.`,
        rowCount: data.length,
        transactions: data,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setTestResult({
        status: 'error',
        message: `연결 실패: ${message}`,
      });
    } finally {
      setTesting(false);
    }
  };

  const handleApply = () => {
    if (testResult.status === 'success' && testResult.transactions) {
      onApplyUrl(inputUrl.trim(), testResult.transactions);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-neutral-200 overflow-hidden pb-[env(safe-area-inset-bottom,0px)]">
        {/* Drag handle on mobile */}
        <div className="w-10 h-1 bg-neutral-300 rounded-full mx-auto my-2.5 sm:hidden shrink-0" />

        {/* Header */}
        <div className="px-5 py-3 sm:py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/50 shrink-0">
          <div className="flex items-center gap-2">
            <Sheet className="w-4 h-4 text-emerald-700" />
            <h2 className="text-sm sm:text-base font-bold text-neutral-900">구글 시트 실시간 연동</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs text-neutral-800 overflow-y-auto flex-1">
          <div>
            <label className="block text-xs font-semibold text-neutral-900 mb-1.5">
              구글 시트 연동 주소 (웹에 게시 CSV 또는 Apps Script 웹 앱 URL)
            </label>
            <div className="relative">
              <LinkIcon className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => {
                  setInputUrl(e.target.value);
                  setTestResult({ status: 'idle', message: '' });
                }}
                placeholder="https://docs.google.com/spreadsheets/d/.../pub?output=csv 또는 Apps Script URL"
                className="w-full text-xs pl-9 pr-3 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900 min-h-[44px]"
              />
            </div>
            {/* Guidance for two-way sync */}
            <div className="mt-2.5 p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 text-[11px] space-y-1">
              <div className="flex items-center justify-between font-semibold">
                <span className="text-neutral-800">💡 시트 실시간 자동 저장 안내:</span>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenGuide();
                  }}
                  className="text-amber-800 hover:text-amber-950 font-bold underline"
                >
                  양방향 코드(doPost) 복사
                </button>
              </div>
              <p className="text-neutral-600 leading-snug">
                • <strong>Apps Script 웹 앱 URL:</strong> 읽기 및 <strong>앱에서 입력한 내용 시트에 실시간 자동 저장</strong> 지원<br />
                • <strong>웹에 게시(CSV) 링크:</strong> 구글 정책상 <strong>읽기 전용</strong> (시트에서 입력 후 앱으로 읽기)
              </p>
            </div>
          </div>

          {/* Test connection action */}
          <div>
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={testing || !inputUrl.trim()}
              className="w-full min-h-[44px] py-2 text-xs font-medium text-neutral-800 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {testing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>시트 연결 확인 중...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>연결 테스트 및 미리보기</span>
                </>
              )}
            </button>
          </div>

          {/* Result Alert */}
          {testResult.status === 'success' && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-800 font-semibold text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{testResult.message}</span>
              </div>
              <p className="text-emerald-700 text-[11px]">
                하단 &apos;대시보드에 적용하기&apos;를 누르면 실시간 반영됩니다.
              </p>
            </div>
          )}

          {testResult.status === 'error' && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-1">
              <div className="flex items-center gap-2 text-rose-800 font-semibold text-xs">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{testResult.message}</span>
              </div>
              <p className="text-rose-700 text-[11px] leading-relaxed">
                해결 팁: 구글 시트에서 [파일 &gt; 공유 &gt; 웹에 게시]로 이동하여 [게시]가 활성화되어 있는지 확인해 주세요.
              </p>
            </div>
          )}

          {/* Current Status Box */}
          <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500">
            <span>상태: {dataSource.mode === 'live' ? '실시간 연동 중' : '데모 모드'}</span>
            {dataSource.mode === 'live' && (
              <button
                type="button"
                onClick={() => {
                  onResetToDemo();
                  onClose();
                }}
                className="text-neutral-600 hover:text-neutral-900 underline min-h-[30px] flex items-center"
              >
                데모 데이터로 초기화
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-neutral-200 bg-neutral-50/50 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] px-3.5 py-1.5 text-xs text-neutral-600 hover:bg-neutral-200 rounded-xl font-medium"
          >
            닫기
          </button>

          <button
            type="button"
            onClick={handleApply}
            disabled={testResult.status !== 'success'}
            className="min-h-[44px] px-4 py-2 text-xs font-bold text-white bg-neutral-900 hover:bg-neutral-800 rounded-xl transition-colors flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs active:scale-95"
          >
            <span>대시보드에 적용하기</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
