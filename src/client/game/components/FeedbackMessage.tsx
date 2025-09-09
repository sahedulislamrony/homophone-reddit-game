import { CheckCircle, XCircle } from 'lucide-react';
import { GameFeedback } from '@shared/types/game';

type FeedbackMessageProps = {
  feedback: GameFeedback;
};

export default function FeedbackMessage({ feedback }: FeedbackMessageProps) {
  const getFeedbackStyles = () => {
    switch (feedback.type) {
      case 'correct':
        return 'bg-green-400/10 border-green-400 text-green-400';
      case 'wrong':
        return 'bg-red-400/10 border-red-400 text-red-400';
      case 'hint':
        return 'bg-yellow-400/10 border-yellow-400 text-yellow-400';
      default:
        return 'bg-gray-400/10 border-gray-400 text-gray-400';
    }
  };

  const getFeedbackIcon = () => {
    switch (feedback.type) {
      case 'correct':
        return <CheckCircle className="w-5 h-5" />;
      case 'wrong':
        return <XCircle className="w-5 h-5" />;
      case 'hint':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`p-4 rounded-xl border-2 mb-6 ${getFeedbackStyles()}`}>
      <div className="flex items-center gap-3 justify-center">
        {getFeedbackIcon()}
        <span className="font-medium">{feedback.message}</span>
      </div>
    </div>
  );
}
