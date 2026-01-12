// src/app/disclaimer/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "免責事項 | lec-infra",
  description: "lec-infraの免責事項について説明しています。",
};

export default function DisclaimerPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        免責事項
      </h1>

      <div className="prose prose-indigo dark:prose-invert text-gray-600 dark:text-gray-300">
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            計算結果・ツール出力について
          </h2>
          <p>
            当サイトで提供するツール（GCP コスト計算機、CIDR 計算機、Cron シミュレーター、SSL 証明書チェッカー等）の計算結果や出力は、参考情報として提供しています。
          </p>
          <p className="mt-2">
            計算結果の正確性については細心の注意を払っておりますが、以下の点についてご了承ください：
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>
              クラウドサービスの料金は、為替変動や料金改定により実際の請求額と異なる場合があります。
            </li>
            <li>
              計算結果は概算であり、実際のサービス利用時には公式の料金計算ツールや見積もりをご確認ください。
            </li>
            <li>
              ツールの出力結果に基づく判断・行動はユーザーご自身の責任で行ってください。
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            情報の正確性について
          </h2>
          <p>
            当サイトに掲載されている情報は、掲載時点での正確性を期しておりますが、
            技術の進歩やサービスの変更により、内容が古くなっている可能性があります。
          </p>
          <p className="mt-2">
            最新の情報については、各サービスの公式ドキュメントをご参照ください。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            損害について
          </h2>
          <p>
            当サイトの利用により生じた損害について、運営者は一切の責任を負いません。
            これには以下が含まれますが、これらに限定されません：
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>ツールの計算結果に基づく意思決定による損害</li>
            <li>サービスの中断・停止による損害</li>
            <li>データの損失や破損</li>
            <li>第三者との間で生じたトラブル</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            外部リンクについて
          </h2>
          <p>
            当サイトから外部サイトへのリンクを設置している場合がありますが、
            リンク先のサイトの内容について運営者は責任を負いません。
            リンク先のサイトは、それぞれのサイトの利用規約・プライバシーポリシーをご確認ください。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            サービスの変更・終了について
          </h2>
          <p>
            運営者は、事前の通知なく当サイトのサービス内容を変更、または終了する場合があります。
            サービスの変更・終了によりユーザーに生じた損害について、運営者は責任を負いません。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            推奨環境について
          </h2>
          <p>
            当サイトは、最新版のモダンブラウザ（Chrome、Firefox、Safari、Edge等）での利用を推奨しています。
            古いブラウザでは、一部の機能が正常に動作しない場合があります。
          </p>
        </section>

        <p className="text-sm text-gray-500 dark:text-gray-400 mt-8">
          制定日：2025年1月12日
        </p>
      </div>
    </div>
  );
}
