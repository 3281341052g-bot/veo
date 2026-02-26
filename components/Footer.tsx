export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-8 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <span className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center text-xs font-bold text-white">
            V
          </span>
          <span>Veo AI 视频生成平台</span>
        </div>
        <p className="text-gray-500 text-sm">
          Powered by Google Vertex AI Veo 3 &copy; {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
