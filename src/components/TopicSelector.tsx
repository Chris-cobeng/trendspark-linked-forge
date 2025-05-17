
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

interface TopicOption {
  id: number;
  label: string;
  icon: string;
  trending?: boolean;
}

interface TopicSelectorProps {
  onSelectTopic: (topic: string) => void;
}

const TopicSelector: React.FC<TopicSelectorProps> = ({ onSelectTopic }) => {
  const [customTopic, setCustomTopic] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Mock data for trending topics
  const trendingTopics: TopicOption[] = [
    { id: 1, label: 'Remote Work Trends', icon: '🏠', trending: true },
    { id: 2, label: 'AI in Business', icon: '🤖', trending: true },
    { id: 3, label: 'Personal Branding', icon: '👤', trending: true },
    { id: 4, label: 'Leadership Skills', icon: '🚀', trending: false },
    { id: 5, label: 'Digital Transformation', icon: '💻', trending: false },
    { id: 6, label: 'Work-Life Balance', icon: '⚖️', trending: false },
  ];

  const handleTopicClick = (topic: string) => {
    onSelectTopic(topic);
    setCustomTopic(topic);
    setShowSuggestions(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomTopic(e.target.value);
  };

  const handleGenerateIdeas = () => {
    setShowSuggestions(!showSuggestions);
  };

  const handleSubmitCustomTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (customTopic.trim()) {
      onSelectTopic(customTopic);
    }
  };

  return (
    <div className="w-full space-y-4">
      <form onSubmit={handleSubmitCustomTopic} className="space-y-2">
        <label htmlFor="topic" className="text-sm font-medium">
          Enter a topic or choose from trending topics
        </label>
        <div className="flex gap-2">
          <Input
            id="topic"
            placeholder="Type a topic (e.g., Leadership, Innovation)"
            value={customTopic}
            onChange={handleInputChange}
            className="flex-1"
          />
          <Button type="submit" className="primary-btn">
            Generate
          </Button>
        </div>
      </form>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleGenerateIdeas}
          className="text-xs h-8 hover-scale"
        >
          <TrendingUp size={14} className="mr-1" /> {showSuggestions ? "Hide Topic Ideas" : "Show Topic Ideas"}
        </Button>
        <span className="text-xs text-grayScale-500">Let AI suggest trending topics</span>
      </div>

      {showSuggestions && (
        <div className="grid grid-cols-2 gap-2 mt-2 animate-fade-in sm:grid-cols-3">
          {trendingTopics.map((topic) => (
            <Card
              key={topic.id}
              className={`cursor-pointer hover-scale ${
                topic.trending ? 'border-linkedBlue/20' : ''
              }`}
              onClick={() => handleTopicClick(topic.label)}
            >
              <CardContent className="p-3 flex items-center gap-2">
                <span className="text-xl">{topic.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium truncate">{topic.label}</p>
                  {topic.trending && (
                    <div className="flex items-center gap-1">
                      <TrendingUp size={12} className="text-linkedBlue" />
                      <span className="text-xs text-linkedBlue">Trending</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TopicSelector;
