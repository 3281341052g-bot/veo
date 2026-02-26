import Link from 'next/link';
import FeatureCard from '@/components/FeatureCard';

const features = [
  {
    icon: '🎬',
    title: '文本生成视频',
    description: '用自然语言描述你的创意，AI 将其转化为流畅的高清视频',
  },
  {
    icon: '🖼️',
    title: '图片生成视频',
    description: '上传静态图片，让 AI 为其注入生命和动感',
  },
  {
    icon: '🎵',
    title: '智能音频',
    description: '自动生成与视频内容相匹配的背景音效和音乐',
  },
  {
    icon: '⚡',
    title: '高质量输出',
    description: '支持 720p / 1080p 分辨率，16:9 / 9:16 比例',
  },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-[#0a0a0a]">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-purple-900/20" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-8 text-sm text-gray-400">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            由 Google Vertex AI Veo 3 驱动
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent leading-tight">
            Veo
            <br />
            AI 视频生成平台
          </h1>

          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            借助 Google 最先进的视频生成 AI 技术，只需输入文字描述或上传图片，
            即可在几分钟内生成高质量的专业视频内容。
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/generate"
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity"
            >
              开始创作
            </Link>
            <Link
              href="/gallery"
              className="px-8 py-4 bg-white/10 border border-white/20 rounded-xl font-semibold text-lg hover:bg-white/15 transition-colors"
            >
              查看作品集
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">强大功能，无限创意</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Veo 平台提供全方位的 AI 视频生成能力，让每个人都能成为视频创作者
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 border border-white/10 rounded-2xl p-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">准备好开始了吗？</h2>
            <p className="text-gray-400 text-lg mb-8">
              立即体验 AI 视频生成的魔力，将你的创意变为现实
            </p>
            <Link
              href="/generate"
              className="inline-block px-10 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity"
            >
              免费开始创作
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
