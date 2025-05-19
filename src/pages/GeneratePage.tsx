
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import TopicSelector from '@/components/TopicSelector';
import PostCard from '@/components/PostCard';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Post } from '@/integrations/supabase/types/posts';
import { Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [selectedPostType, setSelectedPostType] = useState<PostType>('insightful');
  const [generatedPost, setGeneratedPost] = useState<GeneratedPost | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleGeneratePost = async () => {
    if (!selectedTopic) {
      toast({
        title: "Topic Required",
        description: "Please select a topic before generating a post",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedPost(null);
    
    try {
      // Get trending hashtags from our LinkedIn trends API function
      let trendingHashtags = ['#LinkedInTips', '#ProfessionalGrowth', '#LinkedCraft', '#CareerAdvice'];
      
      // Generate a post with the selected type
      const { data, error } = await supabase.functions.invoke('generate-linkedin-post', {
        body: {
          topic: selectedTopic,
          trendingHashtags,
          postType: selectedPostType,
        },
      });
      
      if (error) throw error;
      
      const newPost: GeneratedPost = {
        id: 1,
        type: selectedPostType,
        title: data.title,
        content: data.content,
        hashtags: data.hashtags,
      };
      
      setGeneratedPost(newPost);
      
      toast({
        title: "Post Generated",
        description: `A new ${selectedPostType} post was created for topic: ${selectedTopic}`,
      });
    } catch (error) {
      console.error('Error generating post:', error);
      toast({
        title: "Generation Failed",
        description: "There was an error generating your post. Please try again.",
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
            <TopicSelector onSelectTopic={setSelectedTopic} initialTopic={selectedTopic} />
          </div>
          
          {selectedTopic && (
            <div className="bg-white p-6 rounded-lg shadow-sm border animate-fade-in">
              <h2 className="text-xl font-semibold mb-4">Post Options</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-2">Selected Topic</label>
                  <div className="flex items-center">
                    <span className="text-linkedBlue font-medium">{selectedTopic}</span>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium block mb-2">Post Type</label>
                  <Select onValueChange={(value: PostType) => setSelectedPostType(value)} value={selectedPostType}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a post type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="insightful">Insightful Perspective</SelectItem>
                      <SelectItem value="story">Personal Story</SelectItem>
                      <SelectItem value="callToAction">Call to Action</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  onClick={handleGeneratePost} 
                  className="w-full gradient-btn" 
                  disabled={isGenerating || !selectedTopic}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Generating...
                    </>
                  ) : (
                    'Generate Post'
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
        
        {/* Right Panel - Post Preview */}
        <div>
          <div className="bg-white p-6 rounded-lg shadow-sm border h-full">
            <h2 className="text-xl font-semibold mb-4">Generated Post</h2>
            
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-linkedBlue mb-4" />
                <p className="text-grayScale-500">Crafting an engaging post with AI...</p>
              </div>
            ) : generatedPost ? (
              <div className="space-y-4">
                <PostCard
                  key={generatedPost.id}
                  title={generatedPost.title}
                  content={generatedPost.content}
                  hashtags={generatedPost.hashtags}
                  onSave={() => handleSavePost(generatedPost)}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-grayScale-400">
                <p>Select a topic and post type, then click "Generate Post"</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneratePage;
