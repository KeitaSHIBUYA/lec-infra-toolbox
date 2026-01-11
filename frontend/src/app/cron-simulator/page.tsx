"use client";

import LinkCard from "@/components/LinkCard";
import parser from "cron-parser";
import cronstrue from "cronstrue/i18n";
import { useMemo, useState } from "react";

export default function CronPage() {
  // 初期値: 毎日午前9時
  const [expression, setExpression] = useState("0 9 * * *");

  // よく使うプリセット
  const presets = [
    { label: "毎分", value: "* * * * *" },
    { label: "5分おき", value: "*/5 * * * *" },
    { label: "毎時0分", value: "0 * * * *" },
    { label: "毎日 09:00", value: "0 9 * * *" },
    { label: "平日 09:00", value: "0 9 * * 1-5" },
    { label: "毎月1日 12:00", value: "0 12 1 * *" },
  ];

  // expression から派生する値は useMemo で計算
  const { description, nextRuns, error } = useMemo(() => {
    if (!expression) {
      return { description: "", nextRuns: [] as string[], error: "" };
    }

    try {
      // 1. 日本語での解説生成
      const desc = cronstrue.toString(expression, { locale: "ja" });

      // 2. 次回実行予定の計算 (向こう5回分)
      const interval = parser.parse(expression);
      const runs: string[] = [];
      for (let i = 0; i < 5; i++) {
        // toDate() でDate オブジェクトにし、toLocaleString() でJST表示などをフォーマット
        runs.push(
          interval.next().toDate().toLocaleString("ja-JP", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            weekday: "short",
          }),
        );
      }
      return { description: desc, nextRuns: runs, error: "" };
    } catch {
      // 入力途中などはエラーになるので、UI 上は優しく扱う
      return {
        description: "",
        nextRuns: [] as string[],
        error: "Cron 式の形式が正しくありません",
      };
    }
  }, [expression]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Cron 式 シミュレーター
          </h1>
          <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
            複雑な Cron スケジュールを日本語で解説し、
            直近の実行予定時刻をシミュレーションします。
            <br />
            よく使うパターンをプリセットとして用意しています。
          </p>
        </div>

        {/* ツール本体 */}
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden mb-12 border border-gray-200 dark:border-gray-700">
          <div className="p-6 sm:p-10">
            {/* 入力フォーム */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cron 式を入力
              </label>
              <input
                type="text"
                value={expression}
                onChange={(e) => setExpression(e.target.value)}
                className="block w-full text-2xl sm:text-3xl px-4 py-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 font-mono tracking-widest text-center shadow-inner bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="* * * * *"
              />
              {/* 凡例 */}
              <div className="mt-2 text-xs text-gray-400 dark:text-gray-500 font-mono text-center flex justify-center gap-4 sm:gap-8">
                <span>分</span>
                <span>時</span>
                <span>日</span>
                <span>月</span>
                <span>曜</span>
              </div>
            </div>

            {/* プリセットボタン */}
            <div className="flex flex-wrap gap-2 justify-center mb-10">
              {presets.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => setExpression(preset.value)}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium transition-colors border border-gray-200 dark:border-gray-600"
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* 結果表示エリア */}
            <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-xl p-6 sm:p-8">
              {error ? (
                <div className="text-center text-red-500 dark:text-red-400 font-medium flex items-center justify-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {error}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* 左: 解説 */}
                  <div>
                    <h3 className="text-xs font-semibold text-indigo-500 dark:text-indigo-400 uppercase tracking-wider mb-2">
                      スケジュール解説
                    </h3>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white leading-tight">
                      {description}
                    </p>
                    <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                      現在時刻で設定した場合の解釈です。
                      <br />
                      システム設定時はタイムゾーン（JST/UTC）にご注意ください。
                    </p>
                  </div>

                  {/* 右: 次回実行予定 */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-sm border border-indigo-100 dark:border-indigo-800">
                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                      直近の実行予定 (Next Runs)
                    </h3>
                    <ul className="space-y-2">
                      {nextRuns.map((run, idx) => (
                        <li
                          key={idx}
                          className="flex items-center text-sm font-mono text-gray-700 dark:text-gray-300"
                        >
                          <span className="w-6 text-indigo-400 font-bold">
                            {idx + 1}.
                          </span>
                          {run}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SEO / 解説コンテンツ */}
        <div className="prose prose-lg text-gray-500 dark:text-gray-400 mx-auto mt-16 border-t border-gray-200 dark:border-gray-700 pt-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Cron（クーロン）の設定方法
          </h2>
          <p>
            Cron は、Unix 系 OS
            でコマンドを定時実行するためのデーモンプロセスです。
            <br />
            <code className="dark:bg-gray-700 dark:text-gray-300">
              crontab -e
            </code>{" "}
            コマンドで編集し、以下の 5
            つのフィールドでスケジュールを指定します。
          </p>

          <div className="bg-gray-800 text-gray-200 p-4 rounded-lg font-mono text-sm my-6 overflow-x-auto">
            <pre className="whitespace-pre">
              {`# ┌───────────── 分 (0 - 59)
# │ ┌───────────── 時 (0 - 23)
# │ │ ┌───────────── 日 (1 - 31)
# │ │ │ ┌───────────── 月 (1 - 12)
# │ │ │ │ ┌───────────── 曜日 (0 - 6) (0=日曜)
# │ │ │ │ │
# * * * * * command_to_execute`}
            </pre>
          </div>

          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-6 mb-3">
            よくある設定例
          </h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong className="dark:text-gray-300">*/5 * * * *</strong> : 5
              分ごとに実行（ログローテーション監視など）
            </li>
            <li>
              <strong className="dark:text-gray-300">0 4 * * *</strong> :
              毎日早朝 4 時に実行（日次バッチ処理、バックアップ）
            </li>
            <li>
              <strong className="dark:text-gray-300">0 9 * * 1</strong> :
              毎週月曜日の朝 9 時に実行（週次レポート送信）
            </li>
          </ul>

          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-6 mb-3">
            Cloud Scheduler (Google Cloud) での注意点
          </h3>
          <p>
            Google Cloud Scheduler や Cloud Run Jobs
            のスケジュール設定も、基本的にはこの Cron 構文に準拠しています。
            <br />
            ただし、App Engine Cron (`cron.yaml`)
            など一部のサービスでは記述方法が異なる場合があるため、公式ドキュメントを確認することをお勧めします。
          </p>
          {/* 公式ドキュメントへのリンクカード */}
          <LinkCard url="https://cloud.google.com/scheduler/docs/creating?hl=ja" />
          <LinkCard url="https://docs.cloud.google.com/appengine/docs/standard/scheduling-jobs-with-cron-yaml?hl=ja" />
        </div>
      </div>
    </div>
  );
}
