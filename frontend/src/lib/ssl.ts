/**
 * SSL 証明書チェッカーのロジック
 */

/**
 * SSL 証明書の結果を表すインターフェース
 */
export interface SslResult {
  subject: string;
  issuer: string;
  validFrom: string;
  validTo: string;
  daysRemaining: number;
}

/**
 * ISO 8601 形式の日付文字列を日本語フォーマットに変換する
 * @param isoString - ISO 8601 形式の日付文字列
 * @returns 日本語フォーマットの日付文字列（例: 2025年1月12日 09:00）
 */
export function formatSslDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * SSL 証明書の有効期限までの残り日数を計算する
 * @param validTo - 有効期限の ISO 8601 形式の日付文字列
 * @param now - 現在日時（デフォルトは現在時刻）
 * @returns 残り日数（整数、期限切れの場合は負の値）
 */
export function calculateDaysRemaining(
  validTo: string,
  now: Date = new Date(),
): number {
  const expiryDate = new Date(validTo);
  const diffMs = expiryDate.getTime() - now.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * SSL 証明書のステータスを判定する
 * @param daysRemaining - 残り日数
 * @returns ステータス（'valid' | 'warning' | 'expired'）
 */
export function getSslStatus(
  daysRemaining: number,
): "valid" | "warning" | "expired" {
  if (daysRemaining <= 0) {
    return "expired";
  }
  if (daysRemaining <= 30) {
    return "warning";
  }
  return "valid";
}

/**
 * SSL 証明書のステータスに対応する表示テキストを取得する
 * @param status - ステータス
 * @returns 表示テキスト
 */
export function getSslStatusText(status: "valid" | "warning" | "expired"): {
  label: string;
  labelEn: string;
} {
  switch (status) {
    case "valid":
      return { label: "有効", labelEn: "Valid" };
    case "warning":
      return {
        label: "有効（まもなく期限切れ）",
        labelEn: "Valid (Expiring Soon)",
      };
    case "expired":
      return { label: "期限切れ", labelEn: "Expired" };
  }
}

/**
 * SSL 証明書のステータスに対応する背景色クラスを取得する
 * @param status - ステータス
 * @returns Tailwind CSS のクラス名
 */
export function getSslStatusColorClass(
  status: "valid" | "warning" | "expired",
): string {
  switch (status) {
    case "valid":
      return "bg-green-600";
    case "warning":
      return "bg-yellow-500";
    case "expired":
      return "bg-red-600";
  }
}
