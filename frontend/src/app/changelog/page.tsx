// src/app/changelog/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "更新履歴 | lec-infra",
  description: "lec-infra の更新履歴・リリースノートです。",
};

type ChangelogEntry = {
  date: string;
  version?: string;
  changes: {
    type: "new" | "update" | "fix" | "remove";
    description: string;
  }[];
};

const changelog: ChangelogEntry[] = [
  {
    date: "2025-01-12",
    version: "1.1.0",
    changes: [
      { type: "new", description: "SSL 証明書チェッカーを追加" },
      { type: "new", description: "利用規約ページを追加" },
      { type: "new", description: "更新履歴ページを追加" },
      { type: "new", description: "免責事項ページを追加" },
    ],
  },
  {
    date: "2025-01-01",
    version: "1.0.0",
    changes: [
      { type: "new", description: "サイト公開" },
      { type: "new", description: "GCP コスト計算機を追加" },
      { type: "new", description: "CIDR / サブネット計算機を追加" },
      { type: "new", description: "Cron シミュレーターを追加" },
    ],
  },
];

const typeLabels: Record<
  ChangelogEntry["changes"][number]["type"],
  { label: string; color: string }
> = {
  new: {
    label: "NEW",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  },
  update: {
    label: "UPDATE",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  },
  fix: {
    label: "FIX",
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  },
  remove: {
    label: "REMOVE",
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  },
};

export default function ChangelogPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        更新履歴
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        lec-infra の機能追加・改善・修正の履歴です。
      </p>

      <div className="space-y-8">
        {changelog.map((entry) => (
          <div
            key={entry.version || entry.date}
            className="border-l-4 border-indigo-500 pl-4 py-2"
          >
            <div className="flex items-center gap-3 mb-3">
              <time className="text-lg font-semibold text-gray-900 dark:text-white">
                {entry.date}
              </time>
              {entry.version && (
                <span className="px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300 rounded">
                  v{entry.version}
                </span>
              )}
            </div>
            <ul className="space-y-2">
              {entry.changes.map((change) => (
                <li key={change.description} className="flex items-start gap-2">
                  <span
                    className={`px-2 py-0.5 text-xs font-medium rounded ${typeLabels[change.type].color}`}
                  >
                    {typeLabels[change.type].label}
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">
                    {change.description}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
