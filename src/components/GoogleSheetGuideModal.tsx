import React, { useState } from 'react';
import { X, Copy, Check, Download, Code2, Table, Globe, Sparkles } from 'lucide-react';
import { SAMPLE_CSV_TEMPLATE, GOOGLE_APPS_SCRIPT_CODE } from '../utils/googleSheets';

interface GoogleSheetGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleSheetGuideModal: React.FC<GoogleSheetGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedCsv, setCopiedCsv] = useState(false);
  const [activeSection, setActiveSection] = useState<'columns' | 'connect' | 'vercel'>('columns');

  if (!isOpen) return null;

  const handleCopyScript = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_CODE);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  const handleCopyCsv = () => {
    navigator.clipboard.writeText(SAMPLE_CSV_TEMPLATE);
    setCopiedCsv(true);
    setTimeout(() => setCopiedCsv(false), 2000);
  };

  const handleDownloadCsv = () => {
    const blob = new Blob(['\uFEFF' + SAMPLE_CSV_TEMPLATE], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = '삼형제_효도통장_구글시트_표준템플릿.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-neutral-200 overflow-hidden pb-[env(safe-area-inset-bottom,0px)]">
        {/* Drag handle on mobile */}
        <div className="w-10 h-1 bg-neutral-300 rounded-full mx-auto my-2.5 sm:hidden shrink-0" />

        {/* Modal Header */}
        <div className="px-5 py-3 sm:py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/50 shrink-0">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-neutral-900 flex items-center gap-1.5">
              <Table className="w-4 h-4 text-emerald-700" />
              <span>시트 구성 &amp; Vercel 배포 가이드</span>
            </h2>
            <p className="text-[11px] text-neutral-500 mt-0.5">
              컬럼 설계부터 삼형제 모바일 앱 배포까지
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs (Mobile-friendly overflow) */}
        <div className="px-4 sm:px-6 border-b border-neutral-200 flex gap-4 sm:gap-6 text-xs font-medium overflow-x-auto scrollbar-none shrink-0">
          <button
            onClick={() => setActiveSection('columns')}
            className={`py-2.5 sm:py-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap min-h-[40px] ${
              activeSection === 'columns'
                ? 'border-neutral-900 text-neutral-900 font-bold'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>1. 최적 컬럼 구조</span>
          </button>
          <button
            onClick={() => setActiveSection('connect')}
            className={`py-2.5 sm:py-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap min-h-[40px] ${
              activeSection === 'connect'
                ? 'border-neutral-900 text-neutral-900 font-bold'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>2. JSON 연동법</span>
          </button>
          <button
            onClick={() => setActiveSection('vercel')}
            className={`py-2.5 sm:py-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap min-h-[40px] ${
              activeSection === 'vercel'
                ? 'border-neutral-900 text-neutral-900 font-bold'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>3. Vercel 배포</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-neutral-800 text-xs flex-1">
          {/* SECTION 1: Columns */}
          {activeSection === 'columns' && (
            <div className="space-y-4">
              <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3.5">
                <div className="font-bold text-amber-900 text-xs sm:text-sm mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>구글 시트 1행 헤더에 넣을 6개 핵심 컬럼</span>
                </div>
                <p className="text-amber-800 text-[11px] leading-relaxed">
                  구글 시트의 첫 번째 행에 아래 순서로 헤더를 입력하면 대시보드가 자동으로 입금 준수율과 잔액을 계산합니다.
                </p>
              </div>

              {/* Column Table */}
              <div className="border border-neutral-200 rounded-xl overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[320px]">
                  <thead>
                    <tr className="bg-neutral-50 border-b border-neutral-200 font-semibold text-neutral-700 text-[11px]">
                      <th className="p-2.5 w-12 text-center">열</th>
                      <th className="p-2.5 w-24">컬럼명</th>
                      <th className="p-2.5">설명 및 입력 규칙</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 text-[11px]">
                    <tr>
                      <td className="p-2.5 text-center font-mono font-bold text-neutral-500">A</td>
                      <td className="p-2.5 font-bold text-neutral-900">날짜</td>
                      <td className="p-2.5 text-neutral-600">YYYY-MM-DD (예: 2025-01-05)</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-center font-mono font-bold text-neutral-500">B</td>
                      <td className="p-2.5 font-bold text-neutral-900">구분</td>
                      <td className="p-2.5 text-neutral-600">
                        <span className="font-bold text-emerald-700">입금</span> 또는{' '}
                        <span className="font-bold text-rose-600">지출</span> (드롭다운 추천)
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-center font-mono font-bold text-neutral-500">C</td>
                      <td className="p-2.5 font-bold text-neutral-900">입금자/담당자</td>
                      <td className="p-2.5 text-neutral-600">
                        <span className="font-semibold text-neutral-900">첫째</span>,{' '}
                        <span className="font-semibold text-neutral-900">둘째</span>,{' '}
                        <span className="font-semibold text-neutral-900">셋째</span>,{' '}
                        <span className="font-semibold text-neutral-900">예금 이자</span>, 또는{' '}
                        <span className="font-semibold text-neutral-900">공동</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-center font-mono font-bold text-neutral-500">D</td>
                      <td className="p-2.5 font-bold text-neutral-900">금액</td>
                      <td className="p-2.5 text-neutral-600">숫자 (예: 200000, 600000)</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-center font-mono font-bold text-neutral-500">E</td>
                      <td className="p-2.5 font-bold text-neutral-900">카테고리</td>
                      <td className="p-2.5 text-neutral-600">정기적립, 부모님용돈, 생신/기념일, 병원/건강, 가족식사/여행</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-center font-mono font-bold text-neutral-500">F</td>
                      <td className="p-2.5 font-bold text-neutral-900">비고</td>
                      <td className="p-2.5 text-neutral-600">세부 메모 (예: 1월 회비, 설 명절 용돈)</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 p-3.5 bg-neutral-50 rounded-xl border border-neutral-200">
                <div className="text-[11px] text-neutral-600">
                  구글 스프레드시트에 [가져오기]할 표준 템플릿입니다.
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleCopyCsv}
                    className="flex-1 sm:flex-none min-h-[38px] px-3 py-1.5 text-neutral-700 bg-white border border-neutral-300 hover:bg-neutral-100 rounded-lg font-medium transition-colors flex items-center justify-center gap-1.5"
                  >
                    {copiedCsv ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCsv ? '복사됨' : 'CSV 복사'}</span>
                  </button>
                  <button
                    onClick={handleDownloadCsv}
                    className="flex-1 sm:flex-none min-h-[38px] px-3.5 py-1.5 text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>CSV 다운로드</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: Connect */}
          {activeSection === 'connect' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-blue-50/80 border border-blue-200 rounded-xl space-y-1 text-[11px] text-blue-900">
                <div className="font-bold flex items-center gap-1.5 text-xs text-blue-950">
                  <span>❓ 앱에서 기록한 내용이 구글 시트에 바로 저장되지 않는 이유와 해결법</span>
                </div>
                <p className="leading-relaxed">
                  구글 시트의 <strong>웹에 게시(CSV)</strong> 링크는 구글 정책상 <strong>읽기 전용(Read-Only)</strong>입니다.
                  앱에서 [내역 기록] 버튼을 눌렀을 때 <strong>실제 구글 시트 원본에 즉시 행이 추가(자동 저장)</strong>되도록 하려면,
                  아래 <strong>방법 2 (Google Apps Script 양방향 배포)</strong>를 사용하셔야 합니다.
                </p>
              </div>

              <div className="border border-neutral-200 rounded-xl p-3.5 bg-white space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-neutral-900 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-[10px] font-bold">
                      1
                    </span>
                    <span>방법 1: Google Apps Script 양방향 연동 (읽기 + 실시간 자동저장) ⭐</span>
                  </div>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                    양방향 실시간 저장
                  </span>
                </div>
                <p className="text-[11px] text-neutral-600 leading-relaxed">
                  구글 시트의 Apps Script에 아래 코드를 넣고 [웹 앱]으로 배포하면, <strong>시트 읽기(`doGet`)</strong>는 물론 앱에서 입력한 내역이 <strong>구글 시트 맨 아래에 새 행으로 자동 추가(`doPost`)</strong>됩니다.
                </p>
                <ol className="list-decimal list-inside space-y-1 text-neutral-700 text-[11px] pl-1">
                  <li>구글 시트 상단 메뉴: <strong>[확장 프로그램] &gt; [Apps Script]</strong> 클릭</li>
                  <li>기존 코드를 모두 지우고 아래 제공된 <strong>Code.gs 코드</strong>를 붙여넣기 후 저장 (Ctrl+S)</li>
                  <li>우측 상단 <strong>[배포] &gt; [새 배포]</strong> 클릭</li>
                  <li>유형: <strong>[웹 앱]</strong>, 다음 사용자로 실행: <strong>[나]</strong>, 액세스 권한: <strong>[모든 사용자]</strong> 설정 후 배포</li>
                  <li>발급된 <strong>웹 앱 URL (script.google.com/macros/s/.../exec)</strong>을 본 앱의 [시트 설정]에 입력!</li>
                </ol>

                <div className="relative mt-2">
                  <div className="flex items-center justify-between px-3 py-1.5 bg-neutral-900 text-neutral-300 rounded-t-lg text-[10px]">
                    <span className="font-mono">Code.gs (양방향 doGet + doPost 완비)</span>
                    <button
                      onClick={handleCopyScript}
                      className="text-white hover:text-amber-400 flex items-center gap-1 font-semibold"
                    >
                      {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedScript ? '복사됨!' : '스크립트 전체 복사'}</span>
                    </button>
                  </div>
                  <pre className="p-2.5 bg-neutral-950 text-neutral-100 rounded-b-lg font-mono text-[9px] sm:text-[10px] overflow-x-auto max-h-48 leading-relaxed">
                    {GOOGLE_APPS_SCRIPT_CODE}
                  </pre>
                </div>
              </div>

              <div className="border border-neutral-200 rounded-xl p-3.5 bg-white space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-neutral-900 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-neutral-100 text-neutral-800 flex items-center justify-center text-[10px] font-bold">
                      2
                    </span>
                    <span>방법 2: 웹에 게시(CSV) - 단순 조회용</span>
                  </div>
                  <span className="text-[10px] text-neutral-500 font-medium bg-neutral-100 px-2 py-0.5 rounded-md">
                    읽기 전용
                  </span>
                </div>
                <p className="text-[11px] text-neutral-600 leading-relaxed">
                  구글 시트 [파일 &gt; 공유 &gt; 웹에 게시]로 생성된 CSV 링크는 <strong>시트에서 직접 입력한 내용만 대시보드가 읽어오는 단방향</strong> 방식입니다. 앱에서 기록할 때는 [시트 행 복사] 버튼을 눌러 시트에 수동으로 붙여넣어야 합니다.
                </p>
              </div>
            </div>
          )}

          {/* SECTION 3: Vercel */}
          {activeSection === 'vercel' && (
            <div className="space-y-3">
              <div className="bg-neutral-900 text-white rounded-xl p-3.5 space-y-1.5">
                <div className="font-bold text-xs sm:text-sm flex items-center gap-2">
                  <Globe className="w-4 h-4 text-emerald-400" />
                  <span>스마트폰 홈 화면에 추가하여 앱처럼 쓰기</span>
                </div>
                <p className="text-neutral-300 text-[11px] leading-relaxed">
                  배포된 링크를 삼형제 카카오톡 단톡방에 공유한 뒤, 브라우저에서 <strong>[홈 화면에 추가]</strong>를 누르면 스마트폰 앱처럼 설치됩니다!
                </p>
              </div>

              <div className="p-3 border border-neutral-200 rounded-xl space-y-1 text-[11px]">
                <div className="font-bold text-neutral-900">Vercel 배포 시 환경 변수 설정</div>
                <p className="text-neutral-600">
                  Vercel 대시보드의 Environment Variables에 다음 키를 추가해 두면 기본 자동 연동됩니다:
                </p>
                <div className="p-2 bg-neutral-100 rounded-lg font-mono text-[10px] text-neutral-800 break-all">
                  VITE_GOOGLE_SHEET_URL = [구글시트 웹에 게시 CSV 주소]
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-neutral-200 bg-neutral-50/50 flex items-center justify-end shrink-0">
          <button
            onClick={onClose}
            className="min-h-[44px] px-5 py-2 text-xs font-bold text-white bg-neutral-900 hover:bg-neutral-800 rounded-xl transition-colors"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};
