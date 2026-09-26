import React, { useState } from 'react';
import { X, Plus, Copy, Check, CheckCircle2, AlertCircle, RefreshCw, ExternalLink } from 'lucide-react';
import { Transaction, TransactionType, DataSourceConfig } from '../types/fund';
import { isAppsScriptUrl } from '../utils/googleSheets';

interface NewEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTransaction: (tx: Transaction) => Promise<{ success: boolean; message: string; sheetSaved: boolean }>;
  dataSource: DataSourceConfig;
  onOpenGuide: () => void;
}

export const NewEntryModal: React.FC<NewEntryModalProps> = ({
  isOpen,
  onClose,
  onAddTransaction,
  dataSource,
  onOpenGuide,
}) => {
  const todayStr = new Date().toISOString().slice(0, 10);

  const [date, setDate] = useState(todayStr);
  const [type, setType] = useState<TransactionType>('입금');
  const [member, setMember] = useState('첫째');
  const [amount, setAmount] = useState('200000');
  const [category, setCategory] = useState('정기적립');
  const [note, setNote] = useState('');
  const [copiedRow, setCopiedRow] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  if (!isOpen) return null;

  const hasWriteCapability = isAppsScriptUrl(dataSource.url) || isAppsScriptUrl(dataSource.writeUrl || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanAmount = parseInt(amount.replace(/[^0-9]/g, ''), 10) || 0;
    if (cleanAmount <= 0) return;

    setIsSubmitting(true);
    setFeedback(null);

    const newTx: Transaction = {
      id: `local-${Date.now()}`,
      date,
      type,
      member,
      amount: cleanAmount,
      category,
      note: note.trim(),
    };

    try {
      const res = await onAddTransaction(newTx);
      if (res.sheetSaved) {
        setFeedback({
          type: 'success',
          message: '구글 시트에 실시간 행 추가 완료!',
        });
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        // Added to dashboard locally
        onClose();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setFeedback({
        type: 'error',
        message: `저장 실패: ${msg}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const sheetPasteText = `${date}\t${type}\t${member}\t${amount}\t${category}\t${note.trim()}`;

  const handleCopyPasteText = () => {
    navigator.clipboard.writeText(sheetPasteText);
    setCopiedRow(true);
    setTimeout(() => setCopiedRow(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl border border-neutral-200 overflow-hidden pb-[env(safe-area-inset-bottom,0px)]">
        {/* Mobile Drag Handle */}
        <div className="w-10 h-1 bg-neutral-300 rounded-full mx-auto my-2.5 sm:hidden shrink-0" />

        {/* Header */}
        <div className="px-5 py-3 sm:py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/50 shrink-0">
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-neutral-900" />
            <h2 className="text-sm sm:text-base font-bold text-neutral-900">새 거래내역 기록</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs overflow-y-auto flex-1">
          {/* Storage Capability Notice */}
          {hasWriteCapability ? (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-800">
              <div className="flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>구글 시트 실시간 자동 저장 활성화됨</span>
              </div>
              <span className="text-[11px] text-emerald-700 font-mono">Apps Script 연동</span>
            </div>
          ) : (
            <div className="p-3.5 bg-amber-50/90 border border-amber-200 rounded-xl space-y-1.5 text-xs text-amber-900">
              <div className="flex items-center justify-between font-bold">
                <span className="flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>현재 읽기 전용 (CSV / 데모) 상태입니다</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenGuide();
                  }}
                  className="text-[11px] text-amber-800 underline hover:text-amber-950 font-bold"
                >
                  양방향 연동법 보기
                </button>
              </div>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                구글 시트 <strong>웹에 게시(CSV)</strong>는 구글 보안 정책상 <strong>읽기 전용</strong>입니다. 앱에서 등록한 즉시 구글 시트 원본에 자동 저장되려면 <strong>Apps Script 웹 앱(doPost)</strong>을 연결해야 합니다.
              </p>
              <div className="pt-1 flex items-center justify-between">
                <span className="text-[11px] text-neutral-600">지금 시트에 수동 추가하시려면:</span>
                <button
                  type="button"
                  onClick={handleCopyPasteText}
                  className="text-[11px] font-bold text-neutral-800 bg-white border border-amber-300 hover:bg-amber-100 px-2 py-1 rounded-lg flex items-center gap-1 min-h-[32px]"
                >
                  {copiedRow ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedRow ? '복사 완료!' : '이 행 시트용 복사'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Feedback message if any */}
          {feedback && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                feedback.type === 'success'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-rose-100 text-rose-800 border border-rose-300'
              }`}
            >
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span className="font-semibold">{feedback.message}</span>
            </div>
          )}

          {/* Type Toggle */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">거래 구분</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setType('입금');
                  setAmount('200000');
                  setCategory('정기적립');
                }}
                className={`min-h-[44px] py-2 rounded-xl font-medium text-xs border transition-colors ${
                  type === '입금'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold'
                    : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                입금 (회비 적립)
              </button>
              <button
                type="button"
                onClick={() => {
                  setType('지출');
                  setCategory('부모님용돈');
                }}
                className={`min-h-[44px] py-2 rounded-xl font-medium text-xs border transition-colors ${
                  type === '지출'
                    ? 'bg-rose-50 border-rose-500 text-rose-800 font-bold'
                    : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                지출 (효도 비용)
              </button>
            </div>
          </div>

          {/* Date & Member */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">거래 일자</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full text-xs px-3 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900 min-h-[44px]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                {type === '입금' ? '입금자' : '지출 담당자'}
              </label>
              <select
                value={member}
                onChange={(e) => {
                  const val = e.target.value;
                  setMember(val);
                  if (val === '예금 이자') {
                    setCategory('예금이자');
                    if (amount === '200000') setAmount('');
                    if (!note) setNote('통장 결산 이자');
                  } else if (val === '첫째' || val === '둘째' || val === '셋째') {
                    if (category === '예금이자') setCategory('정기적립');
                    if (!amount) setAmount('200000');
                    if (note === '통장 결산 이자') setNote('');
                  }
                }}
                className="w-full text-xs px-3 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900 min-h-[44px]"
              >
                <option value="첫째">첫째</option>
                <option value="둘째">둘째</option>
                <option value="셋째">셋째</option>
                {type === '입금' && <option value="예금 이자">예금 이자 (통장 결산)</option>}
                {type === '지출' && <option value="공동">공동 (삼형제 공동)</option>}
              </select>
            </div>
          </div>

          {/* Amount & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">금액 (원)</label>
              <input
                type="number"
                step="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={member === '예금 이자' ? '예: 25400' : '200000'}
                required
                className="w-full text-xs px-3 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900 font-mono min-h-[44px]"
              />
              {type === '입금' && member !== '예금 이자' && (
                <div className="mt-1.5 flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => setAmount('200000')}
                    className="text-[11px] text-neutral-600 bg-neutral-100 hover:bg-neutral-200 px-2 py-1 rounded-md min-h-[30px]"
                  >
                    20만원 (정기)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAmount('400000')}
                    className="text-[11px] text-neutral-600 bg-neutral-100 hover:bg-neutral-200 px-2 py-1 rounded-md min-h-[30px]"
                  >
                    40만원 (2달치)
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">카테고리</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs px-3 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900 min-h-[44px]"
              >
                {type === '입금' ? (
                  <>
                    <option value="정기적립">정기적립 (월 20만원)</option>
                    <option value="예금이자">예금이자 (통장 결산 이자)</option>
                    <option value="추가적립">추가적립</option>
                    <option value="기타입금">기타입금</option>
                  </>
                ) : (
                  <>
                    <option value="부모님용돈">부모님용돈 (명절/생신)</option>
                    <option value="생신/기념일">생신/기념일 (환갑·칠순·선물)</option>
                    <option value="병원/건강">병원/건강 (종합검진·치료비)</option>
                    <option value="가족식사/여행">가족식사/여행 (어버이날 외식)</option>
                    <option value="경조사">경조사</option>
                    <option value="기타">기타</option>
                  </>
                )}
              </select>
            </div>
          </div>

          {/* Note */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              비고 및 상세 메모
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="예: 9월 회비, 어버이날 부모님 용돈"
              className="w-full text-xs px-3 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900 min-h-[44px]"
            />
          </div>

          {/* Direct Sheet Paste Helper */}
          <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500">
            <span>실제 구글 시트에 붙여넣기:</span>
            <button
              type="button"
              onClick={handleCopyPasteText}
              className="text-neutral-700 hover:text-neutral-900 font-medium flex items-center gap-1 py-1.5 px-2.5 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors min-h-[36px]"
            >
              {copiedRow ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedRow ? '복사됨!' : '시트 행 복사'}</span>
            </button>
          </div>

          {/* Footer buttons */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="min-h-[44px] px-4 py-2 text-xs text-neutral-600 hover:bg-neutral-100 rounded-xl disabled:opacity-50"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="min-h-[44px] flex-1 sm:flex-none px-5 py-2 text-xs font-bold text-white bg-neutral-900 hover:bg-neutral-800 rounded-xl transition-colors shadow-xs active:scale-95 flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>구글 시트에 저장 중...</span>
                </>
              ) : (
                <span>
                  {hasWriteCapability ? '구글 시트에 실시간 저장' : '대시보드에 내역 추가'}
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
