import Link from "next/link";

export const Header = () => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <span className="font-bold text-xl text-indigo-600 tracking-tight">
                Lec-Infra
              </span>
              <span className="ml-2 text-sm text-gray-500 hidden sm:block">
                SRE のためのツールボックス
              </span>
            </Link>
          </div>
          <nav className="flex space-x-4">
            <Link
              href="/"
              className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Home
            </Link>
            {/* 将来的に AboutページやGitHubリンクなどをここに追加 */}
          </nav>
        </div>
      </div>
    </header>
  );
};
