"use client";

import LinkCard from "@/components/LinkCard";
import { getAppCheck } from "@/lib/firebase";
import {
  formatSslDate,
  getSslStatus,
  getSslStatusColorClass,
  type SslResult,
} from "@/lib/ssl";
import { getToken } from "firebase/app-check";
import React, { useState } from "react";

export default function SslPage() {
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SslResult | null>(null);
  const [error, setError] = useState("");

  const checkSsl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(
        `/api/ssl-cert-checker?domain=${encodeURIComponent(domain)}`,
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to check SSL");
      }
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            SSL 証明書 チェッカー
          </h1>
          <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
            ドメインを入力するだけで、SSL 証明書の有効期限、
            <br />
            発行元、更新までの残り日数をチェックします。
          </p>
        </div>

        {/* 入力フォーム */}
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden mb-8 p-6 sm:p-8">
          <form onSubmit={checkSsl} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-grow">
              <label htmlFor="domain" className="sr-only">
                ドメイン
              </label>
              <input
                id="domain"
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="example.com"
                className="block w-full text-lg px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`inline-flex justify-center items-center px-6 py-3 border border-transparent text-lg font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 ${loading ? "opacity-75 cursor-not-allowed" : ""}`}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  確認中...
                </>
              ) : (
                "チェック"
              )}
            </button>
          </form>
          {error && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-md border border-red-200 dark:border-red-800">
              {error}
            </div>
          )}
        </div>

        {/* 結果表示 */}
        {result && (
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 animate-fade-in">
            {/* ステータスヘッダー */}
            <div
              className={`p-6 text-white ${getSslStatusColorClass(getSslStatus(result.daysRemaining))}`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium opacity-80 uppercase tracking-wider">
                    Status
                  </p>
                  <p className="text-3xl font-bold">
                    {result.daysRemaining > 0
                      ? "有効 (Valid)"
                      : "期限切れ (Expired)"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium opacity-80">残り日数</p>
                  <p className="text-4xl font-extrabold">
                    {result.daysRemaining}{" "}
                    <span className="text-lg font-normal">日</span>
                  </p>
                </div>
              </div>
            </div>

            {/* 詳細情報 */}
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6 bg-gray-50 dark:bg-gray-900">
              <div className="bg-white dark:bg-gray-800 p-4 rounded border border-gray-200 dark:border-gray-700">
                <span className="text-xs text-gray-500 dark:text-gray-400 uppercase block mb-1">
                  Common Name (CN)
                </span>
                <span className="text-lg font-mono font-medium text-gray-900 dark:text-white break-all">
                  {result.subject}
                </span>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded border border-gray-200 dark:border-gray-700">
                <span className="text-xs text-gray-500 dark:text-gray-400 uppercase block mb-1">
                  Issuer (発行元)
                </span>
                <span className="text-lg font-medium text-gray-900 dark:text-white">
                  {result.issuer}
                </span>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded border border-gray-200 dark:border-gray-700">
                <span className="text-xs text-gray-500 dark:text-gray-400 uppercase block mb-1">
                  有効開始日
                </span>
                <span className="text-gray-900 dark:text-white">
                  {formatSslDate(result.validFrom)}
                </span>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded border border-gray-200 dark:border-gray-700">
                <span className="text-xs text-gray-500 dark:text-gray-400 uppercase block mb-1">
                  有効期限
                </span>
                <span
                  className={`font-bold ${result.daysRemaining < 30 ? "text-red-600 dark:text-red-400" : "text-gray-900 dark:text-white"}`}
                >
                  {formatSslDate(result.validTo)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 解説コンテンツ */}
        <div className="prose prose-lg dark:prose-invert text-gray-500 dark:text-gray-400 mx-auto mt-16 border-t border-gray-200 dark:border-gray-700 pt-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            💡 Tips
          </h2>
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">
            SSL 証明書の更新忘れを防ぐには
          </h3>
          <p>
            SSL
            証明書の有効期限切れは、サービスダウンやユーザーの信頼失墜に直結する重大なインシデントです。
            近年は Let&apos;s Encrypt
            などの自動更新が普及していますが、更新バッチの失敗などで「気づいたら切れていた」という事故は後を絶ちません。
          </p>
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-6 mb-3">
            SRE としての監視ポイント
          </h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>外形監視でのチェック:</strong> Cloud Monitoring の Uptime
              Check や Datadog Synthetics には、SSL
              証明書の期限を監視する機能が標準で備わっています
              <LinkCard url="https://docs.cloud.google.com/monitoring/uptime-checks?hl=ja" />
            </li>
            <li>
              <strong>有効期限の閾値:</strong> 一般的には「残り 30 日」や「残り
              7 日」などで アラートを発報するように設定すると良いでしょう
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
