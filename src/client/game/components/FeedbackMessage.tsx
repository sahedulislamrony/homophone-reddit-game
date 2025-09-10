import { CheckCircle, Lightbulb, XCircle } from 'lucide-react';
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
        return <Lightbulb className="size-5 text-yellow-400" />;
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
