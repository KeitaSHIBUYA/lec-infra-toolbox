// src/app/terms/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "利用規約 | lec-infra",
  description: "lec-infraの利用規約について説明しています。",
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        利用規約
      </h1>

      <div className="prose prose-indigo dark:prose-invert text-gray-600 dark:text-gray-300">
        <p className="mb-6">
          この利用規約（以下「本規約」）は、lec-infra（以下「当サイト」）の利用条件を定めるものです。
          当サイトをご利用いただく際は、本規約に同意いただいたものとみなします。
        </p>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            第1条（適用）
          </h2>
          <p>
            本規約は、ユーザーと当サイト運営者との間の当サイトの利用に関わる一切の関係に適用されるものとします。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            第2条（利用について）
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>当サイトは無料でご利用いただけます。</li>
            <li>アカウント登録は必要ありません。</li>
            <li>
              当サイトで提供するツールは、ブラウザ上で動作し、入力データは原則としてサーバーに送信されません。
            </li>
            <li>
              ただし、一部のツール（SSL 証明書チェッカーなど）は、機能上サーバーを経由する場合があります。
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            第3条（禁止事項）
          </h2>
          <p className="mb-2">
            ユーザーは、当サイトの利用にあたり、以下の行為をしてはなりません。
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>法令または公序良俗に違反する行為</li>
            <li>当サイトのサーバーまたはネットワークに過度な負荷をかける行為</li>
            <li>当サイトの運営を妨げる行為</li>
            <li>不正アクセスまたはそれを試みる行為</li>
            <li>当サイトのコンテンツを無断で複製・転載・再配布する行為</li>
            <li>その他、運営者が不適切と判断する行為</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            第4条（サービスの変更・停止）
          </h2>
          <p>
            運営者は、ユーザーへの事前通知なしに、当サイトのサービス内容を変更、または提供を停止することができるものとします。
            これによりユーザーに生じた損害について、運営者は一切の責任を負いません。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            第5条（知的財産権）
          </h2>
          <p>
            当サイトに掲載されているコンテンツ（テキスト、画像、ソースコード等）の著作権は、運営者または正当な権利を有する第三者に帰属します。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            第6条（規約の変更）
          </h2>
          <p>
            運営者は、必要と判断した場合には、ユーザーに通知することなく本規約を変更することができるものとします。
            変更後の利用規約は、当サイトに掲載した時点から効力を生じるものとします。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            第7条（準拠法・裁判管轄）
          </h2>
          <p>
            本規約の解釈にあたっては、日本法を準拠法とします。
            当サイトに関して紛争が生じた場合には、運営者の所在地を管轄する裁判所を専属的合意管轄とします。
          </p>
        </section>

        <p className="text-sm text-gray-500 dark:text-gray-400 mt-8">
          制定日：2025年1月12日
        </p>
      </div>
    </div>
  );
}
