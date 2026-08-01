import React, { useState } from 'react';
import { Play, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import VideoPlayer from './VideoPlayer';

interface VideoPreviewCardProps {
  videoUrl: string;
  title?: string;
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

export default function VideoPreviewCard({ videoUrl, title }: VideoPreviewCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const videoData = parseVideoUrl(videoUrl);

  if (!videoData) {
    return null;
  }

  const getThumbnailUrl = () => {
    if (videoData.type === 'youtube') {
      return `https://img.youtube.com/vi/${videoData.id}/maxresdefault.jpg`;
    }
    return null;
  };

  const thumbnailUrl = getThumbnailUrl();

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative group cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        {/* Video Preview Card */}
        <div className="relative aspect-video rounded-2xl overflow-hidden bg-charcoal shadow-2xl border-2 border-white/10">
          {/* Thumbnail or Placeholder */}
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={title || 'Video preview'}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-charcoal to-charcoal/80 flex items-center justify-center">
              <div className="text-center">
                <Play className="w-16 h-16 text-gold mx-auto mb-2" />
                <p className="text-white/60 text-sm">Video Preview</p>
              </div>
            </div>
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:from-black/90 transition-all" />

          {/* Play Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-20 h-20 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-2xl group-hover:bg-gold transition-colors"
            >
              <Play className="w-10 h-10 text-charcoal fill-current ml-1 group-hover:text-white transition-colors" />
            </motion.div>
          </div>

          {/* Full View Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-md rounded-full text-charcoal text-xs font-bold uppercase tracking-wider shadow-lg hover:bg-gold hover:text-white transition-all"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Full View</span>
          </motion.button>

          {/* Video Type Badge */}
          <div className="absolute bottom-4 left-4 flex items-center gap-2">
            <span className="px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full text-white text-[10px] font-bold uppercase tracking-wider">
              {videoData.type === 'youtube' ? '▶ YouTube' : videoData.type === 'vimeo' ? '▶ Vimeo' : '▶ Video'}
            </span>
          </div>
        </div>

        {/* Caption */}
        <div className="mt-4 text-center">
          <p className="text-charcoal/60 text-sm font-medium">
            Click to watch property tour in full screen
          </p>
        </div>
      </motion.div>

      {/* Modal Video Player */}
      <VideoPlayer
        videoUrl={videoUrl}
        title={title}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
