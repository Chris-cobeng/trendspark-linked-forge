
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, CheckCircle, AlertCircle, MessageSquare, Hash, Clock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface OptimizationPanelProps {
  score: number;
}

const OptimizationPanel: React.FC<OptimizationPanelProps> = ({ score }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { toast } = useToast();

  // Generate suggestions based on score
  const suggestions = [
    {
      id: 1,
      category: 'Length',
      icon: <MessageSquare size={16} />,
      suggestion: 'Your post is slightly longer than the LinkedIn sweet spot of 150-200 words.',
      action: 'Trim post',
      status: score > 85 ? 'good' : 'warning'
    },
    {
      id: 2,
      category: 'Hashtags',
      icon: <Hash size={16} />,
      suggestion: 'Consider using 2-3 targeted hashtags instead of 4 for better engagement.',
      action: 'Optimize hashtags',
      status: score > 80 ? 'good' : 'warning'
    },
    {
      id: 3,
      category: 'Posting time',
      icon: <Clock size={16} />,
      suggestion: 'Schedule this post for Tuesday or Thursday morning for maximum visibility.',
      action: 'Schedule post',
      status: 'tip'
    }
  ];

  // Define the color based on score
  const getScoreColor = () => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-amber-500';
    return 'text-red-500';
  };

  const getScoreBackground = () => {
    if (score >= 90) return 'bg-green-600';
    if (score >= 75) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const handleAction = (action: string) => {
    toast({
      title: "Optimization action",
      description: `${action} functionality coming soon`,
    });
  };

  return (
    <div className="mt-2 bg-white rounded-lg border border-grayScale-200 overflow-hidden">
      <button
        className="w-full p-3 flex items-center justify-between text-grayScale-500 hover:bg-grayScale-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-grayScale-100 flex items-center justify-center mr-3">
            {score >= 80 ? <CheckCircle size={16} className="text-green-500" /> : <AlertCircle size={16} className="text-amber-500" />}
          </div>
          <div className="mr-3">
            <span className="text-sm font-medium">Post Optimization</span>
            <div className="flex items-center">
              <span className={`text-xs font-medium ${getScoreColor()}`}>{score}/100</span>
              <div className="ml-2 w-24 h-1.5 bg-grayScale-100 rounded-full">
                <div 
                  className={`h-full rounded-full ${getScoreBackground()}`} 
                  style={{ width: `${score}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-4 py-3 border-t border-grayScale-200">
              <h4 className="text-sm font-medium mb-3">Optimization suggestions</h4>
              <div className="space-y-3">
                {suggestions.map((item) => (
                  <div key={item.id} className="flex items-start">
                    <div className={`p-1.5 rounded-full mr-3 mt-0.5
                      ${item.status === 'good' ? 'bg-green-100 text-green-600' : 
                       item.status === 'warning' ? 'bg-amber-100 text-amber-600' : 
                      'bg-blue-100 text-blue-600'}`}
                    >
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center mb-1">
                        <span className="text-sm font-medium">{item.category}</span>
                        <span 
                          className={`text-xs ml-2 px-1.5 py-0.5 rounded-sm
                            ${item.status === 'good' ? 'bg-green-100 text-green-600' : 
                             item.status === 'warning' ? 'bg-amber-100 text-amber-600' : 
                            'bg-blue-100 text-blue-600'}`}
                        >
                          {item.status === 'good' ? 'Good' : 
                           item.status === 'warning' ? 'Could improve' : 'Tip'}
                        </span>
                      </div>
                      <p className="text-xs text-grayScale-500 mb-2">{item.suggestion}</p>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-xs h-7 hover-scale"
                        onClick={() => handleAction(item.action)}
                      >
                        {item.action}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OptimizationPanel;
