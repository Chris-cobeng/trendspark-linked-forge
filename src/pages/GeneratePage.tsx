
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import TopicSelector from '@/components/TopicSelector';
import PostCard from '@/components/PostCard';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Post } from '@/integrations/supabase/types/posts';
import { Loader2 } from 'lucide-react';

type PostType = 'insightful' | 'story' | 'callToAction';

interface GeneratedPost {
  id: number;
  title: string;
  content: string;
  hashtags: string[];
  type: PostType;
}

const GeneratePage: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [posts, setPosts] = useState<GeneratedPost[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSelectTopic = async (topic: string) => {
    setSelectedTopic(topic);
    setIsGenerating(true);
    
    try {
      // Generate posts for all three types
      const postTypes: PostType[] = ['insightful', 'story', 'callToAction'];
      const generatedPosts: GeneratedPost[] = [];
      
      // Default hashtags (these could come from trending data in a real implementation)
      const trendingHashtags = ['#LinkedInTips', '#ProfessionalGrowth', '#LinkedCraft', '#CareerAdvice'];
      
      // Generate each post type
      for (let i = 0; i < postTypes.length; i++) {
        const postType = postTypes[i];
        
        try {
          const { data, error } = await supabase.functions.invoke('generate-linkedin-post', {
            body: {
              topic,
              trendingHashtags,
              postType,
            },
          });
          
          if (error) throw error;
          
          generatedPosts.push({
            id: i + 1,
            type: postType,
            title: data.title,
            content: data.content,
            hashtags: data.hashtags,
          });
        } catch (error) {
          console.error(`Error generating ${postType} post:`, error);
          // Continue with other post types even if one fails
        }
      }
      
      // If all posts failed to generate
      if (generatedPosts.length === 0) {
        throw new Error('Failed to generate posts');
      }
      
      setPosts(generatedPosts);
      
      toast({
        title: "Posts Generated",
        description: `${generatedPosts.length} posts created for topic: ${topic}`,
      });
    } catch (error) {
      console.error('Error generating posts:', error);
      toast({
        title: "Generation Failed",
        description: "There was an error generating posts. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSavePost = async (post: GeneratedPost) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to save posts",
        variant: "destructive",
      });
      return;
    }

    try {
      // Prepare post data for saving
      const postData: Omit<Post, 'id' | 'created_at'> = {
        title: post.title,
        content: post.content,
        status: 'saved',
        scheduled_at: null,
        user_id: user.id,
      };

      const { error } = await supabase.from('posts').insert(postData);

      if (error) throw error;

      toast({
        title: "Post Saved",
        description: "Your post has been saved successfully",
      });
    } catch (error) {
      console.error('Error saving post:', error);
      toast({
        title: "Save Failed",
        description: "There was an error saving your post",
        variant: "destructive",
      });
    }
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
                <Loader2 className="h-8 w-8 animate-spin text-linkedBlue mb-4" />
                <p className="text-grayScale-500">Crafting engaging posts with AI...</p>
              </div>
            ) : posts.length > 0 ? (
              <div className="space-y-4">
                {posts.map((post) => (
                  <PostCard
                    key={post.id}
                    title={post.title}
                    content={post.content}
                    hashtags={post.hashtags}
                    onSave={() => handleSavePost(post)}
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
