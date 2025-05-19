
import React, { useState, useCallback } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import { Post as PostType } from '@/integrations/supabase/types/posts';
import { Loader2, Calendar as CalendarIcon, Clock, Edit, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useStableData } from '@/hooks/useStableData';

const CalendarPage: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedDatePosts, setSelectedDatePosts] = useState<PostType[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Use the stable data hook for fetching posts
  const fetchScheduledPosts = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'scheduled')
      .not('scheduled_at', 'is', null)
      .order('scheduled_at', { ascending: true });

    return { data: data as PostType[] || [], error };
  }, []);

  const { data: scheduledPosts, loading, dataRef: postsRef } = useStableData<PostType>(
    fetchScheduledPosts,
    []
  );

  // Create a stable function for filtering posts by date
  const filterPostsByDate = useCallback((selectedDate: Date | undefined) => {
    if (!selectedDate || !postsRef.length) {
      setSelectedDatePosts([]);
      return;
    }
    
    const filteredPosts = postsRef.filter(post => {
      if (!post.scheduled_at) return false;
      
      const postDate = new Date(post.scheduled_at);
      return (
        postDate.getDate() === selectedDate.getDate() &&
        postDate.getMonth() === selectedDate.getMonth() &&
        postDate.getFullYear() === selectedDate.getFullYear()
      );
    });
    
    setSelectedDatePosts(filteredPosts);
  }, [postsRef]);

  // Use callback for date changes
  React.useEffect(() => {
    filterPostsByDate(date);
  }, [date, scheduledPosts, filterPostsByDate]);

  // Function to determine if a date has posts scheduled
  const hasScheduledPost = useCallback((day: Date) => {
    return postsRef.some(post => {
      if (!post.scheduled_at) return false;
      
      const postDate = new Date(post.scheduled_at);
      return (
        postDate.getDate() === day.getDate() &&
        postDate.getMonth() === day.getMonth() &&
        postDate.getFullYear() === day.getFullYear()
      );
    });
  }, [postsRef]);

  // Count posts for a specific date
  const getPostCountForDate = useCallback((day: Date) => {
    return postsRef.filter(post => {
      if (!post.scheduled_at) return false;
      
      const postDate = new Date(post.scheduled_at);
      return (
        postDate.getDate() === day.getDate() &&
        postDate.getMonth() === day.getMonth() &&
        postDate.getFullYear() === day.getFullYear()
      );
    }).length;
  }, [postsRef]);

  const handleViewPost = (postId: string) => {
    navigate(`/posts?id=${postId}`);
  };

  return (
    <div className="w-full mx-auto">
      <h1 className="text-3xl font-bold mb-6">Content Calendar</h1>
      
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            Schedule Posts 
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="px-2 ml-2">
                    <Info className="h-4 w-4 text-linkedBlue" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">Schedule and manage your LinkedIn posts with this enhanced calendar view.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </h2>
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-center items-center p-12"
                key="loading"
              >
                <Loader2 className="h-8 w-8 animate-spin text-linkedBlue mr-2" />
                <span className="text-grayScale-500">Loading your content calendar...</span>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col"
                key="calendar"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                  {/* Calendar - Larger Size */}
                  <div className="w-full md:col-span-7 lg:col-span-8">
                    <div className="border rounded-lg shadow-sm p-4 bg-white">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="w-full max-w-none"
                        modifiers={{
                          booked: (date) => hasScheduledPost(date),
                        }}
                        modifiersStyles={{
                          booked: { 
                            backgroundColor: 'rgba(30, 174, 219, 0.1)', 
                            fontWeight: 'bold', 
                            color: '#1EAEDB',
                            transform: 'scale(1.05)' 
                          }
                        }}
                        components={{
                          DayContent: ({ date }) => {
                            const postCount = getPostCountForDate(date);
                            
                            return (
                              <div className="relative flex items-center justify-center h-full">
                                <span className="text-base">{date.getDate()}</span>
                                {postCount > 0 && (
                                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                                    <div className="flex gap-0.5">
                                      {[...Array(Math.min(postCount, 3))].map((_, i) => (
                                        <div 
                                          key={i} 
                                          className="w-1.5 h-1.5 bg-linkedBlue rounded-full"
                                        />
                                      ))}
                                      {postCount > 3 && (
                                        <div className="w-1.5 h-1.5 bg-linkedBlue/50 rounded-full" />
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          },
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* Selected Date Posts */}
                  <div className="w-full md:col-span-5 lg:col-span-4">
                    <div className="border rounded-lg shadow-sm p-4 bg-white h-full">
                      <h3 className="text-lg font-medium mb-4 flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-2 text-linkedBlue" />
                        {date ? format(date, "MMMM d, yyyy") : "Select a Date"}
                      </h3>
                      <AnimatePresence mode="wait">
                        {selectedDatePosts.length > 0 ? (
                          <motion.div 
                            key="has-posts"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-3"
                          >
                            {selectedDatePosts.map((post) => (
                              <motion.div
                                key={post.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                transition={{ duration: 0.2 }}
                              >
                                <div className="bg-linkedBlue/5 border-linkedBlue/20 hover:shadow-md transition-shadow rounded-lg border p-4">
                                  <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                      <p className="font-medium">{post.title}</p>
                                      <p className="text-sm text-grayScale-500 mt-1 line-clamp-2">{post.content}</p>
                                      <div className="flex items-center mt-2 text-xs text-linkedBlue">
                                        <Clock size={12} className="mr-1" /> 
                                        Scheduled for {format(new Date(post.scheduled_at!), "h:mm a")}
                                      </div>
                                    </div>
                                    <Button
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => handleViewPost(post.id)}
                                      className="ml-2"
                                    >
                                      <Edit size={14} className="mr-1" /> View
                                    </Button>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </motion.div>
                        ) : date ? (
                          <motion.div 
                            key="no-posts"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="bg-grayScale-50 rounded-lg text-center p-8"
                          >
                            <p className="text-grayScale-500 text-sm mb-3">
                              No posts scheduled for this date.
                            </p>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => navigate('/dashboard')}
                              className="text-sm"
                            >
                              Generate a new post
                            </Button>
                          </motion.div>
                        ) : null}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="mt-6 p-4 bg-linkedBlue/5 border border-linkedBlue/10 rounded-md">
          <h3 className="text-sm font-medium mb-2 flex items-center">
            <CalendarIcon className="h-4 w-4 mr-2 text-linkedBlue" /> Pro Tip
          </h3>
          <p className="text-sm text-grayScale-600">
            Schedule posts during peak engagement hours—early mornings (7-9am) 
            and early evenings (5-7pm)—to maximize visibility. Click on a date with scheduled posts to view and manage them.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
