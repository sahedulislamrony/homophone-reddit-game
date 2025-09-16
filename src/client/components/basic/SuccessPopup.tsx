import { useEffect } from 'react';
import { CheckCircle, X, ExternalLink } from 'lucide-react';
import { navigateTo } from '@devvit/web/client';

type SuccessPopupProps = {
  isVisible: boolean;
  onClose: () => void;
  title: string;
  message: string;
  duration?: number;
  commentUrl?: string | null;
};

export default function SuccessPopup({
  isVisible,
  onClose,
  title,
  message,
  duration = 3000,
  commentUrl,
}: SuccessPopupProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose, duration]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md transition-all duration-300">
      <div className="relative bg-black border-2 border-green-500 rounded-3xl p-8 mx-4 max-w-md w-full shadow-2xl shadow-green-500/20 transform transition-all duration-300 animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-all duration-200 hover:scale-110"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-500/10 border-2 border-green-500/30 rounded-full flex items-center justify-center relative overflow-hidden">
            {/* Animated background glow */}
            <div className="absolute inset-0 bg-green-500/20 rounded-full animate-pulse" />
            <CheckCircle className="w-12 h-12 text-green-400 relative z-10 drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-3xl font-bold text-white text-center mb-4 tracking-tight">
          <span className="bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent">
            {title}
          </span>
        </h3>

        {/* Message */}
        <p className="text-gray-300 text-center text-lg leading-relaxed font-medium">{message}</p>

        {/* View Comment Button */}
        {commentUrl && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => navigateTo(commentUrl)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold rounded-full hover:from-green-500 hover:to-green-400 transition-all duration-300 transform hover:-translate-y-1 shadow-lg shadow-green-500/20 hover:shadow-xl hover:shadow-green-500/30"
            >
              <ExternalLink className="w-5 h-5" />
              View Comment
            </button>
          </div>
        )}

        {/* Progress Bar */}
        <div className="mt-8 w-full bg-gray-800 rounded-full h-2 overflow-hidden border border-gray-700">
          <div
            className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full transition-all duration-300 ease-out animate-shrink shadow-[0_0_10px_rgba(34,197,94,0.5)]"
            style={{
              animationDuration: `${duration}ms`,
            }}
          />
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-2 -left-2 w-4 h-4 bg-green-500/30 rounded-full animate-pulse" />
        <div
          className="absolute -bottom-2 -right-2 w-3 h-3 bg-green-400/40 rounded-full animate-pulse"
          style={{ animationDelay: '0.5s' }}
        />
      </div>
    </div>
  );
}
