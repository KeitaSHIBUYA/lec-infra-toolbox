import { describe, expect, it } from "vitest";
import {
  calculateDaysRemaining,
  formatSslDate,
  getSslStatus,
  getSslStatusColorClass,
  getSslStatusText,
  type SslResult,
} from "../ssl";

describe("SSL 証明書チェッカー", () => {
  describe("SslResult 型", () => {
    it("正しい形式の SslResult オブジェクトを作成できる", () => {
      const result: SslResult = {
        subject: "example.com",
        issuer: "Let's Encrypt",
        validFrom: "2025-01-01T00:00:00Z",
        validTo: "2025-04-01T00:00:00Z",
        daysRemaining: 90,
      };

      expect(result.subject).toBe("example.com");
      expect(result.issuer).toBe("Let's Encrypt");
      expect(result.validFrom).toBe("2025-01-01T00:00:00Z");
      expect(result.validTo).toBe("2025-04-01T00:00:00Z");
      expect(result.daysRemaining).toBe(90);
    });
  });

  describe("formatSslDate", () => {
    it("ISO 形式の日付を日本語フォーマットに変換する", () => {
      const result = formatSslDate("2025-01-12T09:30:00Z");

      // 日本語フォーマットで年月日時分が含まれていることを確認
      expect(result).toContain("2025");
      expect(result).toContain("1");
      expect(result).toContain("12");
    });

    it("異なる日付でも正しく変換する", () => {
      const result = formatSslDate("2025-06-15T14:00:00Z");

      expect(result).toContain("2025");
      expect(result).toContain("6");
      expect(result).toContain("15");
    });

    it("年末の日付も正しく変換する", () => {
      // JST では 2025-12-31T15:00:00Z が 2026-01-01T00:00:00 になるので
      // UTC の年末がそのまま JST でも年末になる日時を使用
      const result = formatSslDate("2025-12-31T10:00:00Z");

      expect(result).toContain("2025");
      expect(result).toContain("12");
      expect(result).toContain("31");
    });
  });

  describe("calculateDaysRemaining", () => {
    it("残り日数を正しく計算する", () => {
      const now = new Date("2025-01-12T00:00:00Z");
      const validTo = "2025-01-22T00:00:00Z"; // 10日後

      const result = calculateDaysRemaining(validTo, now);

      expect(result).toBe(10);
    });

    it("同じ日の場合は 0 を返す", () => {
      const now = new Date("2025-01-12T00:00:00Z");
      const validTo = "2025-01-12T00:00:00Z";

      const result = calculateDaysRemaining(validTo, now);

      expect(result).toBe(0);
    });

    it("期限切れの場合は負の値を返す", () => {
      const now = new Date("2025-01-12T00:00:00Z");
      const validTo = "2025-01-02T00:00:00Z"; // 10日前

      const result = calculateDaysRemaining(validTo, now);

      expect(result).toBe(-10);
    });

    it("1年後の場合は約365日を返す", () => {
      const now = new Date("2025-01-12T00:00:00Z");
      const validTo = "2026-01-12T00:00:00Z";

      const result = calculateDaysRemaining(validTo, now);

      expect(result).toBe(365);
    });

    it("90日後の証明書を正しく計算する", () => {
      const now = new Date("2025-01-01T00:00:00Z");
      const validTo = "2025-04-01T00:00:00Z";

      const result = calculateDaysRemaining(validTo, now);

      expect(result).toBe(90);
    });
  });

  describe("getSslStatus", () => {
    it("31日以上残っている場合は valid を返す", () => {
      expect(getSslStatus(31)).toBe("valid");
      expect(getSslStatus(100)).toBe("valid");
      expect(getSslStatus(365)).toBe("valid");
    });

    it("1〜30日残っている場合は warning を返す", () => {
      expect(getSslStatus(30)).toBe("warning");
      expect(getSslStatus(15)).toBe("warning");
      expect(getSslStatus(7)).toBe("warning");
      expect(getSslStatus(1)).toBe("warning");
    });

    it("0日以下の場合は expired を返す", () => {
      expect(getSslStatus(0)).toBe("expired");
      expect(getSslStatus(-1)).toBe("expired");
      expect(getSslStatus(-30)).toBe("expired");
    });
  });

  describe("getSslStatusText", () => {
    it("valid ステータスのテキストを返す", () => {
      const result = getSslStatusText("valid");

      expect(result.label).toBe("有効");
      expect(result.labelEn).toBe("Valid");
    });

    it("warning ステータスのテキストを返す", () => {
      const result = getSslStatusText("warning");

      expect(result.label).toContain("有効");
      expect(result.label).toContain("期限切れ");
      expect(result.labelEn).toContain("Valid");
      expect(result.labelEn).toContain("Expiring");
    });

    it("expired ステータスのテキストを返す", () => {
      const result = getSslStatusText("expired");

      expect(result.label).toBe("期限切れ");
      expect(result.labelEn).toBe("Expired");
    });
  });

  describe("getSslStatusColorClass", () => {
    it("valid ステータスは緑色のクラスを返す", () => {
      const result = getSslStatusColorClass("valid");

      expect(result).toBe("bg-green-600");
    });

    it("warning ステータスは黄色のクラスを返す", () => {
      const result = getSslStatusColorClass("warning");

      expect(result).toBe("bg-yellow-500");
    });

    it("expired ステータスは赤色のクラスを返す", () => {
      const result = getSslStatusColorClass("expired");

      expect(result).toBe("bg-red-600");
    });
  });
});
