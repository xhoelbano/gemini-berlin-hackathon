import React, { useState } from 'react';
import { X, ZoomIn, ZoomOut, Video, Heart, ThumbsUp, Star, Sparkles, Loader2, Download, Share2 } from 'lucide-react';
import { Idea } from '../types';

interface ImageLightboxProps {
  idea: Idea;
  onClose: () => void;
  onGenerateVideo: (idea: Idea) => void;
  onReact: (ideaId: string, emoji: string) => void;
  isGenerating: boolean;
}

const REACTIONS = [
  { emoji: '❤️', label: 'Love' },
  { emoji: '🔥', label: 'Fire' },
  { emoji: '🏆', label: 'Winner' },
  { emoji: '🌟', label: 'Amazing' },
  { emoji: '🎨', label: 'Creative' },
  { emoji: '🏗️', label: 'Build it!' },
];

const ImageLightbox: React.FC<ImageLightboxProps> = ({ 
  idea, 
  onClose, 
  onGenerateVideo, 
  onReact,
  isGenerating 
}) => {
  const [zoom, setZoom] = useState(1);
  const [reactions, setReactions] = useState<string[]>([]);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.5, 4));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.5, 0.5));
  const handleResetZoom = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleReaction = (emoji: string) => {
    if (!reactions.includes(emoji)) {
      setReactions(prev => [...prev, emoji]);
      onReact(idea.id, emoji);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <div 
      className="fixed inset-0 z-[700] bg-black/95 backdrop-blur-xl flex flex-col"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-4">
          <button 
            onClick={onClose}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          <div>
            <h3 className="text-white font-bold">{idea.prompt}</h3>
            <p className="text-slate-400 text-sm">by {idea.author}</p>
          </div>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-2">
          <button 
            onClick={handleZoomOut}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <ZoomOut className="w-5 h-5 text-white" />
          </button>
          <span className="text-white text-sm font-medium min-w-[60px] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button 
            onClick={handleZoomIn}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <ZoomIn className="w-5 h-5 text-white" />
          </button>
          <button 
            onClick={handleResetZoom}
            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-full text-white text-sm transition-colors ml-2"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Image Container */}
      <div 
        className="flex-1 flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {idea.type === 'image' ? (
          <img 
            src={idea.imageUrl} 
            alt={idea.prompt}
            className="max-w-full max-h-full object-contain transition-transform duration-200 select-none"
            style={{ 
              transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
              cursor: zoom > 1 ? 'grab' : 'default'
            }}
            draggable={false}
          />
        ) : (
          <video 
            src={idea.videoUrl} 
            controls 
            autoPlay 
            loop 
            className="max-w-full max-h-full object-contain"
          />
        )}
      </div>

      {/* Bottom Panel */}
      <div className="p-4 bg-gradient-to-t from-black/80 to-transparent">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-4">
          
          {/* Reactions */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-sm mr-2">React:</span>
            {REACTIONS.map(({ emoji, label }) => (
              <button
                key={emoji}
                onClick={() => handleReaction(emoji)}
                className={`text-2xl hover:scale-125 transition-transform p-1 rounded-lg ${
                  reactions.includes(emoji) ? 'bg-white/20 scale-110' : 'hover:bg-white/10'
                }`}
                title={label}
              >
                {emoji}
              </button>
            ))}
            {reactions.length > 0 && (
              <span className="text-white text-sm ml-2 bg-white/10 px-2 py-1 rounded-full">
                +{reactions.length}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {idea.type === 'image' && !idea.videoUrl && (
              <button
                onClick={() => onGenerateVideo(idea)}
                disabled={isGenerating}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-purple-500/30 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Video className="w-5 h-5" />
                    Generate 3D Video Tour
                  </>
                )}
              </button>
            )}
            
            {idea.videoUrl && (
              <div className="flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-full">
                <Sparkles className="w-4 h-4" />
                Video Available
              </div>
            )}

            <button className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
              <Download className="w-5 h-5 text-white" />
            </button>
            <button className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
              <Share2 className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageLightbox;

