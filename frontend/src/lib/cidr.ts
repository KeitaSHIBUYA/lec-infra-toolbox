// CIDR / サブネット計算ユーティリティ

import { calculateSubnetMask } from "ip-subnet-calculator";

export interface SubnetResult {
  ipLowStr: string; // ネットワークアドレス
  ipHighStr: string; // ブロードキャストアドレス
  prefixMaskStr: string; // サブネットマスク
}

export interface CidrCalculationResult {
  networkAddress: string;
  broadcastAddress: string;
  subnetMask: string;
  hostRangeStart: string;
  hostRangeEnd: string;
  hostCount: number;
  binaryNetmask: string;
}

/**
 * ホスト数を計算
 * @param cidr CIDR 表記のマスク (0-32)
 * @returns 利用可能なホスト数
 */
export function calculateHostCount(cidr: number): number {
  if (cidr < 0 || cidr > 32) {
    throw new Error("CIDR must be between 0 and 32");
  }
  // /32 と /31 は特殊ケース
  if (cidr === 32) return 1;
  if (cidr === 31) return 2;
  return Math.pow(2, 32 - cidr) - 2;
}

/**
 * サブネットマスクをバイナリ表記に変換
 * @param subnetMask ドット区切りのサブネットマスク (e.g., "255.255.255.0")
 * @returns バイナリ表記 (e.g., "11111111.11111111.11111111.00000000")
 */
export function subnetMaskToBinary(subnetMask: string): string {
  return subnetMask
    .split(".")
    .map((octet) => parseInt(octet).toString(2).padStart(8, "0"))
    .join(".");
}

/**
 * ホスト範囲の開始IPを計算
 * @param networkAddress ネットワークアドレス
 * @returns ホスト範囲の開始IP
 */
export function calculateHostRangeStart(networkAddress: string): string {
  const octets = networkAddress.split(".");
  octets[3] = String(Number(octets[3]) + 1);
  return octets.join(".");
}

/**
 * ホスト範囲の終了IPを計算
 * @param broadcastAddress ブロードキャストアドレス
 * @returns ホスト範囲の終了IP
 */
export function calculateHostRangeEnd(broadcastAddress: string): string {
  const octets = broadcastAddress.split(".");
  octets[3] = String(Number(octets[3]) - 1);
  return octets.join(".");
}

/**
 * CIDR の完全な計算結果を取得
 * @param ip IP アドレス
 * @param cidr CIDR 表記のマスク
 * @returns 計算結果またはエラー時は null
 */
export function calculateCidr(
  ip: string,
  cidr: number,
): CidrCalculationResult | null {
  try {
    const result = calculateSubnetMask(ip, cidr) as SubnetResult | null;

    if (!result || !result.ipLowStr) {
      return null;
    }

    return {
      networkAddress: result.ipLowStr,
      broadcastAddress: result.ipHighStr,
      subnetMask: result.prefixMaskStr,
      hostRangeStart: calculateHostRangeStart(result.ipLowStr),
      hostRangeEnd: calculateHostRangeEnd(result.ipHighStr),
      hostCount: calculateHostCount(cidr),
      binaryNetmask: subnetMaskToBinary(result.prefixMaskStr),
    };
  } catch {
    return null;
  }
}

/**
 * IP アドレスの形式を検証
 * @param ip IP アドレス文字列
 * @returns 有効な場合 true
 */
export function isValidIpAddress(ip: string): boolean {
  const pattern = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (!pattern.test(ip)) {
    return false;
  }

  const octets = ip.split(".");
  return octets.every((octet) => {
    const num = parseInt(octet, 10);
    return num >= 0 && num <= 255;
  });
}
