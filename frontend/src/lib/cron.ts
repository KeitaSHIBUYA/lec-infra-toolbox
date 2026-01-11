// Cron シミュレーターユーティリティ

import parser from "cron-parser";
import cronstrue from "cronstrue/i18n";

export interface CronParseResult {
  description: string;
  nextRuns: Date[];
  error: null;
}

export interface CronParseError {
  description: null;
  nextRuns: null;
  error: string;
}

export type CronResult = CronParseResult | CronParseError;

/**
 * Cron 式を日本語で説明
 * @param expression Cron 式
 * @returns 日本語での説明
 * @throws 無効な Cron 式の場合
 */
export function describeCron(expression: string): string {
  return cronstrue.toString(expression, { locale: "ja" });
}

/**
 * Cron 式から次回実行予定を計算
 * @param expression Cron 式
 * @param count 取得する回数
 * @param baseDate 基準日時（デフォルトは現在時刻）
 * @returns 次回実行予定の Date 配列
 * @throws 無効な Cron 式の場合
 */
export function getNextRuns(
  expression: string,
  count: number = 5,
  baseDate?: Date,
): Date[] {
  const options = baseDate ? { currentDate: baseDate } : {};
  const interval = parser.parse(expression, options);

  const runs: Date[] = [];
  for (let i = 0; i < count; i++) {
    runs.push(interval.next().toDate());
  }
  return runs;
}

/**
 * Cron 式を解析して結果を返す
 * @param expression Cron 式
 * @param count 次回実行予定の取得数
 * @param baseDate 基準日時
 * @returns 解析結果またはエラー
 */
export function parseCron(
  expression: string,
  count: number = 5,
  baseDate?: Date,
): CronResult {
  if (!expression || expression.trim() === "") {
    return {
      description: null,
      nextRuns: null,
      error: "Cron 式を入力してください",
    };
  }

  try {
    const description = describeCron(expression);
    const nextRuns = getNextRuns(expression, count, baseDate);

    return {
      description,
      nextRuns,
      error: null,
    };
  } catch {
    return {
      description: null,
      nextRuns: null,
      error: "Cron 式の形式が正しくありません",
    };
  }
}

/**
 * Cron 式が有効かどうかを検証
 * @param expression Cron 式
 * @returns 有効な場合 true
 */
export function isValidCronExpression(expression: string): boolean {
  if (!expression || expression.trim() === "") {
    return false;
  }

  // 基本的な形式チェック（5つまたは6つのフィールド）
  const fields = expression.trim().split(/\s+/);
  if (fields.length < 5 || fields.length > 6) {
    return false;
  }

  try {
    parser.parse(expression);
    return true;
  } catch {
    return false;
  }
}

/**
 * Date を日本語フォーマットの文字列に変換
 * @param date Date オブジェクト
 * @returns フォーマットされた文字列
 */
export function formatDateJa(date: Date): string {
  return date.toLocaleString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    weekday: "short",
  });
}
