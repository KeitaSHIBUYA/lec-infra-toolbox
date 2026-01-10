export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          お問い合わせ
        </h1>
        <p className="mt-4 text-gray-500 dark:text-gray-400">
          バグ報告や機能リクエスト、お仕事のご相談はこちらからお願いいたします。
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg overflow-hidden">
        {/* Googleフォームの埋め込み */}
        <iframe
          src="https://forms.gle/5Fn9agiMUwCEBtQJ7"
          width="100%"
          height="800"
          className="w-full border-0"
          title="お問い合わせフォーム"
        >
          読み込んでいます…
        </iframe>
      </div>
    </div>
  );
}
