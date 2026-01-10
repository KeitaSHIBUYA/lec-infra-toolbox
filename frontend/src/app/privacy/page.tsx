// src/app/privacy/page.tsx
export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        プライバシーポリシー & 運営者情報
      </h1>

      <div className="prose prose-indigo dark:prose-invert text-gray-600 dark:text-gray-300">
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            運営者情報
          </h2>
          <p>
            <strong>サイト名:</strong> lec-infra
            <br />
            <strong>運営者:</strong> Keita SHIBUYA
            <br />
            <strong>お問い合わせ:</strong>{" "}
            <a
              href="https://forms.google.com/your-form-url"
              target="_blank"
              rel="nofollow"
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300"
            >
              お問い合わせフォーム（Coming Soon）
            </a>
            {/* GoogleフォームのURLを発行して貼るのが一番手軽でスパムも来ません */}
          </p>
          <p className="mt-2">
            当サイトは、現役 SRE
            エンジニアが開発・運営する、インフラ技術学習と実務効率化のためのツールボックスです。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            個人情報の利用目的
          </h2>
          <p>
            当サイトの計算機ツールに入力された数値データ（CPU
            数、メモリなど）は、利用者のブラウザ内でのみ処理され、サーバーに送信・保存されることはありません。
            <br />
            お問い合わせの際に取得したお名前、メールアドレス等の個人情報は、お問い合わせへの回答のみに利用いたします。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            広告について
          </h2>
          <p>
            当サイトでは、第三者配信の広告サービス（Google
            AdSense）を利用しています。
            <br />
            このような広告配信事業者は、ユーザーの興味に応じた商品やサービスの広告を表示するため、当サイトや他サイトへのアクセスに関する情報
            『Cookie』(氏名、住所、メール アドレス、電話番号は含まれません)
            を使用することがあります。
          </p>
        </section>
      </div>
    </div>
  );
}
