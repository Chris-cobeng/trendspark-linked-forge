
import React, { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/context/AuthContext';
import { Post as PostType } from '@/integrations/supabase/types/posts';
import { Loader2, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const CalendarPage: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [scheduledPosts, setScheduledPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDatePosts, setSelectedDatePosts] = useState<PostType[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchScheduledPosts();
    } else {
      setScheduledPosts([]);
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    // Filter posts for the selected date
    if (date && scheduledPosts.length > 0) {
      const filteredPosts = scheduledPosts.filter(post => {
        if (!post.scheduled_at) return false;
        
        const postDate = new Date(post.scheduled_at);
        return (
          postDate.getDate() === date.getDate() &&
          postDate.getMonth() === date.getMonth() &&
          postDate.getFullYear() === date.getFullYear()
        );
      });
      
      setSelectedDatePosts(filteredPosts);
    } else {
      setSelectedDatePosts([]);
    }
  }, [date, scheduledPosts]);

  const fetchScheduledPosts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', user?.id)
        .eq('status', 'scheduled')
        .not('scheduled_at', 'is', null)
        .order('scheduled_at', { ascending: true });

      if (error) {
        console.error('Error fetching scheduled posts:', error);
        toast({
          title: "Error!",
          description: "Failed to load scheduled posts",
          variant: "destructive",
        });
      } else {
        setScheduledPosts(data as PostType[] || []);
      }
    } catch (error) {
      console.error('Unexpected error fetching scheduled posts:', error);
      toast({
        title: "Error!",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to determine if a date has posts scheduled
  const hasScheduledPost = (day: Date) => {
    return scheduledPosts.some(post => {
      if (!post.scheduled_at) return false;
      
      const postDate = new Date(post.scheduled_at);
      return (
        postDate.getDate() === day.getDate() &&
        postDate.getMonth() === day.getMonth() &&
        postDate.getFullYear() === day.getFullYear()
      );
    });
  };

  // If user is not logged in, redirect to login
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center p-10">
        <h2 className="text-2xl font-bold mb-4">Login Required</h2>
        <p className="text-grayScale-500 mb-4">You need to be logged in to view and manage your calendar.</p>
        <Button onClick={() => navigate("/")}>Go to Login</Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Content Calendar</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">Schedule Posts</h2>
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-center items-center p-12"
              >
                <Loader2 className="h-8 w-8 animate-spin text-linkedBlue mr-2" />
                <span className="text-grayScale-500">Loading your content calendar...</span>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex justify-center"
              >
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border p-3"
                  modifiers={{
                    booked: (date) => hasScheduledPost(date),
                  }}
                  modifiersStyles={{
                    booked: { 
                      backgroundColor: 'rgba(30, 174, 219, 0.1)', 
                      fontWeight: 'bold', 
                      color: '#1EAEDB',
                      transform: 'scale(1.1)' 
                    }
                  }}
                  components={{
                    DayContent: ({ date }) => (
                      <div className="relative flex items-center justify-center h-full">
                        <span>{date.getDate()}</span>
                        {hasScheduledPost(date) && (
                          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-linkedBlue rounded-full"></div>
                        )}
                      </div>
                    ),
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">
              {date ? format(date, "MMMM d, yyyy") : "Select a Date"}
            </h3>
            <AnimatePresence>
              {selectedDatePosts.length > 0 ? (
                <motion.div 
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
                      <Card className="bg-linkedBlue/5 border-linkedBlue/20">
                        <CardContent className="p-4">
                          <p className="font-medium">{post.title}</p>
                          <p className="text-sm text-grayScale-500 mt-1 line-clamp-2">{post.content}</p>
                          <div className="flex items-center mt-2 text-xs text-linkedBlue">
                            <Clock size={12} className="mr-1" /> 
                            Scheduled for {format(new Date(post.scheduled_at!), "h:mm a")}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              ) : date ? (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-grayScale-500 text-sm p-3"
                >
                  No posts scheduled for this date. Visit the Posts page to schedule content.
                </motion.p>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-xl font-semibold">Scheduled Posts</CardTitle>
          </CardHeader>
          
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-center items-center p-12"
              >
                <Loader2 className="h-6 w-6 animate-spin text-linkedBlue" />
              </motion.div>
            ) : scheduledPosts.length > 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {scheduledPosts.slice(0, 5).map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <Card className="hover-scale cursor-pointer transition-all duration-200">
                      <CardContent className="p-4">
                        <p className="font-medium text-linkedBlue">
                          {post.scheduled_at && format(new Date(post.scheduled_at), "EEE, MMM d")}
                        </p>
                        <p className="text-sm text-grayScale-500 truncate mt-1">{post.title}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
                
                {scheduledPosts.length > 5 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center pt-2"
                  >
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => navigate('/posts?filter=scheduled')}
                      className="text-xs"
                    >
                      View {scheduledPosts.length - 5} more scheduled posts
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-8 text-grayScale-400"
              >
                <CalendarIcon className="h-12 w-12 mx-auto text-grayScale-300 mb-2" />
                <p className="mb-4">No scheduled posts.</p>
                <Button 
                  onClick={() => navigate('/dashboard')} 
                  variant="outline" 
                  className="text-sm"
                >
                  Generate a post
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-linkedBlue/5 border border-linkedBlue/10 rounded-md">
        <h3 className="text-sm font-medium mb-2 flex items-center">
          <CalendarIcon className="h-4 w-4 mr-2 text-linkedBlue" /> Pro Tip
        </h3>
        <p className="text-sm text-grayScale-600">
          Schedule posts during peak engagement hours—early mornings (7-9am) 
          and early evenings (5-7pm)—to maximize visibility.
        </p>
      </div>
    </div>
  );
};

export default CalendarPage;
