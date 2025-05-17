import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { format } from 'date-fns';
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Separator } from "@/components/ui/separator"
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";

// Define a type for the post object
type Post = Tables<'posts'>;

const PostsPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [newPost, setNewPost] = useState<TablesInsert<'posts'>>({
    title: '',
    content: '',
    status: 'saved',
    scheduled_at: null,
  });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        let query = supabase
          .from('posts')
          .select('*')
          .order('created_at', { ascending: false });

        const currentFilter = (searchParams.get('filter') as "saved" | "scheduled") || 'saved';
        if (currentFilter !== 'all') {
          query = query.eq('status', currentFilter);
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
          setPosts(data || []);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [searchParams]);

  const handleFilterChange = (filter: string) => {
    setSearchParams({ filter });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewPost(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date | undefined) => {
    setNewPost(prev => ({ ...prev, scheduled_at: date ? date.toISOString() : null }));
  };

  const handleCreatePost = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .insert([newPost])
        .select()

      if (error) {
        console.error('Error creating post:', error);
        toast({
          title: "Error!",
          description: "Failed to create post",
          variant: "destructive",
        });
      } else {
        setPosts(prev => [data[0], ...prev]);
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

  const handleUpdatePostStatus = async (id: string, status: 'saved' | 'scheduled') => {
    try {
      const { error } = await supabase
        .from('posts')
        .update({ status })
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
            post.id === id ? { ...post, status } : post
          )
        );
        toast({
          title: "Success!",
          description: "Post status updated successfully",
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

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Posts</CardTitle>
          <CardDescription>Manage your LinkedIn posts.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <Select onValueChange={handleFilterChange} defaultValue={searchParams.get('filter') || 'saved'}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="saved">Saved</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
              </SelectContent>
            </Select>
            <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
              <DrawerTrigger asChild>
                <Button>Add Post</Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Create a new post</DrawerTitle>
                  <DrawerDescription>
                    Create a new post to be saved or scheduled.
                  </DrawerDescription>
                </DrawerHeader>
                <div className="grid gap-4 py-4">
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
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="scheduled_at" className="text-right">
                      Schedule
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
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
                  <Button onClick={handleCreatePost}>Create Post</Button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>
          {loading ? (
            <p>Loading posts...</p>
          ) : (
            <Table>
              <TableCaption>A list of your recent posts.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Scheduled At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>{post.title}</TableCell>
                    <TableCell>{post.status}</TableCell>
                    <TableCell>{post.scheduled_at ? format(new Date(post.scheduled_at), "PPP") : 'N/A'}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        onClick={() => handleDeletePost(post.id)}
                      >
                        Delete
                      </Button>
                      {post.status === 'saved' && (
                        <Button
                          variant="ghost"
                          onClick={() => handleUpdatePostStatus(post.id, 'scheduled')}
                        >
                          Schedule
                        </Button>
                      )}
                      {post.status === 'scheduled' && (
                        <Button
                          variant="ghost"
                          onClick={() => handleUpdatePostStatus(post.id, 'saved')}
                        >
                          Unschedule
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PostsPage;
