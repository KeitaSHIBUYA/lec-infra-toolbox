"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type OgpData = {
  title: string;
  description: string;
  image: string | null;
  logo: string | null;
  publisher: string | null;
};

type LinkCardProps = {
  url: string;
};

export default function LinkCard({ url }: LinkCardProps) {
  const [ogpData, setOgpData] = useState<OgpData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOgp = async () => {
      try {
        // microlink.io の無料 API を使用して OGP 情報を取得
        const res = await fetch(
          `https://api.microlink.io?url=${encodeURIComponent(url)}`,
        );
        const data = await res.json();

        if (data.status === "success") {
          setOgpData({
            title: data.data.title || new URL(url).hostname,
            description: data.data.description || "",
            image: data.data.image?.url || null,
            logo: data.data.logo?.url || null,
            publisher: data.data.publisher || null,
          });
        } else {
          throw new Error("Failed to fetch OGP");
        }
      } catch {
        // フォールバック用のデータを設定
        const urlObj = new URL(url);
        setOgpData({
          title: urlObj.hostname,
          description: "",
          image: null,
          logo: `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=32`,
          publisher: urlObj.hostname,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOgp();
  }, [url]);

  const domain = new URL(url).hostname;

  if (loading) {
    return (
      <div className="not-prose flex items-stretch gap-0 mt-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 overflow-hidden animate-pulse">
        <div className="flex-1 p-4 space-y-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
        </div>
        <div className="w-32 sm:w-40 bg-gray-200 dark:bg-gray-700 flex-shrink-0" />
      </div>
    );
  }

  if (!ogpData) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="not-prose flex items-stretch gap-0 mt-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors shadow-sm hover:shadow-md overflow-hidden group"
    >
      {/* コンテンツ部分 */}
      <div className="flex-1 p-4 min-w-0 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 text-sm sm:text-base group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {ogpData.title}
          </h3>
          {ogpData.description && (
            <p className="mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
              {ogpData.description}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 mt-3">
          {ogpData.logo && (
            <Image
              src={ogpData.logo}
              alt=""
              width={16}
              height={16}
              className="flex-shrink-0 rounded"
              unoptimized
            />
          )}
          <span className="text-xs text-gray-400 dark:text-gray-500 truncate">
            {domain}
          </span>
        </div>
      </div>

      {/* OGP 画像 */}
      {ogpData.image && (
        <div className="w-32 sm:w-48 flex-shrink-0 bg-gray-100 dark:bg-gray-700 relative">
          <Image
            src={ogpData.image}
            alt=""
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      )}
    </a>
  );
}
