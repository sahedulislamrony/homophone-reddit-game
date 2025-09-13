import { useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';

type SuccessPopupProps = {
  isVisible: boolean;
  onClose: () => void;
  title: string;
  message: string;
  duration?: number;
};

export default function SuccessPopup({
  isVisible,
  onClose,
  title,
  message,
  duration = 3000,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-8 mx-4 max-w-md w-full shadow-2xl border border-green-400/20">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold text-white text-center mb-2">{title}</h3>

        {/* Message */}
        <p className="text-white/90 text-center text-lg">{message}</p>

        {/* Progress Bar */}
        <div className="mt-6 w-full bg-white/20 rounded-full h-1 overflow-hidden">
          <div
            className="bg-white h-1 rounded-full transition-all duration-300 ease-out animate-shrink"
            style={{
              animationDuration: `${duration}ms`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
