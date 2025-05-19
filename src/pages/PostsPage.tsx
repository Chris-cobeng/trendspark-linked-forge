
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { format } from 'date-fns';
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Clock, Trash2, Edit, CheckCircle } from "lucide-react";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Post as PostType, PostInsert } from '@/integrations/supabase/types/posts';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const PostsPage: React.FC = () => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('saved');
  const [newPost, setNewPost] = useState<PostInsert>({
    title: '',
    content: '',
    status: 'saved',
    scheduled_at: null,
  });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();

  // Use useEffect to fetch posts when component mounts or filter changes
  useEffect(() => {
    if (user) {
      fetchPosts(filter);
    } else {
      setPosts([]);
      setLoading(false);
    }
  }, [filter, user]);

  const fetchPosts = async (filterValue: string) => {
    setLoading(true);
    try {
      let query = supabase.from('posts')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
      
      if (filterValue !== 'all') {
        query = query.eq('status', filterValue);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching posts:', error);
        toast({
          title: "Error!",
          description: "Failed to load posts",
          variant: "destructive",
        });
      } else {
        setPosts(data as PostType[] || []);
      }
    } catch (error) {
      console.error('Unexpected error fetching posts:', error);
      toast({
        title: "Error!",
        description: "An unexpected error occurred while loading posts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (value: string) => {
    setFilter(value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewPost(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date | undefined) => {
    setNewPost(prev => ({ 
      ...prev, 
      scheduled_at: date ? date.toISOString() : null,
      status: date ? 'scheduled' : 'saved'
    }));
  };

  const handleCreatePost = async () => {
    if (!user) {
      toast({
        title: "Error!",
        description: "You must be logged in to create posts",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const postToInsert: PostInsert = {
        ...newPost,
        user_id: user.id
      };
      
      const { data, error } = await supabase
        .from('posts')
        .insert([postToInsert])
        .select();

      if (error) {
        console.error('Error creating post:', error);
        toast({
          title: "Error!",
          description: "Failed to create post",
          variant: "destructive",
        });
      } else {
        setPosts(prev => [data[0] as PostType, ...prev]);
        setNewPost({
          title: '',
          content: '',
          status: 'saved',
          scheduled_at: null,
        });
        setIsDrawerOpen(false);
        toast({
          title: "Success!",
          description: "Post created successfully",
        });
      }
    } catch (error) {
      console.error('Unexpected error creating post:', error);
      toast({
        title: "Error!",
        description: "Unexpected error creating post",
        variant: "destructive",
      });
    }
  };

  const handleDeletePost = async (id: string) => {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting post:', error);
        toast({
          title: "Error!",
          description: "Failed to delete post",
          variant: "destructive",
        });
      } else {
        setPosts(prev => prev.filter(post => post.id !== id));
        toast({
          title: "Success!",
          description: "Post deleted successfully",
        });
      }
    } catch (error) {
      console.error('Unexpected error deleting post:', error);
      toast({
        title: "Error!",
        description: "Unexpected error deleting post",
        variant: "destructive",
      });
    }
  };

  const handleUpdatePostStatus = async (id: string, status: 'saved' | 'scheduled', scheduled_at: string | null = null) => {
    try {
      const { error } = await supabase
        .from('posts')
        .update({ status, scheduled_at })
        .eq('id', id);

      if (error) {
        console.error('Error updating post status:', error);
        toast({
          title: "Error!",
          description: "Failed to update post status",
          variant: "destructive",
        });
      } else {
        setPosts(prev =>
          prev.map(post =>
            post.id === id ? { ...post, status, scheduled_at } : post
          )
        );
        toast({
          title: "Success!",
          description: `Post ${status === 'scheduled' ? 'scheduled' : 'unscheduled'} successfully`,
        });
      }
    } catch (error) {
      console.error('Unexpected error updating post status:', error);
      toast({
        title: "Error!",
        description: "Unexpected error updating post status",
        variant: "destructive",
      });
    }
  };

  // If user is not logged in, redirect to login
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center p-10">
        <h2 className="text-2xl font-bold mb-4">Login Required</h2>
        <p className="text-grayScale-500 mb-4">You need to be logged in to view and manage your posts.</p>
        <Button onClick={() => navigate("/")}>Go to Login</Button>
      </div>
    );
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>LinkedIn Posts</CardTitle>
          <CardDescription>Manage your LinkedIn post history and schedule future content.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <Select value={filter} onValueChange={handleFilterChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="saved">Saved</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="all">All Posts</SelectItem>
              </SelectContent>
            </Select>
            <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
              <DrawerTrigger asChild>
                <Button className="gradient-btn">Create Post</Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Create a new post</DrawerTitle>
                  <DrawerDescription>
                    Create a new LinkedIn post to be saved or scheduled.
                  </DrawerDescription>
                </DrawerHeader>
                <div className="grid gap-4 py-4 px-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">
                      Title
                    </Label>
                    <Input
                      type="title"
                      id="title"
                      name="title"
                      value={newPost.title}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="content" className="text-right">
                      Content
                    </Label>
                    <Textarea
                      id="content"
                      name="content"
                      value={newPost.content}
                      onChange={handleInputChange}
                      className="col-span-3"
                      rows={8}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="scheduled_at" className="text-right">
                      Schedule
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="scheduled_at"
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !newPost.scheduled_at && "text-muted-foreground"
                          )}
                        >
                          {newPost.scheduled_at ? (
                            format(new Date(newPost.scheduled_at), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="center" side="bottom">
                        <Calendar
                          mode="single"
                          selected={newPost.scheduled_at ? new Date(newPost.scheduled_at) : undefined}
                          onSelect={handleDateChange}
                          disabled={(date) =>
                            date < new Date()
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <DrawerFooter>
                  <Button onClick={handleCreatePost} className="gradient-btn">Create Post</Button>
                  <DrawerClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-center items-center p-8"
              >
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-linkedBlue border-t-transparent"></div>
              </motion.div>
            ) : posts.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center p-8"
              >
                <p className="text-grayScale-500">No posts found. Create a new post to get started.</p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Table>
                  <TableCaption>A list of your LinkedIn posts.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Scheduled</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence>
                      {posts.map((post) => (
                        <motion.tr
                          key={post.id}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="hover:bg-muted/50"
                        >
                          <TableCell className="font-medium">{post.title}</TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                              post.status === 'scheduled' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {post.status === 'scheduled' ? 
                                <><Clock className="h-3 w-3 mr-1" /> Scheduled</> : 
                                <><CheckCircle className="h-3 w-3 mr-1" /> Saved</>
                              }
                            </span>
                          </TableCell>
                          <TableCell>{format(new Date(post.created_at), "MMM d, yyyy")}</TableCell>
                          <TableCell>{post.scheduled_at ? format(new Date(post.scheduled_at), "MMM d, yyyy") : 'N/A'}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              {post.status === 'saved' && (
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="h-8 px-2 text-xs"
                                    >
                                      <CalendarIcon className="h-3.5 w-3.5 mr-1" />
                                      Schedule
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0">
                                    <Calendar
                                      mode="single"
                                      selected={post.scheduled_at ? new Date(post.scheduled_at) : undefined}
                                      onSelect={(date) => {
                                        if (date) {
                                          handleUpdatePostStatus(post.id, 'scheduled', date.toISOString());
                                        }
                                      }}
                                      disabled={(date) => date < new Date()}
                                      initialFocus
                                    />
                                  </PopoverContent>
                                </Popover>
                              )}
                              {post.status === 'scheduled' && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 px-2 text-xs"
                                  onClick={() => handleUpdatePostStatus(post.id, 'saved', null)}
                                >
                                  Unschedule
                                </Button>
                              )}
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 px-2 text-xs text-red-500 hover:text-red-600 hover:bg-red-50"
                                onClick={() => handleDeletePost(post.id)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
};

export default PostsPage;
