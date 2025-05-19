
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Loader2, Sparkles, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TopicOption {
  id?: number;
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
  const [fetchError, setFetchError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // If initial topic is provided, update the state
    if (initialTopic) {
      setCustomTopic(initialTopic);
    }
  }, [initialTopic]);

  useEffect(() => {
    // If suggestions are shown, load AI-generated topics
    if (showSuggestions && topicSuggestions.length === 0 && !loadingSuggestions) {
      fetchTrendingTopics();
    }
  }, [showSuggestions]);

  // Function to fetch trending topics from LinkedIn trends edge function
  const fetchTrendingTopics = async () => {
    setLoadingSuggestions(true);
    setFetchError(null);
    
    try {
      // Call our Supabase edge function for trending topics
      const { data, error } = await supabase.functions.invoke('linkedin-trends', {});
      
      if (error) throw error;
      
      if (data?.topics && Array.isArray(data.topics)) {
        // Map the topics to our expected format
        const formattedTopics = data.topics.map((topic, index) => ({
          id: index + 1,
          label: topic.title,
          icon: topic.emoji,
          trending: topic.trending === true,
          description: topic.description
        }));
        
        setTopicSuggestions(formattedTopics);
        setFetchError(null);
      } else {
        throw new Error("Invalid topics data returned");
      }
    } catch (error) {
      console.error('Error fetching trending topics:', error);
      setFetchError("Could not load trending topics");
      
      toast({
        title: "Could not load trending topics",
        description: "Falling back to AI topic suggestions",
        variant: "destructive",
      });
      
      // Fallback to direct topic suggestions
      fetchAITopics();
    } finally {
      setLoadingSuggestions(false);
    }
  };

  // Function to fetch AI-generated topic suggestions (fallback)
  const fetchAITopics = async (userInput?: string) => {
    setLoadingSuggestions(true);
    setFetchError(null);
    
    try {
      // Call our Supabase edge function for AI topic suggestions
      const { data, error } = await supabase.functions.invoke('suggest-linkedin-topics', {
        body: { userInput }
      });
      
      if (error) throw error;
      
      if (data?.topics && data.topics.length > 0) {
        setTopicSuggestions(data.topics);
        setFetchError(null);
      } else {
        throw new Error("No topic suggestions returned");
      }
    } catch (error) {
      console.error('Error fetching AI topics:', error);
      setFetchError("Failed to load topic suggestions");
      
      toast({
        title: "Failed to load topics",
        description: "Could not load topic suggestions",
        variant: "destructive",
      });
      
      // Set empty topics array
      setTopicSuggestions([]);
    } finally {
      setLoadingSuggestions(false);
    }
  };

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
    if (!showSuggestions) {
      if (customTopic) {
        fetchAITopics(customTopic);
      } else {
        fetchTrendingTopics();
      }
    }
  };

  const handleRefreshTopics = () => {
    // Generate fresh topics based on current input
    if (customTopic) {
      fetchAITopics(customTopic);
    } else {
      fetchTrendingTopics();
    }
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

      <AnimatePresence>
        {showSuggestions && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-2 overflow-hidden"
          >
            {!loadingSuggestions && (
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">AI-Suggested Topics</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleRefreshTopics}
                  className="text-xs h-7"
                >
                  <RefreshCw className={`h-3 w-3 mr-1 ${loadingSuggestions ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
            )}
            
            <ScrollArea className="h-[400px] pr-4">
              {loadingSuggestions ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-6 w-6 animate-spin text-linkedBlue mr-2" />
                  <span className="text-sm text-grayScale-500">Generating topic ideas with AI...</span>
                </div>
              ) : fetchError ? (
                <div className="p-4 text-center bg-red-50 border border-red-100 rounded-md">
                  <p className="text-red-600">{fetchError}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefreshTopics}
                    className="mt-2"
                  >
                    <RefreshCw className="h-3 w-3 mr-1" /> Try Again
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {topicSuggestions.map((topic, index) => (
                    <motion.div
                      key={topic.id || index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.03 }}
                    >
                      <Card
                        className={`cursor-pointer hover-scale transition-all duration-200 ${
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
                    </motion.div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TopicSelector;
