
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import TopicSelector from '@/components/TopicSelector';
import PostCard from '@/components/PostCard';
import { useToast } from '@/hooks/use-toast';

// Sample post data generator (would be replaced by actual API calls)
const generateSamplePosts = (topic: string) => {
  const hashtags = ['#LinkedInTips', '#ProfessionalGrowth', '#LinkedCraft', '#CareerAdvice'];
  
  return [
    {
      id: 1,
      title: 'Insightful Perspective',
      content: `I've been reflecting on ${topic} lately, and I've realized that the most successful professionals don't just follow trends—they anticipate them. What separates leaders from followers is the ability to see patterns before they become obvious. What emerging patterns are you noticing in your industry right now?`,
      hashtags: [...hashtags, `#${topic.replace(/\s+/g, '')}`]
    },
    {
      id: 2,
      title: 'Personal Story',
      content: `Earlier in my career, I struggled with understanding ${topic}. I remember sitting in a meeting completely overwhelmed by the concepts being discussed. Fast forward 3 years and countless hours of deliberate learning—now I'm helping others navigate this complex landscape. The lesson? Persistence trumps initial talent every time.`,
      hashtags: [...hashtags, `#${topic.replace(/\s+/g, '')}Journey`]
    },
    {
      id: 3,
      title: 'Call to Action',
      content: `The landscape of ${topic} is evolving rapidly. Those who adapt will thrive, while those who resist change risk becoming obsolete. Are you investing enough time to stay current? I'm hosting a free webinar next week covering the latest developments and practical strategies. Comment "interested" below if you'd like to join!`,
      hashtags: [...hashtags, `#${topic.replace(/\s+/g, '')}Experts`]
    }
  ];
};

const GeneratePage: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [posts, setPosts] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleSelectTopic = (topic: string) => {
    setSelectedTopic(topic);
    setIsGenerating(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const generatedPosts = generateSamplePosts(topic);
      setPosts(generatedPosts);
      setIsGenerating(false);
      
      toast({
        title: "Posts Generated",
        description: `3 posts created for topic: ${topic}`,
      });
    }, 1500);
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Generate LinkedIn Post</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Panel - Topic Selection */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">Select a Topic</h2>
            <TopicSelector onSelectTopic={handleSelectTopic} />
          </div>
          
          {selectedTopic && (
            <div className="bg-white p-6 rounded-lg shadow-sm border animate-fade-in">
              <h2 className="text-xl font-semibold mb-2">Selected Topic</h2>
              <div className="flex items-center">
                <span className="text-linkedBlue font-medium">{selectedTopic}</span>
                {isGenerating && (
                  <div className="ml-3 flex items-center">
                    <div className="animate-spin h-4 w-4 border-2 border-linkedBlue border-t-transparent rounded-full mr-2"></div>
                    <span className="text-sm text-grayScale-500">Generating...</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Right Panel - Post Preview */}
        <div>
          <div className="bg-white p-6 rounded-lg shadow-sm border h-full">
            <h2 className="text-xl font-semibold mb-4">Generated Posts</h2>
            
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center h-64">
                <div className="animate-spin h-8 w-8 border-4 border-linkedBlue border-t-transparent rounded-full mb-4"></div>
                <p className="text-grayScale-500">Crafting engaging posts for you...</p>
              </div>
            ) : posts.length > 0 ? (
              <div className="space-y-4">
                {posts.map((post) => (
                  <PostCard
                    key={post.id}
                    title={post.title}
                    content={post.content}
                    hashtags={post.hashtags}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-grayScale-400">
                <p>Select a topic to generate LinkedIn posts</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneratePage;
