// GCP コスト計算ユーティリティ

// --- 定数定義 (東京リージョン: asia-northeast1 近似値) ---
export const USD_JPY = 150; // 1ドル150円換算

export const PRICING = {
  cloudRun: {
    cpu: 0.000024, // USD per vCPU-second
    memory: 0.0000025, // USD per GB-second
    request: 0.4, // USD per million requests
    freeTier: {
      cpuSeconds: 180000,
      memorySeconds: 360000, // GB-seconds
      requests: 2000000,
    },
  },
  cloudSql: {
    // Enterprise edition, Single zone pricing approx
    micro: 0.013, // db-f1-micro (USD/hour)
    small: 0.026, // db-g1-small (USD/hour)
    medium: 0.052, // db-n1-standard-1 (approx)
    storage: 0.17, // USD per GB/month
  },
} as const;

export type SqlInstanceType = "micro" | "small" | "medium";

export interface CloudRunParams {
  cpu: number; // vCPU 数
  memory: number; // GB
  requests: number; // 月間リクエスト数
  duration: number; // ミリ秒/リクエスト
}

export interface CloudSqlParams {
  enabled: boolean;
  type: SqlInstanceType;
  storageGb: number;
}

export interface CostResult {
  run: number; // Cloud Run 月額コスト (JPY)
  sql: number; // Cloud SQL 月額コスト (JPY)
  total: number; // 合計月額コスト (JPY)
  currency: "JPY";
}

/**
 * Cloud Run のコストを計算
 * @param params Cloud Run のパラメータ
 * @returns USD でのコスト
 */
export function calculateCloudRunCost(params: CloudRunParams): number {
  const { cpu, memory, requests, duration } = params;

  // 総処理時間 (秒) = リクエスト数 * (実行時間ms / 1000)
  const totalSeconds = requests * (duration / 1000);

  // vCPU秒とメモリGB秒
  const vCpuSeconds = totalSeconds * cpu;
  const memoryGbSeconds = totalSeconds * memory;

  // 無料枠の適用 (マイナスにならないようにMath.max)
  const billableCpu = Math.max(
    0,
    vCpuSeconds - PRICING.cloudRun.freeTier.cpuSeconds,
  );
  const billableMem = Math.max(
    0,
    memoryGbSeconds - PRICING.cloudRun.freeTier.memorySeconds,
  );
  const billableReq = Math.max(
    0,
    requests - PRICING.cloudRun.freeTier.requests,
  );

  // ドル建て計算
  const costUsd =
    billableCpu * PRICING.cloudRun.cpu +
    billableMem * PRICING.cloudRun.memory +
    (billableReq / 1000000) * PRICING.cloudRun.request;

  return costUsd;
}

/**
 * Cloud SQL のコストを計算
 * @param params Cloud SQL のパラメータ
 * @returns USD でのコスト
 */
export function calculateCloudSqlCost(params: CloudSqlParams): number {
  if (!params.enabled) {
    return 0;
  }

  const hoursPerMonth = 730; // 平均月間時間
  let hourlyRate = 0;

  switch (params.type) {
    case "micro":
      hourlyRate = PRICING.cloudSql.micro;
      break;
    case "small":
      hourlyRate = PRICING.cloudSql.small;
      break;
    case "medium":
      hourlyRate = PRICING.cloudSql.medium;
      break;
  }

  return (
    hourlyRate * hoursPerMonth + params.storageGb * PRICING.cloudSql.storage
  );
}

/**
 * GCP の総コストを計算
 * @param runParams Cloud Run のパラメータ
 * @param sqlParams Cloud SQL のパラメータ
 * @returns JPY での計算結果
 */
export function calculateTotalGcpCost(
  runParams: CloudRunParams,
  sqlParams: CloudSqlParams,
): CostResult {
  const runCostUsd = calculateCloudRunCost(runParams);
  const sqlCostUsd = calculateCloudSqlCost(sqlParams);

  return {
    run: Math.round(runCostUsd * USD_JPY),
    sql: Math.round(sqlCostUsd * USD_JPY),
    total: Math.round((runCostUsd + sqlCostUsd) * USD_JPY),
    currency: "JPY",
  };
}
