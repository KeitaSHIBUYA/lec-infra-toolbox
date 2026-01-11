import { describe, expect, it } from "vitest";
import {
  calculateCidr,
  calculateHostCount,
  calculateHostRangeEnd,
  calculateHostRangeStart,
  isValidIpAddress,
  subnetMaskToBinary,
} from "../cidr";

describe("CIDR / サブネット計算", () => {
  describe("calculateHostCount", () => {
    it("/24 の場合は 254 ホストを返す", () => {
      expect(calculateHostCount(24)).toBe(254);
    });

    it("/32 の場合は 1 を返す（単一ホスト）", () => {
      expect(calculateHostCount(32)).toBe(1);
    });

    it("/31 の場合は 2 を返す（ポイントツーポイント）", () => {
      expect(calculateHostCount(31)).toBe(2);
    });

    it("/16 の場合は 65534 ホストを返す", () => {
      expect(calculateHostCount(16)).toBe(65534);
    });

    it("/8 の場合は 16777214 ホストを返す", () => {
      expect(calculateHostCount(8)).toBe(16777214);
    });

    it("/0 の場合は大規模なネットワーク", () => {
      expect(calculateHostCount(0)).toBe(Math.pow(2, 32) - 2);
    });

    it("範囲外の CIDR でエラーを投げる", () => {
      expect(() => calculateHostCount(-1)).toThrow(
        "CIDR must be between 0 and 32",
      );
      expect(() => calculateHostCount(33)).toThrow(
        "CIDR must be between 0 and 32",
      );
    });
  });

  describe("subnetMaskToBinary", () => {
    it("255.255.255.0 を正しくバイナリに変換する", () => {
      expect(subnetMaskToBinary("255.255.255.0")).toBe(
        "11111111.11111111.11111111.00000000",
      );
    });

    it("255.255.0.0 を正しくバイナリに変換する", () => {
      expect(subnetMaskToBinary("255.255.0.0")).toBe(
        "11111111.11111111.00000000.00000000",
      );
    });

    it("255.255.255.128 を正しくバイナリに変換する", () => {
      expect(subnetMaskToBinary("255.255.255.128")).toBe(
        "11111111.11111111.11111111.10000000",
      );
    });

    it("0.0.0.0 を正しくバイナリに変換する", () => {
      expect(subnetMaskToBinary("0.0.0.0")).toBe(
        "00000000.00000000.00000000.00000000",
      );
    });
  });

  describe("calculateHostRangeStart", () => {
    it("ネットワークアドレスから最初のホストIPを計算する", () => {
      expect(calculateHostRangeStart("192.168.1.0")).toBe("192.168.1.1");
    });

    it("10.0.0.0 の場合", () => {
      expect(calculateHostRangeStart("10.0.0.0")).toBe("10.0.0.1");
    });
  });

  describe("calculateHostRangeEnd", () => {
    it("ブロードキャストアドレスから最後のホストIPを計算する", () => {
      expect(calculateHostRangeEnd("192.168.1.255")).toBe("192.168.1.254");
    });

    it("10.0.0.255 の場合", () => {
      expect(calculateHostRangeEnd("10.0.0.255")).toBe("10.0.0.254");
    });
  });

  describe("isValidIpAddress", () => {
    it("有効な IP アドレスを認識する", () => {
      expect(isValidIpAddress("192.168.1.1")).toBe(true);
      expect(isValidIpAddress("10.0.0.0")).toBe(true);
      expect(isValidIpAddress("172.16.0.1")).toBe(true);
      expect(isValidIpAddress("0.0.0.0")).toBe(true);
      expect(isValidIpAddress("255.255.255.255")).toBe(true);
    });

    it("無効な IP アドレスを拒否する", () => {
      expect(isValidIpAddress("")).toBe(false);
      expect(isValidIpAddress("192.168.1")).toBe(false);
      expect(isValidIpAddress("192.168.1.1.1")).toBe(false);
      expect(isValidIpAddress("256.168.1.1")).toBe(false);
      expect(isValidIpAddress("192.168.1.256")).toBe(false);
      expect(isValidIpAddress("192.168.-1.1")).toBe(false);
      expect(isValidIpAddress("abc.def.ghi.jkl")).toBe(false);
      expect(isValidIpAddress("192.168.1.1/24")).toBe(false);
    });
  });

  describe("calculateCidr", () => {
    it("192.168.1.0/24 の計算結果が正しい", () => {
      const result = calculateCidr("192.168.1.0", 24);

      expect(result).not.toBeNull();
      expect(result!.networkAddress).toBe("192.168.1.0");
      expect(result!.broadcastAddress).toBe("192.168.1.255");
      expect(result!.subnetMask).toBe("255.255.255.0");
      expect(result!.hostRangeStart).toBe("192.168.1.1");
      expect(result!.hostRangeEnd).toBe("192.168.1.254");
      expect(result!.hostCount).toBe(254);
      expect(result!.binaryNetmask).toBe("11111111.11111111.11111111.00000000");
    });

    it("10.0.0.0/8 の計算結果が正しい", () => {
      const result = calculateCidr("10.0.0.0", 8);

      expect(result).not.toBeNull();
      expect(result!.networkAddress).toBe("10.0.0.0");
      expect(result!.broadcastAddress).toBe("10.255.255.255");
      expect(result!.subnetMask).toBe("255.0.0.0");
      expect(result!.hostCount).toBe(16777214);
    });

    it("172.16.0.0/16 の計算結果が正しい", () => {
      const result = calculateCidr("172.16.0.0", 16);

      expect(result).not.toBeNull();
      expect(result!.networkAddress).toBe("172.16.0.0");
      expect(result!.broadcastAddress).toBe("172.16.255.255");
      expect(result!.subnetMask).toBe("255.255.0.0");
      expect(result!.hostCount).toBe(65534);
    });

    it("192.168.100.50/28 のようなホスト部がある IP でも正しく計算する", () => {
      const result = calculateCidr("192.168.100.50", 28);

      expect(result).not.toBeNull();
      // ネットワークアドレスは IP のネットワーク部分に合わせて計算される
      expect(result!.subnetMask).toBe("255.255.255.240");
      expect(result!.hostCount).toBe(14);
    });

    it("無効な IP アドレスの場合は null を返す", () => {
      const result = calculateCidr("invalid", 24);
      expect(result).toBeNull();
    });
  });
});
