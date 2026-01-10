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
    id: "cron-generator",
    title: "Cron 式ジェネレーター",
    description: "複雑な Cron スケジュール式を生成・解説・テストできます。",
    icon: "⏰",
    href: "#",
    status: "Coming Soon",
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
    </div>
  );
}
