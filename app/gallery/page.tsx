'use client';

import { useEffect, useState } from 'react';
import VideoCard from '@/components/VideoCard';
import { VideoHistoryItem } from '@/lib/types';

export default function GalleryPage() {
  const [history, setHistory] = useState<VideoHistoryItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('videoHistory');
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch {
        setHistory([]);
      }
    }
  }, []);

  const handleDelete = (id: string) => {
    const updated = history.filter((item) => item.id !== id);
    setHistory(updated);
    localStorage.setItem('videoHistory', JSON.stringify(updated));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">我的作品集</h1>
          <p className="text-gray-400">
            共 {history.length} 个视频
          </p>
        </div>
        {history.length > 0 && (
          <button
            onClick={() => {
              localStorage.removeItem('videoHistory');
              setHistory([]);
            }}
            className="px-4 py-2 text-sm text-red-400 border border-red-400/30 rounded-lg hover:bg-red-400/10 transition-colors"
          >
            清空历史
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="text-center py-32">
          <div className="text-6xl mb-4">🎬</div>
          <h2 className="text-xl font-semibold mb-2">还没有作品</h2>
          <p className="text-gray-400 mb-8">去生成你的第一个 AI 视频吧</p>
          <a
            href="/generate"
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-medium hover:opacity-90 transition-opacity"
          >
            开始创作
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {history.map((item) => (
            <VideoCard key={item.id} item={item} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
