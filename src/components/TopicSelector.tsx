
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
}

interface TopicSelectorProps {
  onSelectTopic: (topic: string) => void;
}

const TopicSelector: React.FC<TopicSelectorProps> = ({ onSelectTopic }) => {
  const [customTopic, setCustomTopic] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [trendingTopics, setTrendingTopics] = useState<TopicOption[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // If suggestions are shown, load trending topics
    if (showSuggestions && trendingTopics.length === 0) {
      fetchTrendingTopics();
    }
  }, [showSuggestions]);

  // Function to fetch trending topics using AI
  const fetchTrendingTopics = async () => {
    setLoadingSuggestions(true);
    
    try {
      // This would normally come from a Rapid API or similar service
      // For now, we'll use our OpenAI Edge Function to generate topics
      const { data, error } = await supabase.functions.invoke('generate-linkedin-post', {
        body: {
          topic: 'trending LinkedIn topics for professionals in 2025',
          postType: 'list',
        },
      });
      
      if (error) throw error;
      
      // Parse the AI response to extract topics
      // This is a simple extraction - in production we'd use more sophisticated parsing
      const topicText = data.content;
      const topics = extractTopicsFromAIResponse(topicText);
      
      setTrendingTopics(topics);
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
  
  // Extract topics from AI response
  const extractTopicsFromAIResponse = (text: string): TopicOption[] => {
    try {
      // Simple extraction logic - look for numbered or bulleted lists
      // In production, we'd ask the AI for a structured response
      const lines = text.split('\n').filter(line => line.trim());
      const topicRegex = /(?:\d+\.|\*|-)\s*([\w\s]+)/;
      
      const extractedTopics: TopicOption[] = [];
      let id = 1;
      
      for (const line of lines) {
        const match = line.match(topicRegex);
        if (match && match[1]) {
          const topic = match[1].trim();
          if (topic && !extractedTopics.some(t => t.label.toLowerCase() === topic.toLowerCase())) {
            extractedTopics.push({
              id: id++,
              label: topic,
              icon: getIconForTopic(topic),
              trending: true
            });
          }
        }
      }
      
      // If we couldn't extract enough topics, add some defaults
      if (extractedTopics.length < 3) {
        return [...extractedTopics, ...getDefaultTopics().slice(0, 6 - extractedTopics.length)];
      }
      
      return extractedTopics.slice(0, 6); // Limit to 6 topics
    } catch (e) {
      console.error('Error extracting topics:', e);
      return getDefaultTopics();
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
    return '✨'; // Default icon
  };
  
  // Default topics if API fails
  const getDefaultTopics = (): TopicOption[] => [
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
        <div className="grid grid-cols-2 gap-2 mt-2 animate-fade-in sm:grid-cols-3">
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
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default TopicSelector;
