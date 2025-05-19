
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import TopicSelector from '@/components/TopicSelector';
import PostCard from '@/components/PostCard';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Post } from '@/integrations/supabase/types/posts';
import { Loader2, Calendar, Copy } from 'lucide-react';
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

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
  const [scheduleDate, setScheduleDate] = useState<Date | undefined>(undefined);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

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
        description: `Your ${selectedPostType} post was created successfully!`,
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
      
      // Offer to navigate to posts page
      setTimeout(() => {
        toast({
          title: "View Saved Posts",
          description: "Go to your posts page to see all saved content",
          action: (
            <Button variant="outline" size="sm" onClick={() => navigate('/posts')}>
              <Copy size={14} className="mr-1" /> View Posts
            </Button>
          ),
        });
      }, 1500);
    } catch (error) {
      console.error('Error saving post:', error);
      toast({
        title: "Save Failed",
        description: "There was an error saving your post",
        variant: "destructive",
      });
    }
  };

  const handleSchedulePost = async (post: GeneratedPost) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to schedule posts",
        variant: "destructive",
      });
      return;
    }

    if (!scheduleDate) {
      toast({
        title: "Date Required",
        description: "Please select a date to schedule this post",
        variant: "destructive",
      });
      return;
    }

    try {
      // Prepare post data for scheduling
      const postData: Omit<Post, 'id' | 'created_at'> = {
        title: post.title,
        content: post.content,
        status: 'scheduled',
        scheduled_at: scheduleDate.toISOString(),
        user_id: user.id,
      };

      const { error } = await supabase.from('posts').insert(postData);

      if (error) throw error;

      toast({
        title: "Post Scheduled",
        description: `Your post has been scheduled for ${format(scheduleDate, "MMMM d, yyyy")}`,
      });
      
      // Reset schedule date
      setScheduleDate(undefined);
      
      // Offer to navigate to calendar page
      setTimeout(() => {
        toast({
          title: "View Calendar",
          description: "Go to your calendar to see all scheduled content",
          action: (
            <Button variant="outline" size="sm" onClick={() => navigate('/calendar')}>
              <Calendar size={14} className="mr-1" /> View Calendar
            </Button>
          ),
        });
      }, 1500);
    } catch (error) {
      console.error('Error scheduling post:', error);
      toast({
        title: "Schedule Failed",
        description: "There was an error scheduling your post",
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
          
          <AnimatePresence>
            {selectedTopic && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white p-6 rounded-lg shadow-sm border"
              >
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Right Panel - Post Preview */}
        <div>
          <div className="bg-white p-6 rounded-lg shadow-sm border h-full">
            <h2 className="text-xl font-semibold mb-4">Generated Post</h2>
            
            <AnimatePresence mode="wait">
              {isGenerating ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center h-64"
                >
                  <Loader2 className="h-8 w-8 animate-spin text-linkedBlue mb-4" />
                  <p className="text-grayScale-500">Crafting an engaging post with AI...</p>
                </motion.div>
              ) : generatedPost ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <PostCard
                    key={generatedPost.id}
                    title={generatedPost.title}
                    content={generatedPost.content}
                    hashtags={generatedPost.hashtags}
                    onSave={() => handleSavePost(generatedPost)}
                  />
                  
                  <div className="flex items-center gap-2 mt-6">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !scheduleDate && "text-muted-foreground"
                          )}
                        >
                          {scheduleDate ? (
                            format(scheduleDate, "PPP")
                          ) : (
                            <span>Pick a date to schedule</span>
                          )}
                          <Calendar className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={scheduleDate}
                          onSelect={setScheduleDate}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    
                    <Button 
                      onClick={() => handleSchedulePost(generatedPost)}
                      disabled={!scheduleDate}
                      className="gradient-btn"
                    >
                      Schedule Post
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center h-64 text-grayScale-400"
                >
                  <p>Select a topic and post type, then click "Generate Post"</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneratePage;
