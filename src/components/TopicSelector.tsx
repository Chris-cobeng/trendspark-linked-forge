
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Loader2, Sparkles } from 'lucide-react';
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
  const [topicSuggestions, setTopicSuggestions] = useState<TopicOption[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // If initial topic is provided, update the state
    if (initialTopic) {
      setCustomTopic(initialTopic);
    }
  }, [initialTopic]);

  useEffect(() => {
    // If suggestions are shown, load AI-generated topics
    if (showSuggestions && topicSuggestions.length === 0) {
      fetchAITopics();
    }
  }, [showSuggestions]);

  // Function to fetch AI-generated topic suggestions
  const fetchAITopics = async (userInput?: string) => {
    setLoadingSuggestions(true);
    
    try {
      // Call our Supabase edge function for AI topic suggestions
      const { data, error } = await supabase.functions.invoke('suggest-linkedin-topics', {
        body: { userInput }
      });
      
      if (error) throw error;
      
      if (data?.topics && data.topics.length > 0) {
        setTopicSuggestions(data.topics);
      } else {
        // Fallback to default topics if no suggestions were found
        setTopicSuggestions(getDefaultTopics());
        toast({
          title: "Using default topics",
          description: "Could not generate AI topics at this time",
        });
      }
    } catch (error) {
      console.error('Error fetching AI topics:', error);
      toast({
        title: "Failed to load topics",
        description: "Could not load AI topic suggestions",
        variant: "destructive",
      });
      
      // Fallback to default topics
      setTopicSuggestions(getDefaultTopics());
    } finally {
      setLoadingSuggestions(false);
    }
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
    
    // If showing suggestions and we have a custom topic, fetch related AI topics
    if (!showSuggestions && customTopic) {
      fetchAITopics(customTopic);
    } else if (!showSuggestions) {
      fetchAITopics();
    }
  };

  const handleRefreshTopics = () => {
    // Generate fresh topics based on current input
    fetchAITopics(customTopic);
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
          Enter a topic or choose from AI-suggested topics
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
          {showSuggestions ? (
            <>
              <TrendingUp size={14} className="mr-1" /> Hide Topic Ideas
            </>
          ) : (
            <>
              <Sparkles size={14} className="mr-1" /> Show Topic Ideas
            </>
          )}
        </Button>
        <span className="text-xs text-grayScale-500">AI-powered topic suggestions</span>
      </div>

      {showSuggestions && (
        <div className="animate-fade-in space-y-2">
          {!loadingSuggestions && (
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">AI-Suggested Topics</span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleRefreshTopics}
                className="text-xs h-7"
              >
                <Loader2 className={`h-3 w-3 mr-1 ${loadingSuggestions ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          )}
          
          <div className="grid grid-cols-1 gap-2 mt-2 sm:grid-cols-2">
            {loadingSuggestions ? (
              <div className="col-span-full flex items-center justify-center p-8">
                <Loader2 className="h-6 w-6 animate-spin text-linkedBlue mr-2" />
                <span className="text-sm text-grayScale-500">Generating topic ideas with AI...</span>
              </div>
            ) : (
              topicSuggestions.map((topic) => (
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
        </div>
      )}
    </div>
  );
};

export default TopicSelector;
