import { describe, expect, it } from "vitest";
import {
  calculateCloudRunCost,
  calculateCloudSqlCost,
  calculateTotalGcpCost,
  PRICING,
  USD_JPY,
} from "../gcp-cost";

describe("GCP コスト計算", () => {
  describe("calculateCloudRunCost", () => {
    it("無料枠内の場合は 0 を返す", () => {
      const result = calculateCloudRunCost({
        cpu: 1,
        memory: 0.5,
        requests: 100000, // 10万リクエスト（無料枠 200万以下）
        duration: 100, // 100ms
      });

      expect(result).toBe(0);
    });

    it("無料枠を超えた場合は正しくコストを計算する", () => {
      // 10,000,000 リクエスト × 1秒 = 10,000,000 vCPU秒 (無料枠 180,000 を大きく超える)
      const result = calculateCloudRunCost({
        cpu: 1,
        memory: 1,
        requests: 10000000, // 1000万リクエスト
        duration: 1000, // 1秒
      });

      // 計算検証:
      // totalSeconds = 10,000,000 * 1 = 10,000,000秒
      // vCpuSeconds = 10,000,000 * 1 = 10,000,000
      // memoryGbSeconds = 10,000,000 * 1 = 10,000,000
      // billableCpu = 10,000,000 - 180,000 = 9,820,000
      // billableMem = 10,000,000 - 360,000 = 9,640,000
      // billableReq = 10,000,000 - 2,000,000 = 8,000,000
      // costUsd = 9,820,000 * 0.000024 + 9,640,000 * 0.0000025 + 8 * 0.4
      //         = 235.68 + 24.1 + 3.2 = 262.98

      const expectedCpu = 9820000 * PRICING.cloudRun.cpu;
      const expectedMem = 9640000 * PRICING.cloudRun.memory;
      const expectedReq = 8 * PRICING.cloudRun.request;
      const expected = expectedCpu + expectedMem + expectedReq;

      expect(result).toBeCloseTo(expected, 2);
    });

    it("リクエスト数が 0 の場合は 0 を返す", () => {
      const result = calculateCloudRunCost({
        cpu: 4,
        memory: 4,
        requests: 0,
        duration: 500,
      });

      expect(result).toBe(0);
    });

    it("実行時間が 0 の場合もリクエスト課金のみ考慮される", () => {
      const result = calculateCloudRunCost({
        cpu: 1,
        memory: 1,
        requests: 5000000, // 500万リクエスト（無料枠 200万を超える）
        duration: 0,
      });

      // vCPU秒とメモリ秒は 0 だが、リクエスト課金のみ発生
      // billableReq = 5,000,000 - 2,000,000 = 3,000,000
      const expected = (3000000 / 1000000) * PRICING.cloudRun.request;

      expect(result).toBeCloseTo(expected, 4);
    });
  });

  describe("calculateCloudSqlCost", () => {
    it("無効（enabled: false）の場合は 0 を返す", () => {
      const result = calculateCloudSqlCost({
        enabled: false,
        type: "micro",
        storageGb: 100,
      });

      expect(result).toBe(0);
    });

    it("micro インスタンスのコストを正しく計算する", () => {
      const result = calculateCloudSqlCost({
        enabled: true,
        type: "micro",
        storageGb: 10,
      });

      // 730時間 * 0.013 + 10GB * 0.17 = 9.49 + 1.7 = 11.19 USD
      const expected =
        730 * PRICING.cloudSql.micro + 10 * PRICING.cloudSql.storage;

      expect(result).toBeCloseTo(expected, 4);
    });

    it("small インスタンスのコストを正しく計算する", () => {
      const result = calculateCloudSqlCost({
        enabled: true,
        type: "small",
        storageGb: 50,
      });

      const expected =
        730 * PRICING.cloudSql.small + 50 * PRICING.cloudSql.storage;

      expect(result).toBeCloseTo(expected, 4);
    });

    it("medium インスタンスのコストを正しく計算する", () => {
      const result = calculateCloudSqlCost({
        enabled: true,
        type: "medium",
        storageGb: 100,
      });

      const expected =
        730 * PRICING.cloudSql.medium + 100 * PRICING.cloudSql.storage;

      expect(result).toBeCloseTo(expected, 4);
    });

    it("ストレージが 0 の場合はインスタンス料金のみ", () => {
      const result = calculateCloudSqlCost({
        enabled: true,
        type: "micro",
        storageGb: 0,
      });

      const expected = 730 * PRICING.cloudSql.micro;

      expect(result).toBeCloseTo(expected, 4);
    });
  });

  describe("calculateTotalGcpCost", () => {
    it("Cloud Run のみの場合は SQL コストが 0", () => {
      const result = calculateTotalGcpCost(
        { cpu: 1, memory: 1, requests: 100000, duration: 200 },
        { enabled: false, type: "micro", storageGb: 10 },
      );

      expect(result.sql).toBe(0);
      expect(result.total).toBe(result.run);
      expect(result.currency).toBe("JPY");
    });

    it("Cloud Run + Cloud SQL の合計が正しい", () => {
      const result = calculateTotalGcpCost(
        { cpu: 1, memory: 1, requests: 10000000, duration: 1000 },
        { enabled: true, type: "micro", storageGb: 10 },
      );

      expect(result.total).toBe(result.run + result.sql);
      expect(result.currency).toBe("JPY");
    });

    it("結果が JPY で丸められている", () => {
      const result = calculateTotalGcpCost(
        { cpu: 2, memory: 2, requests: 5000000, duration: 500 },
        { enabled: true, type: "small", storageGb: 25 },
      );

      // 結果が整数であることを確認
      expect(Number.isInteger(result.run)).toBe(true);
      expect(Number.isInteger(result.sql)).toBe(true);
      expect(Number.isInteger(result.total)).toBe(true);
    });

    it("無料枠内の Cloud Run + Cloud SQL の計算が正しい", () => {
      const result = calculateTotalGcpCost(
        { cpu: 1, memory: 0.5, requests: 100000, duration: 100 },
        { enabled: true, type: "micro", storageGb: 10 },
      );

      // Cloud Run は無料枠内なので 0
      expect(result.run).toBe(0);
      // Cloud SQL のコストのみ
      const expectedSqlUsd =
        730 * PRICING.cloudSql.micro + 10 * PRICING.cloudSql.storage;
      expect(result.sql).toBe(Math.round(expectedSqlUsd * USD_JPY));
      expect(result.total).toBe(result.sql);
    });
  });
});
