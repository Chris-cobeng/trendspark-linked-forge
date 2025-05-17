
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit, Calendar, Search, X, Filter, Plus, ArrowDown } from 'lucide-react';
import PostCard from '@/components/PostCard';
import OptimizationPanel from '@/components/OptimizationPanel';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Sample saved posts data (would be fetched from API/database)
const samplePosts = [
  {
    id: 1,
    title: 'Insightful Perspective',
    content: "I've been reflecting on Remote Work lately, and I've realized that the most successful professionals don't just follow trends—they anticipate them. What separates leaders from followers is the ability to see patterns before they become obvious. What emerging patterns are you noticing in your industry right now?",
    hashtags: ['#LinkedInTips', '#ProfessionalGrowth', '#RemoteWork', '#CareerAdvice'],
    status: 'saved',
    dateCreated: '2025-05-10',
    optimizationScore: 85
  },
  {
    id: 2,
    title: 'Personal Story',
    content: "Earlier in my career, I struggled with understanding AI in Business. I remember sitting in a meeting completely overwhelmed by the concepts being discussed. Fast forward 3 years and countless hours of deliberate learning—now I'm helping others navigate this complex landscape. The lesson? Persistence trumps initial talent every time.",
    hashtags: ['#LinkedInTips', '#AIinBusiness', '#CareerJourney', '#ProfessionalDevelopment'],
    status: 'scheduled',
    dateCreated: '2025-05-12',
    scheduledFor: '2025-05-20',
    optimizationScore: 92
  },
  {
    id: 3,
    title: 'Call to Action',
    content: "The landscape of Personal Branding is evolving rapidly. Those who adapt will thrive, while those who resist change risk becoming obsolete. Are you investing enough time to stay current? I'm hosting a free webinar next week covering the latest developments and practical strategies. Comment 'interested' below if you'd like to join!",
    hashtags: ['#PersonalBranding', '#CareerGrowth', '#LinkedInStrategy', '#ProfessionalNetwork'],
    status: 'saved',
    dateCreated: '2025-05-14',
    optimizationScore: 78
  }
];

// Sort options
const sortOptions = [
  { label: 'Newest', value: 'newest' },
  { label: 'Oldest', value: 'oldest' },
  { label: 'Optimization Score', value: 'optimization' }
];

const PostsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const { toast } = useToast();
  const [showFilters, setShowFilters] = useState(false);
  
  // Animation variants for list items
  const listVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  // Filter and sort posts
  const filteredPosts = samplePosts
    .filter(post => {
      const matchesSearch = post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          post.hashtags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      if (filter === 'all') return matchesSearch;
      return matchesSearch && post.status === filter;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime();
      } else if (sortBy === 'oldest') {
        return new Date(a.dateCreated).getTime() - new Date(b.dateCreated).getTime();
      } else if (sortBy === 'optimization') {
        return b.optimizationScore - a.optimizationScore;
      }
      return 0;
    });

  const handleCreateNewPost = () => {
    toast({
      title: "Create New Post",
      description: "Redirecting to post creation page",
    });
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2"
      >
        <h1 className="text-3xl font-bold">Your Posts</h1>
        <Button 
          onClick={handleCreateNewPost}
          className="gradient-btn hover-scale flex gap-2"
        >
          <Plus size={18} />
          Create New Post
        </Button>
      </motion.div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="relative w-full sm:max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-grayScale-400" />
            <Input
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-10 w-full"
            />
            {searchTerm && (
              <button 
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-grayScale-400 hover:text-grayScale-500"
              >
                <X size={16} />
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-2 self-end">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1 hover-scale"
            >
              <Filter size={16} />
              Filters
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-1 hover-scale"
                >
                  <ArrowDown size={16} />
                  Sort: {sortOptions.find(opt => opt.value === sortBy)?.label}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white">
                {sortOptions.map(option => (
                  <DropdownMenuItem 
                    key={option.value} 
                    onClick={() => setSortBy(option.value)}
                    className={sortBy === option.value ? "bg-grayScale-100" : ""}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <AnimatePresence>
          {showFilters && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="p-4 bg-grayScale-100 rounded-lg">
                <h3 className="font-medium mb-2">Advanced Filters</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Filter components would go here */}
                  <div className="text-grayScale-500">Date range filter (coming soon)</div>
                  <div className="text-grayScale-500">Topic filter (coming soon)</div>
                  <div className="text-grayScale-500">Performance filter (coming soon)</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="all" onClick={() => setFilter('all')}>All Posts</TabsTrigger>
            <TabsTrigger value="saved" onClick={() => setFilter('saved')}>Saved</TabsTrigger>
            <TabsTrigger value="scheduled" onClick={() => setFilter('scheduled')}>Scheduled</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            {filteredPosts.length > 0 ? (
              <motion.div 
                variants={listVariants}
                initial="hidden"
                animate="show"
                className="space-y-6"
              >
                {filteredPosts.map(post => (
                  <motion.div key={post.id} variants={itemVariants}>
                    <PostCard
                      title={post.title}
                      content={post.content}
                      hashtags={post.hashtags}
                      status={post.status}
                      scheduledDate={post.scheduledFor}
                    />
                    <OptimizationPanel score={post.optimizationScore} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-12 bg-grayScale-100 rounded-lg">
                <h3 className="text-lg font-medium mb-2 text-grayScale-500">No posts found</h3>
                <p className="text-grayScale-400 mb-6">We couldn't find any posts matching your search criteria.</p>
                <Button onClick={handleCreateNewPost} className="gradient-btn hover-scale">
                  <Plus size={18} className="mr-2" />
                  Create Your First Post
                </Button>
              </div>
            )}
          </TabsContent>
          
          {/* Similar content structure for other tabs */}
          <TabsContent value="saved" className="space-y-4">
            {/* Similar structure to "all" tab */}
            {filteredPosts.filter(p => p.status === 'saved').length > 0 ? (
              <motion.div 
                variants={listVariants}
                initial="hidden"
                animate="show"
                className="space-y-6"
              >
                {filteredPosts.filter(p => p.status === 'saved').map(post => (
                  <motion.div key={post.id} variants={itemVariants}>
                    <PostCard
                      title={post.title}
                      content={post.content}
                      hashtags={post.hashtags}
                    />
                    <OptimizationPanel score={post.optimizationScore} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-12 bg-grayScale-100 rounded-lg">
                <p className="text-grayScale-400">No saved posts found.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="scheduled" className="space-y-4">
            {filteredPosts.filter(p => p.status === 'scheduled').length > 0 ? (
              <motion.div 
                variants={listVariants}
                initial="hidden"
                animate="show"
                className="space-y-6"
              >
                {filteredPosts.filter(p => p.status === 'scheduled').map(post => (
                  <motion.div key={post.id} variants={itemVariants}>
                    <PostCard
                      title={post.title}
                      content={post.content}
                      hashtags={post.hashtags}
                      status="scheduled"
                      scheduledDate={post.scheduledFor}
                    />
                    <OptimizationPanel score={post.optimizationScore} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-12 bg-grayScale-100 rounded-lg">
                <p className="text-grayScale-400">No scheduled posts found.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Calendar size={20} className="mr-2 text-linkedBlue" />
          Upcoming Scheduled Posts
        </h2>
        
        <div className="text-center py-8 text-grayScale-400">
          <p className="mb-2">You don't have any scheduled posts yet.</p>
          <Button variant="outline" className="hover-scale">
            View Content Calendar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PostsPage;
