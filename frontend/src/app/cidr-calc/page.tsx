// src/app/cidr/page.tsx
"use client";

import { calculateSubnetMask } from "ip-subnet-calculator";
import { useEffect, useState } from "react";

interface SubnetResult {
  ipLowStr: string;
  ipHighStr: string;
  prefixMaskStr: string;
}

export default function CidrPage() {
  // --- State管理 ---
  const [ip, setIp] = useState("192.168.1.0");
  const [mask, setMask] = useState(24);
  const [result, setResult] = useState<SubnetResult | null>(null);

  // --- 計算ロジック ---
  useEffect(() => {
    try {
      // ライブラリで計算
      const calculation = calculateSubnetMask(ip, mask);

      // IPアドレス形式が正しくない場合などのチェック
      if (!calculation || !calculation.ipLowStr) {
        throw new Error("Invalid IP Address");
      }

      setResult(calculation);
    } catch {
      setResult(null);
      // 入力途中はエラーを出さず、明らかに不正な時だけ出すなどの制御も可能
      // ここではシンプルに結果を消す
    }
  }, [ip, mask]);

  // --- ネットマスクの選択肢生成 (0-32) ---
  const maskOptions = Array.from({ length: 33 }, (_, i) => i).reverse();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* ヘッダー部分 */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            CIDR / サブネット計算機
          </h1>
          <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
            IP アドレスと CIDR 表記から、ネットワークアドレス、
            <br />
            ホスト範囲、ブロードキャストアドレスを即座に算出します。
          </p>
        </div>

        {/* ツール本体 */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden mb-12">
          <div className="p-6 sm:p-8 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-12 items-end">
              {/* IPアドレス入力 */}
              <div className="sm:col-span-8">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  IP アドレス
                </label>
                <input
                  type="text"
                  value={ip}
                  onChange={(e) => setIp(e.target.value)}
                  className="block w-full text-lg px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-indigo-500 focus:border-indigo-500 font-mono"
                  placeholder="192.168.0.1"
                />
              </div>

              {/* スラッシュ */}
              <div className="hidden sm:block sm:col-span-1 text-center text-2xl text-gray-400 dark:text-gray-500 pb-3">
                /
              </div>

              {/* サブネットマスク選択 */}
              <div className="sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  CIDR
                </label>
                <select
                  value={mask}
                  onChange={(e) => setMask(Number(e.target.value))}
                  className="block w-full text-lg px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-indigo-500 focus:border-indigo-500 font-mono"
                >
                  {maskOptions.map((m) => (
                    <option key={m} value={m}>
                      /{m}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 結果表示エリア */}
          <div className="bg-gray-50 dark:bg-gray-900 p-6 sm:p-8">
            {result ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 主要データ */}
                <div className="space-y-4">
                  <ResultRow
                    label="先頭 IP (Network)"
                    value={result.ipLowStr}
                    copyable
                  />
                  <ResultRow
                    label="末尾 IP (Broadcast)"
                    value={result.ipHighStr}
                    copyable
                  />
                  <ResultRow
                    label="サブネットマスク"
                    value={result.prefixMaskStr}
                    copyable
                  />
                </div>

                {/* ホスト情報 */}
                <div className="space-y-4">
                  <ResultRow
                    label="利用可能ホスト範囲"
                    value={`${result.ipLowStr
                      .split(".")
                      .map((o: string, i: number) =>
                        i === 3 ? Number(o) + 1 : o,
                      )
                      .join(".")} 〜 ${result.ipHighStr
                      .split(".")
                      .map((o: string, i: number) =>
                        i === 3 ? Number(o) - 1 : o,
                      )
                      .join(".")}`}
                  />
                  <ResultRow
                    label="ホスト数"
                    value={(Math.pow(2, 32 - mask) - 2).toLocaleString()}
                    highlight
                  />
                  <div className="bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700">
                    <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">
                      Binary Netmask
                    </span>
                    <span className="font-mono text-xs text-indigo-600 dark:text-indigo-400 break-all">
                      {result.prefixMaskStr
                        .split(".")
                        .map((octet: string) =>
                          parseInt(octet).toString(2).padStart(8, "0"),
                        )
                        .join(".")}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400 dark:text-gray-500 py-8">
                有効なIPアドレスを入力してください...
              </div>
            )}
          </div>
        </div>

        {/* --- SEO対策コンテンツ --- */}
        <div className="prose prose-lg text-gray-500 dark:text-gray-400 mx-auto mt-16 border-t border-gray-200 dark:border-gray-700 pt-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            CIDR（サイダー）とは？
          </h2>
          <p>
            CIDR (Classless Inter-Domain Routing) は、IP
            アドレスの割り当てとルーティングを柔軟に行うための仕組みです。
            従来のクラスフル（Class A, B,
            C）な運用に代わり、可変長のサブネットマスクを利用することで、IP
            アドレス空間を効率的に利用できます。
          </p>

          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-6 mb-3">
            よく使われるサブネットマスク早見表
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800">
                  <th className="px-4 py-2 text-left text-gray-900 dark:text-white">
                    CIDR
                  </th>
                  <th className="px-4 py-2 text-left text-gray-900 dark:text-white">
                    サブネットマスク
                  </th>
                  <th className="px-4 py-2 text-left text-gray-900 dark:text-white">
                    ホスト数
                  </th>
                  <th className="px-4 py-2 text-left text-gray-900 dark:text-white">
                    用途例
                  </th>
                </tr>
              </thead>
              <tbody className="text-gray-700 dark:text-gray-300">
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="px-4 py-2 font-mono">/32</td>
                  <td className="px-4 py-2 font-mono">255.255.255.255</td>
                  <td className="px-4 py-2">1</td>
                  <td className="px-4 py-2">単一ホスト（固定IP）</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="px-4 py-2 font-mono">/24</td>
                  <td className="px-4 py-2 font-mono">255.255.255.0</td>
                  <td className="px-4 py-2">254</td>
                  <td className="px-4 py-2">家庭内 LAN、社内 VLAN</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="px-4 py-2 font-mono">/16</td>
                  <td className="px-4 py-2 font-mono">255.255.0.0</td>
                  <td className="px-4 py-2">65,534</td>
                  <td className="px-4 py-2">大規模ネットワーク、VPC 全体</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm">
            AWS や Google Cloud (GCP) で VPC
            ネットワークを設計する際、サブネットの範囲を決めるために CIDR
            計算は必須です。
            <br />
            特に、VPC ピアリングや VPN 接続を行う場合は、IP
            アドレス範囲の重複（Conflict）を避けるために正確な設計が求められます。
          </p>
        </div>
      </div>
    </div>
  );
}

// 結果表示用の小コンポーネント
const ResultRow = ({
  label,
  value,
  highlight = false,
  //   copyable = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  copyable?: boolean;
}) => (
  <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700">
    <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
    <span
      className={`font-mono font-medium ${highlight ? "text-indigo-600 dark:text-indigo-400 text-lg" : "text-gray-900 dark:text-white"}`}
    >
      {value}
    </span>
  </div>
);
