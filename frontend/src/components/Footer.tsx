export const Footer = () => {
  return (
    <footer className="bg-gray-800 dark:bg-gray-950 text-white mt-auto transition-colors duration-200">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} lec-infra.com All rights
              reserved.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            <a
              href="/contact"
              className="text-gray-400 hover:text-white text-sm"
            >
              お問い合わせ
            </a>
            <a
              href="/privacy"
              className="text-gray-400 hover:text-white text-sm"
            >
              プライバシーポリシー
            </a>
            <a
              href="/terms"
              className="text-gray-400 hover:text-white text-sm"
            >
              利用規約
            </a>
            <a
              href="/disclaimer"
              className="text-gray-400 hover:text-white text-sm"
            >
              免責事項
            </a>
            <a
              href="/changelog"
              className="text-gray-400 hover:text-white text-sm"
            >
              更新履歴
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
