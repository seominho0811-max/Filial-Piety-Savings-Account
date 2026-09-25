/**
 * [삼형제 효도통장] 기본 구글 시트 연동 설정
 * 
 * Vercel 배포 시 환경 변수(VITE_GOOGLE_SHEET_URL)를 따로 등록하지 않아도,
 * 아래 DEFAULT_GOOGLE_SHEET_URL에 본인의 구글 시트(웹에 게시 CSV 또는 Apps Script) 주소를 적어두면
 * GitHub 푸시 및 Vercel 배포 시 삼형제 모두의 스마트폰에서 자동으로 연결됩니다!
 */
export const DEFAULT_GOOGLE_SHEET_URL: string = "https://script.google.com/macros/s/AKfycbxs8P8eaNQo5G4zgUSHfprZVmMv2iQyejB6KrCaBYRdHiVh4lz4IUUmevLxZn7fCUKL/exec";

/**
 * 힌트:
 * 1. Apps Script 웹 앱 URL (추천 - 양방향 실시간 저장 지원):
 *    "https://script.google.com/macros/s/AKfycb.../exec"
 * 
 * 2. 웹에 게시(CSV) 링크 (읽기 전용):
 *    "https://docs.google.com/spreadsheets/d/e/2PACX-.../pub?output=csv"
 */
