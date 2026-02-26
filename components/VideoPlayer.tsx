'use client';

import { useRef, useState } from 'react';

interface VideoPlayerProps {
  url: string;
}

export default function VideoPlayer({ url }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isBase64, _] = useState(() => !url.startsWith('http'));

  const src = isBase64 ? `data:video/mp4;base64,${url}` : url;

  return (
    <div className="bg-[#111111] border border-white/10 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <h3 className="font-semibold">生成结果</h3>
        <a
          href={src}
          download="veo-video.mp4"
          className="px-3 py-1.5 text-sm bg-white/10 rounded-lg hover:bg-white/15 transition-colors"
        >
          下载
        </a>
      </div>
      <div className="p-4">
        <video
          ref={videoRef}
          src={src}
          controls
          className="w-full rounded-lg bg-black"
          style={{ maxHeight: '480px' }}
        />
      </div>
    </div>
  );
}
