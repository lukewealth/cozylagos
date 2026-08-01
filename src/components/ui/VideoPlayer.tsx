import React, { useState } from 'react';
import { Play, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface VideoPlayerProps {
  videoUrl: string;
  title?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

function parseVideoUrl(url: string): { type: 'youtube' | 'vimeo' | 'direct'; id?: string; url: string } | null {
  if (!url) return null;

  const youtubePatterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/shorts\/([^&\n?#]+)/,
  ];

  for (const pattern of youtubePatterns) {
    const match = url.match(pattern);
    if (match) {
      return { type: 'youtube', id: match[1], url };
    }
  }

  const vimeoPattern = /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/;
  const vimeoMatch = url.match(vimeoPattern);
  if (vimeoMatch) {
    return { type: 'vimeo', id: vimeoMatch[1], url };
  }

  if (url.match(/\.(mp4|webm|ogg|mov)(\?|$)/i)) {
    return { type: 'direct', url };
  }

  return null;
}

export default function VideoPlayer({ videoUrl, title, isOpen, onClose }: VideoPlayerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const videoData = parseVideoUrl(videoUrl);

  if (!videoData) {
    return null;
  }

  const isModalMode = isOpen !== undefined;
  const showPlayer = isModalMode ? isOpen : isExpanded;
  const handleClose = isModalMode ? onClose! : () => setIsExpanded(false);

  const getEmbedUrl = () => {
    if (videoData.type === 'youtube') {
      return `https://www.youtube.com/embed/${videoData.id}?rel=0&modestbranding=1&autoplay=1`;
    }
    if (videoData.type === 'vimeo') {
      return `https://player.vimeo.com/video/${videoData.id}?autoplay=1`;
    }
    return videoData.url;
  };

  const getThumbnailUrl = () => {
    if (videoData.type === 'youtube') {
      return `https://img.youtube.com/vi/${videoData.id}/maxresdefault.jpg`;
    }
    return null;
  };

  const thumbnailUrl = getThumbnailUrl();

  if (isModalMode) {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
            onClick={handleClose}
          >
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={handleClose}
              className="absolute top-6 right-6 z-10 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6" />
            </motion.button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-6xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {videoData.type === 'direct' ? (
                <video
                  src={videoData.url}
                  controls
                  autoPlay
                  className="w-full h-full"
                  controlsList="nodownload"
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <iframe
                  src={getEmbedUrl()}
                  title={title || 'Property video tour'}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  frameBorder="0"
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between border-b border-charcoal/5 pb-4">
          <h2 className="font-serif text-3xl font-bold text-charcoal">Video Tour</h2>
          <span className="text-xs font-bold text-gold-dark uppercase tracking-widest flex items-center gap-1">
            <Play className="w-3 h-3" />
            {videoData.type === 'youtube' ? 'YouTube' : videoData.type === 'vimeo' ? 'Vimeo' : 'Video'}
          </span>
        </div>

        <div
          className="relative aspect-video rounded-2xl overflow-hidden bg-charcoal/5 cursor-pointer group border border-charcoal/5"
          onClick={() => setIsExpanded(true)}
        >
          {thumbnailUrl ? (
            <>
              <img
                src={thumbnailUrl}
                alt={title || 'Video thumbnail'}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-20 h-20 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-2xl"
                >
                  <Play className="w-10 h-10 text-charcoal fill-current ml-1" />
                </motion.div>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-charcoal/40 group-hover:text-gold-dark transition-colors">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-20 h-20 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-2xl"
              >
                <Play className="w-10 h-10 fill-current ml-1" />
              </motion.div>
              <span className="text-sm font-bold uppercase tracking-widest">Play Video Tour</span>
            </div>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
            onClick={() => setIsExpanded(false)}
          >
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => setIsExpanded(false)}
              className="absolute top-6 right-6 z-10 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6" />
            </motion.button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-6xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {videoData.type === 'direct' ? (
                <video
                  src={videoData.url}
                  controls
                  autoPlay
                  className="w-full h-full"
                  controlsList="nodownload"
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <iframe
                  src={getEmbedUrl()}
                  title={title || 'Property video tour'}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  frameBorder="0"
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
