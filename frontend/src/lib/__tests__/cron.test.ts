import { describe, expect, it } from "vitest";
import {
  describeCron,
  formatDateJa,
  getNextRuns,
  isValidCronExpression,
  parseCron,
} from "../cron";

describe("Cron シミュレーター", () => {
  describe("describeCron", () => {
    it("毎分を正しく説明する", () => {
      const result = describeCron("* * * * *");
      expect(result).toContain("毎分");
    });

    it("毎日 9:00 を正しく説明する", () => {
      const result = describeCron("0 9 * * *");
      expect(result).toContain("9");
      expect(result).toContain("0");
    });

    it("5分おきを正しく説明する", () => {
      const result = describeCron("*/5 * * * *");
      expect(result).toContain("5");
    });

    it("平日のスケジュールを正しく説明する", () => {
      const result = describeCron("0 9 * * 1-5");
      expect(result).toBeTruthy();
    });

    it("毎月1日を正しく説明する", () => {
      const result = describeCron("0 12 1 * *");
      expect(result).toContain("1");
      expect(result).toContain("12");
    });

    it("無効な Cron 式でエラーを投げる", () => {
      expect(() => describeCron("invalid")).toThrow();
    });
  });

  describe("getNextRuns", () => {
    it("指定した回数分の次回実行日時を返す", () => {
      const baseDate = new Date("2025-01-12T10:00:00");
      const result = getNextRuns("0 * * * *", 5, baseDate);

      expect(result).toHaveLength(5);
      result.forEach((date) => {
        expect(date).toBeInstanceOf(Date);
      });
    });

    it("毎時 0 分のスケジュールが正しく計算される", () => {
      const baseDate = new Date("2025-01-12T10:30:00");
      const result = getNextRuns("0 * * * *", 3, baseDate);

      // 次の 11:00, 12:00, 13:00 が返されるはず
      expect(result[0].getHours()).toBe(11);
      expect(result[0].getMinutes()).toBe(0);
      expect(result[1].getHours()).toBe(12);
      expect(result[2].getHours()).toBe(13);
    });

    it("毎日 9:00 のスケジュールが正しく計算される", () => {
      const baseDate = new Date("2025-01-12T08:00:00");
      const result = getNextRuns("0 9 * * *", 3, baseDate);

      // 同日 9:00、翌日 9:00、翌々日 9:00
      expect(result[0].getHours()).toBe(9);
      expect(result[0].getMinutes()).toBe(0);
      expect(result[0].getDate()).toBe(12);
      expect(result[1].getDate()).toBe(13);
      expect(result[2].getDate()).toBe(14);
    });

    it("デフォルトで 5 回分を返す", () => {
      const result = getNextRuns("* * * * *");
      expect(result).toHaveLength(5);
    });

    it("無効な Cron 式でエラーを投げる", () => {
      expect(() => getNextRuns("invalid")).toThrow();
    });
  });

  describe("isValidCronExpression", () => {
    it("有効な Cron 式を認識する", () => {
      expect(isValidCronExpression("* * * * *")).toBe(true);
      expect(isValidCronExpression("0 9 * * *")).toBe(true);
      expect(isValidCronExpression("*/5 * * * *")).toBe(true);
      expect(isValidCronExpression("0 9 * * 1-5")).toBe(true);
      expect(isValidCronExpression("0 0 1 * *")).toBe(true);
      expect(isValidCronExpression("30 4 1,15 * *")).toBe(true);
    });

    it("無効な Cron 式を拒否する", () => {
      expect(isValidCronExpression("")).toBe(false);
      expect(isValidCronExpression("invalid")).toBe(false);
      expect(isValidCronExpression("* * *")).toBe(false);
      expect(isValidCronExpression("60 * * * *")).toBe(false);
      expect(isValidCronExpression("* 24 * * *")).toBe(false);
    });
  });

  describe("parseCron", () => {
    it("有効な Cron 式を正しく解析する", () => {
      const baseDate = new Date("2025-01-12T10:00:00");
      const result = parseCron("0 9 * * *", 5, baseDate);

      expect(result.error).toBeNull();
      expect(result.description).toBeTruthy();
      expect(result.nextRuns).toHaveLength(5);
    });

    it("空の Cron 式でエラーを返す", () => {
      const result = parseCron("");

      expect(result.error).toBe("Cron 式を入力してください");
      expect(result.description).toBeNull();
      expect(result.nextRuns).toBeNull();
    });

    it("無効な Cron 式でエラーを返す", () => {
      const result = parseCron("invalid");

      expect(result.error).toBe("Cron 式の形式が正しくありません");
      expect(result.description).toBeNull();
      expect(result.nextRuns).toBeNull();
    });

    it("スペースのみの Cron 式でエラーを返す", () => {
      const result = parseCron("   ");

      expect(result.error).toBe("Cron 式を入力してください");
    });
  });

  describe("formatDateJa", () => {
    it("日本語フォーマットで日時を返す", () => {
      const date = new Date("2025-01-12T09:00:00");
      const result = formatDateJa(date);

      // フォーマットに年月日時分秒が含まれていることを確認
      expect(result).toContain("2025");
      expect(result).toContain("01");
      expect(result).toContain("12");
      expect(result).toContain("09");
      expect(result).toContain("00");
    });

    it("曜日が含まれている", () => {
      const date = new Date("2025-01-12T09:00:00"); // 日曜日
      const result = formatDateJa(date);

      // 曜日（短縮形）が含まれている
      expect(result).toMatch(/日|月|火|水|木|金|土/);
    });
  });
});
