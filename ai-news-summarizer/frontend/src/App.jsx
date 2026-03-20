import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Sparkles,
  Clock,
  ExternalLink,
  TrendingUp,
  Newspaper,
  Moon,
  Sun,
  Zap,
  Copy,
  Check,
  RefreshCw,
  ArrowRight,
  Tag,
  Calendar,
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const API_URL = 'http://localhost:8000';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const gradientVariants = {
  light: 'from-blue-50 via-indigo-50 to-purple-50',
  dark: 'from-slate-900 via-slate-900 to-slate-900',
};

function App() {
  const [topic, setTopic] = useState('');
  const [articleCount, setArticleCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(true);
  const [copiedId, setCopiedId] = useState(null);

  const handleSummarize = async (e) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError('Please enter a topic');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch(`${API_URL}/summarize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, article_count: articleCount }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Failed to fetch');
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text, id) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const isDark = darkMode;

  // Sync dark mode class with document for tailwind dark: utilities
  if (typeof document !== 'undefined') {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  return (
    <div
      className={cn(
        'min-h-screen transition-all duration-500',
        isDark ? gradientVariants.dark : gradientVariants.light
      )}
    >
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b backdrop-blur-xl bg-opacity-80"
        style={{ background: isDark ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.8)', borderColor: isDark ? 'rgba(148, 163, 184, 0.1)' : 'rgba(0, 0, 0, 0.05)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span
                className={cn(
                  'text-xl font-bold',
                  isDark ? 'text-white' : 'text-gray-900'
                )}
              >
                AI News Summarizer
              </span>
            </motion.div>
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => setDarkMode(!darkMode)}
              className={cn(
                'relative inline-flex items-center justify-center p-2 rounded-xl transition-all duration-300',
                isDark
                  ? 'bg-slate-800 text-blue-400 hover:bg-slate-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              {!isDark ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </motion.button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1
            className={cn(
              'text-4xl sm:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r',
              isDark
                ? 'from-blue-400 via-purple-400 to-pink-400'
                : 'from-blue-600 via-purple-600 to-pink-600'
            )}
          >
            Stay Informed, Stay Ahead
          </h1>
          <p
            className={cn(
              'text-lg max-w-2xl mx-auto',
              isDark ? 'text-slate-400' : 'text-gray-600'
            )}
          >
            Get intelligent, AI-powered summaries of the latest news on any
            topic. Save time and never miss important updates.
          </p>
        </motion.div>

        {/* Search Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={cn(
            'max-w-3xl mx-auto mb-12 p-8 rounded-2xl shadow-2xl backdrop-blur-xl',
            isDark ? 'bg-slate-800/50' : 'bg-white/70'
          )}
        >
          <form onSubmit={handleSummarize} className="space-y-6">
            <div className="relative">
              <Search
                className={cn(
                  'absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors',
                  isDark ? 'text-slate-500' : 'text-gray-400'
                )}
              />
              <input
                type="text"
                className={cn(
                  'w-full pl-12 pr-4 py-4 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-4',
                  isDark
                    ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500 focus:ring-blue-500/20 focus:border-blue-500'
                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-blue-500/20 focus:border-blue-500'
                )}
                placeholder="Enter a topic (e.g., 'AI bots', 'climate change')"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-3">
                <label
                  className={cn(
                    'text-sm font-medium flex items-center gap-2',
                    isDark ? 'text-slate-400' : 'text-gray-600'
                  )}
                >
                  <Newspaper className="w-4 h-4" />
                  Articles: {articleCount}
                </label>
                <input
                  type="range"
                  min="3"
                  max="15"
                  value={articleCount}
                  onChange={(e) =>
                    setArticleCount(parseInt(e.target.value))
                  }
                  className="w-32 accent-blue-500"
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-8 py-4 rounded-xl font-semibold shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500 focus:ring-blue-500/30"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Summarize News
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>

        {/* Error State */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={cn(
                'max-w-3xl mx-auto mb-8 p-4 rounded-xl border-l-4',
                isDark
                  ? 'bg-red-900/20 border-red-500 text-red-400'
                  : 'bg-red-50 border-red-500 text-red-600'
              )}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Section */}
        <AnimatePresence>
          {result && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              {/* Overall Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className={cn(
                  'p-8 rounded-2xl shadow-xl backdrop-blur-xl border',
                  isDark
                    ? 'bg-slate-800/50 border-slate-700'
                    : 'bg-white/70 border-gray-100'
                )}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className={cn(
                      'w-12 h-12 rounded-xl flex items-center justify-center',
                      isDark
                        ? 'bg-blue-500/10 text-blue-400'
                        : 'bg-blue-100 text-blue-600'
                    )}
                  >
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div>
                    <h2
                      className={cn(
                        'text-2xl font-bold',
                        isDark ? 'text-white' : 'text-gray-900'
                      )}
                    >
                      Overview
                    </h2>
                    <p
                      className={cn(
                        'text-sm',
                        isDark ? 'text-slate-400' : 'text-gray-500'
                      )}
                    >
                      AI-generated summary
                    </p>
                  </div>
                </div>
                <p
                  className={cn(
                    'text-lg leading-relaxed',
                    isDark ? 'text-slate-300' : 'text-gray-700'
                  )}
                >
                  {result.overall_summary}
                </p>
              </motion.div>

              {/* Articles Grid */}
              <div className="grid gap-6">
                <div className="flex items-center gap-3">
                  <Newspaper className={cn('w-6 h-6', isDark ? 'text-blue-400' : 'text-blue-600')} />
                  <h3
                    className={cn(
                      'text-xl font-bold',
                      isDark ? 'text-white' : 'text-gray-900'
                    )}
                  >
                    Featured Articles
                  </h3>
                  <span
                    className={cn(
                      'px-3 py-1 rounded-full text-sm font-medium',
                      isDark
                        ? 'bg-slate-700 text-slate-300'
                        : 'bg-gray-100 text-gray-600'
                    )}
                  >
                    {result.articles.length} articles
                  </span>
                </div>

                <div className="grid gap-6">
                  {result.articles.map((article, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.1 }}
                      className={cn(
                        'group p-6 rounded-xl backdrop-blur-xl border transition-all duration-300 hover:shadow-lg',
                        isDark
                          ? 'bg-slate-800/30 border-slate-700/50 hover:border-slate-600'
                          : 'bg-white/60 border-gray-100 hover:border-gray-200'
                      )}
                    >
                      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
                        <h4
                          className={cn(
                            'text-lg font-semibold leading-snug',
                            isDark ? 'text-white' : 'text-gray-900'
                          )}
                        >
                          {article.title}
                        </h4>
                        <button
                          onClick={() => handleCopy(article.summary, idx)}
                          className={cn(
                            'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                            isDark
                              ? 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                          )}
                        >
                          {copiedId === idx ? (
                            <>
                              <Check className="w-4 h-4" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" />
                              Copy
                            </>
                          )}
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <Tag
                            className={cn(
                              'w-4 h-4',
                              isDark ? 'text-slate-500' : 'text-gray-400'
                            )}
                          />
                          <span
                            className={cn(
                              'text-sm font-medium',
                              isDark ? 'text-slate-400' : 'text-gray-600'
                            )}
                          >
                            {article.source}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar
                            className={cn(
                              'w-4 h-4',
                              isDark ? 'text-slate-500' : 'text-gray-400'
                            )}
                          />
                          <span
                            className={cn(
                              'text-sm',
                              isDark ? 'text-slate-400' : 'text-gray-600'
                            )}
                          >
                            {article.publishedAt}
                          </span>
                        </div>
                      </div>

                      <p
                        className={cn(
                          'text-base leading-relaxed mb-4',
                          isDark ? 'text-slate-300' : 'text-gray-700'
                        )}
                      >
                        {article.summary}
                      </p>

                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          'inline-flex items-center gap-2 text-sm font-medium transition-all duration-300 group-hover:gap-3',
                          isDark
                            ? 'text-blue-400 hover:text-blue-300'
                            : 'text-blue-600 hover:text-blue-700'
                        )}
                      >
                        Read full article
                        <ArrowRight className="w-4 h-4" />
                      </a>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading Skeleton */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  animate={{
                    opacity: [0.4, 0.8, 0.4],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                  className={cn(
                    'p-6 rounded-xl',
                    isDark ? 'bg-slate-800/30' : 'bg-white/60'
                  )}
                >
                  <div className="h-6 bg-current rounded mb-4 opacity-20 w-3/4" />
                  <div className="h-4 bg-current rounded mb-2 opacity-20 w-full" />
                  <div className="h-4 bg-current rounded mb-2 opacity-20 w-full" />
                  <div className="h-4 bg-current rounded opacity-20 w-2/3" />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <p
            className={cn(
              'text-sm',
              isDark ? 'text-slate-500' : 'text-gray-400'
            )}
          >
            Powered by AI • Built with
            <span className="mx-1">❤️</span>
            for informed readers
          </p>
        </motion.div>
      </main>
    </div>
  );
}

export default App;
