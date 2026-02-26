'use client';

import { useState } from 'react';
import { VideoHistoryItem } from '@/lib/types';
import VideoPlayer from './VideoPlayer';

interface VideoCardProps {
  item: VideoHistoryItem;
  onDelete: (id: string) => void;
}

export default function VideoCard({ item, onDelete }: VideoCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-[#111111] border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-colors">
      {expanded ? (
        <div className="p-4 space-y-3">
          <VideoPlayer url={item.videoUrl} />
          <button
            onClick={() => setExpanded(false)}
            className="text-sm text-gray-400 hover:text-white"
          >
            ← 收起
          </button>
        </div>
      ) : (
        <>
          <button
            onClick={() => setExpanded(true)}
            className="w-full aspect-video bg-gradient-to-br from-blue-900/30 to-purple-900/30 flex items-center justify-center hover:from-blue-900/50 hover:to-purple-900/50 transition-colors"
          >
            <span className="text-4xl">▶️</span>
          </button>
          <div className="p-4">
            <p className="text-sm text-gray-300 line-clamp-2 mb-2">{item.prompt || '（无提示词）'}</p>
            <div className="flex flex-wrap gap-1 mb-3">
              <span className="text-xs bg-white/5 px-2 py-0.5 rounded text-gray-500">
                {item.params.aspectRatio}
              </span>
              <span className="text-xs bg-white/5 px-2 py-0.5 rounded text-gray-500">
                {item.params.duration}s
              </span>
              <span className="text-xs bg-white/5 px-2 py-0.5 rounded text-gray-500">
                {item.params.resolution}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">
                {new Date(item.createdAt).toLocaleString('zh-CN')}
              </span>
              <button
                onClick={() => onDelete(item.id)}
                className="text-xs text-red-400 hover:text-red-300"
              >
                删除
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
