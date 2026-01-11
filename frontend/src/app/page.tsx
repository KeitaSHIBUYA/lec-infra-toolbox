import Image from "next/image";
import Link from "next/link";

// ツールの定義（増えたらここに追加するだけでカードが増えます）
const tools = [
  {
    id: "gcp-cost-calc",
    title: "GCP 簡易コスト計算機",
    description:
      "Cloud Run, Cloud SQL などの概算コストを日本円ですばやく計算できます。",
    icon: "💰",
    href: "/gcp-cost-calc",
    status: "Beta",
  },
  {
    id: "cidr-calc",
    title: "CIDR / サブネット計算機",
    description:
      "IP アドレス範囲からネットマスク、ホスト数、IP レンジを可視化します。",
    icon: "🌐",
    href: "/cidr-calc",
    status: "Beta",
  },
  {
    id: "cron-simulator",
    title: "Cron シミュレーター",
    description:
      "複雑な Cron スケジュール式を日本語で解説し、直近の実行予定時刻をシミュレーションできます。",
    icon: "⏰",
    href: "/cron-simulator",
    status: "Beta",
  },
];

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
          SRE{" "}
          <span className="text-indigo-600 dark:text-indigo-400">Toolbox</span>
        </h1>
        <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500 dark:text-gray-400">
          SRE・インフラエンジニアの「面倒くさい」を解消する
          <br />
          シンプルで高速なツール集
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <div
            key={tool.id}
            className="relative bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg hover:shadow-md dark:shadow-gray-900/50 transition-shadow duration-300"
          >
            <div className="p-6">
              <div className="flex items-center">
                <div className="text-4xl mr-4">{tool.icon}</div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    <Link href={tool.href} className="focus:outline-none">
                      <span className="absolute inset-0" aria-hidden="true" />
                      {tool.title}
                    </Link>
                  </h3>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      tool.status === "Beta"
                        ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                    }`}
                  >
                    {tool.status}
                  </span>
                </div>
              </div>
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                {tool.description}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-4">
              <div className="text-sm">
                <Link
                  href={tool.href}
                  className={`font-medium ${
                    tool.status === "Coming Soon"
                      ? "text-gray-400 dark:text-gray-500 cursor-not-allowed pointer-events-none"
                      : "text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300"
                  }`}
                >
                  ツールを使う <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Author Section */}
      <div className="mt-20 border-t border-gray-200 dark:border-gray-700 pt-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            About the Author
          </h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            このツールを作った人
          </p>
        </div>

        <a
          href="https://portfolio.lec-infra.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="block max-w-2xl mx-auto"
        >
          <div className="relative border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:border-indigo-300 dark:hover:border-indigo-600">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 rounded-full overflow-hidden shadow-lg ring-2 ring-indigo-500/50">
                    <Image
                      src="/author.jpg"
                      alt="Keita SHIBUYA"
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Keita SHIBUYA
                  </h3>
                  <p className="text-indigo-600 dark:text-indigo-400 font-medium">
                    SRE Engineer - Specialist
                  </p>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Google Cloud を活用した大規模システムの設計・運用に携わる
                    SRE エンジニア。
                    <br className="hidden sm:block" />
                    可用性・スケーラビリティ・パフォーマンスの最適化が得意分野です。
                  </p>
                  <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200">
                      Google Cloud
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200">
                      Terraform
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200">
                      Kubernetes
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0 text-indigo-500 dark:text-indigo-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </a>

        <p className="mt-6 text-center text-sm text-gray-400 dark:text-gray-500">
          ポートフォリオサイトで詳しい経歴・スキル・プロジェクト実績をご覧いただけます
        </p>
      </div>
    </div>
  );
}
