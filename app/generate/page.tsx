'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import PromptInput from '@/components/PromptInput';
import ParameterPanel from '@/components/ParameterPanel';
import ImageUploader from '@/components/ImageUploader';
import GenerationStatus from '@/components/GenerationStatus';
import VideoPlayer from '@/components/VideoPlayer';
import { GenerationParams, GenerationStatus as IGenerationStatus } from '@/lib/types';

type Tab = 'text' | 'image';

const defaultParams: GenerationParams = {
  aspectRatio: '16:9',
  duration: 5,
  resolution: '720p',
  generateAudio: true,
};

export default function GeneratePage() {
  const [activeTab, setActiveTab] = useState<Tab>('text');
  const [prompt, setPrompt] = useState('');
  const [params, setParams] = useState<GenerationParams>(defaultParams);
  const [imageData, setImageData] = useState<string>('');
  const [imageMimeType, setImageMimeType] = useState<string>('');
  const [status, setStatus] = useState<IGenerationStatus>({ status: 'pending' });
  const [isGenerating, setIsGenerating] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => stopPolling();
  }, [stopPolling]);

  const pollStatus = useCallback(
    async (operationName: string) => {
      const interval = setInterval(async () => {
        try {
          const res = await fetch(
            `/api/check-status?operationName=${encodeURIComponent(operationName)}`
          );
          const data = await res.json();

          if (data.status === 'completed') {
            setStatus({ status: 'completed', videoUrl: data.videoUrl, operationName });
            setIsGenerating(false);
            stopPolling();

            // Save to localStorage
            if (data.videoUrl) {
              const history = JSON.parse(localStorage.getItem('videoHistory') || '[]');
              history.unshift({
                id: Date.now().toString(),
                prompt,
                params,
                videoUrl: data.videoUrl,
                createdAt: new Date().toISOString(),
              });
              localStorage.setItem('videoHistory', JSON.stringify(history.slice(0, 50)));
            }
          } else if (data.status === 'failed') {
            setStatus({ status: 'failed', error: data.error });
            setIsGenerating(false);
            stopPolling();
          } else {
            setStatus({ status: 'processing', operationName });
          }
        } catch {
          setStatus({ status: 'failed', error: '状态查询失败' });
          setIsGenerating(false);
          stopPolling();
        }
      }, 5000);

      pollingIntervalRef.current = interval;
    },
    [prompt, params, stopPolling]
  );

  const handleGenerate = async () => {
    if (!prompt.trim() && activeTab === 'text') return;
    if (!imageData && activeTab === 'image') return;

    setIsGenerating(true);
    setStartTime(Date.now());
    setStatus({ status: 'processing' });

    try {
      const res = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          params,
          ...(activeTab === 'image' && imageData
            ? { imageData, imageMimeType }
            : {}),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus({ status: 'failed', error: data.error || '生成失败' });
        setIsGenerating(false);
        return;
      }

      setStatus({ status: 'processing', operationName: data.operationName });
      pollStatus(data.operationName);
    } catch {
      setStatus({ status: 'failed', error: '请求失败，请检查网络连接' });
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    stopPolling();
    setStatus({ status: 'pending' });
    setIsGenerating(false);
    setStartTime(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">AI 视频生成</h1>
        <p className="text-gray-400">输入提示词，让 AI 为你创作精彩视频</p>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-1 bg-white/5 rounded-xl p-1 w-fit mb-8">
        {(['text', 'image'] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
              activeTab === tab
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab === 'text' ? '文本生成视频' : '图片生成视频'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - inputs */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'image' && (
            <ImageUploader onImageUploaded={(base64, mimeType) => {
              setImageData(base64);
              setImageMimeType(mimeType);
            }} />
          )}

          <PromptInput
            value={prompt}
            onChange={setPrompt}
            placeholder={
              activeTab === 'text'
                ? '描述你想生成的视频内容，例如：一只橙色的猫咪在阳光明媚的花园里慵懒地打滚...'
                : '（可选）描述图片中的动作或场景变化...'
            }
          />

          <button
            onClick={handleGenerate}
            disabled={isGenerating || (!prompt.trim() && activeTab === 'text') || (!imageData && activeTab === 'image')}
            className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
          >
            {isGenerating ? '生成中...' : '开始生成'}
          </button>

          {status.status !== 'pending' && (
            <GenerationStatus status={status} onReset={handleReset} startTime={startTime} />
          )}

          {status.status === 'completed' && status.videoUrl && (
            <VideoPlayer url={status.videoUrl} />
          )}
        </div>

        {/* Right column - parameters */}
        <div>
          <ParameterPanel params={params} onChange={setParams} />
        </div>
      </div>
    </div>
  );
}
