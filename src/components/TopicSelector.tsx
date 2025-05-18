
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface TopicOption {
  id: number;
  label: string;
  icon: string;
  trending?: boolean;
  description?: string;
}

interface TopicSelectorProps {
  onSelectTopic: (topic: string) => void;
  initialTopic?: string;
}

const TopicSelector: React.FC<TopicSelectorProps> = ({ onSelectTopic, initialTopic = '' }) => {
  const [customTopic, setCustomTopic] = useState(initialTopic);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [trendingTopics, setTrendingTopics] = useState<TopicOption[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // If initial topic is provided, update the state
    if (initialTopic) {
      setCustomTopic(initialTopic);
    }
  }, [initialTopic]);

  useEffect(() => {
    // If suggestions are shown, load trending topics
    if (showSuggestions && trendingTopics.length === 0) {
      fetchTrendingTopics();
    }
  }, [showSuggestions]);

  // Function to fetch trending topics from LinkedIn API
  const fetchTrendingTopics = async () => {
    setLoadingSuggestions(true);
    
    try {
      // Fetch trend data from our Supabase edge function
      const { data, error } = await supabase.functions.invoke('linkedin-trends');
      
      if (error) throw error;
      
      // Transform the trend data into topic options
      if (data && data.trends && data.trends.length > 0) {
        const topicOptions: TopicOption[] = data.trends.map((trend: any) => ({
          id: trend.id,
          label: trend.topic,
          icon: getIconForTopic(trend.topic),
          trending: true,
          description: trend.description
        }));
        
        setTrendingTopics(topicOptions);
      } else {
        // Fallback to default topics if no trends were found
        setTrendingTopics(getDefaultTopics());
      }
    } catch (error) {
      console.error('Error fetching trending topics:', error);
      toast({
        title: "Failed to load topics",
        description: "Could not load trending topic suggestions",
        variant: "destructive",
      });
      
      // Fallback to default topics
      setTrendingTopics(getDefaultTopics());
    } finally {
      setLoadingSuggestions(false);
    }
  };
  
  // Get an icon for a topic based on its content
  const getIconForTopic = (topic: string): string => {
    const topicLower = topic.toLowerCase();
    if (topicLower.includes('ai') || topicLower.includes('artificial intelligence')) return '🤖';
    if (topicLower.includes('work') || topicLower.includes('remote')) return '🏠';
    if (topicLower.includes('brand') || topicLower.includes('personal')) return '👤';
    if (topicLower.includes('lead') || topicLower.includes('management')) return '🚀';
    if (topicLower.includes('digital') || topicLower.includes('tech')) return '💻';
    if (topicLower.includes('balance') || topicLower.includes('wellness')) return '⚖️';
    if (topicLower.includes('growth') || topicLower.includes('learning')) return '📈';
    if (topicLower.includes('trend') || topicLower.includes('future')) return '🔮';
    if (topicLower.includes('network') || topicLower.includes('connect')) return '🌐';
    if (topicLower.includes('career') || topicLower.includes('job')) return '🧑‍💼';
    if (topicLower.includes('content') || topicLower.includes('market')) return '📱';
    if (topicLower.includes('data') || topicLower.includes('analytics')) return '📊';
    return '✨'; // Default icon
  };
  
  // Default topics if API fails
  const getDefaultTopics = (): TopicOption[] => [
    { id: 1, label: 'Remote Work Strategies', icon: '🏠', trending: true, description: 'Effective approaches for remote work productivity' },
    { id: 2, label: 'AI in Business Transformation', icon: '🤖', trending: true, description: 'How AI is reshaping business processes and strategy' },
    { id: 3, label: 'Personal Branding for Executives', icon: '👤', trending: true, description: 'Building your professional brand as a leader' },
    { id: 4, label: 'Leadership in Crisis Management', icon: '🚀', trending: false, description: 'Guiding teams through challenging situations' },
    { id: 5, label: 'Digital Transformation Roadmap', icon: '💻', trending: false, description: 'Planning your organization\'s digital journey' },
    { id: 6, label: 'Work-Life Integration Techniques', icon: '⚖️', trending: false, description: 'Modern approaches to balancing career and personal life' },
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
          <Button type="submit" className="gradient-btn">
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
        <div className="grid grid-cols-1 gap-2 mt-2 animate-fade-in sm:grid-cols-2">
          {loadingSuggestions ? (
            <div className="col-span-full flex items-center justify-center p-8">
              <Loader2 className="h-6 w-6 animate-spin text-linkedBlue mr-2" />
              <span className="text-sm text-grayScale-500">Loading trending topics...</span>
            </div>
          ) : (
            trendingTopics.map((topic) => (
              <Card
                key={topic.id}
                className={`cursor-pointer hover-scale ${
                  topic.trending ? 'border-linkedBlue/20' : ''
                }`}
                onClick={() => handleTopicClick(topic.label)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 mb-2">
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
                  </div>
                  {topic.description && (
                    <p className="text-xs text-grayScale-500 line-clamp-2">{topic.description}</p>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default TopicSelector;
