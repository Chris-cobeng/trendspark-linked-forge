
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PostCard from '@/components/PostCard';

// Sample saved posts data (would be fetched from API/database)
const samplePosts = [
  {
    id: 1,
    title: 'Insightful Perspective',
    content: "I've been reflecting on Remote Work lately, and I've realized that the most successful professionals don't just follow trends—they anticipate them. What separates leaders from followers is the ability to see patterns before they become obvious. What emerging patterns are you noticing in your industry right now?",
    hashtags: ['#LinkedInTips', '#ProfessionalGrowth', '#RemoteWork', '#CareerAdvice'],
    status: 'saved'
  },
  {
    id: 2,
    title: 'Personal Story',
    content: "Earlier in my career, I struggled with understanding AI in Business. I remember sitting in a meeting completely overwhelmed by the concepts being discussed. Fast forward 3 years and countless hours of deliberate learning—now I'm helping others navigate this complex landscape. The lesson? Persistence trumps initial talent every time.",
    hashtags: ['#LinkedInTips', '#AIinBusiness', '#CareerJourney', '#ProfessionalDevelopment'],
    status: 'scheduled'
  },
  {
    id: 3,
    title: 'Call to Action',
    content: "The landscape of Personal Branding is evolving rapidly. Those who adapt will thrive, while those who resist change risk becoming obsolete. Are you investing enough time to stay current? I'm hosting a free webinar next week covering the latest developments and practical strategies. Comment 'interested' below if you'd like to join!",
    hashtags: ['#PersonalBranding', '#CareerGrowth', '#LinkedInStrategy', '#ProfessionalNetwork'],
    status: 'saved'
  }
];

const PostsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  
  const filteredPosts = samplePosts.filter(post => {
    const matchesSearch = post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.hashtags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (filter === 'all') return matchesSearch;
    return matchesSearch && post.status === filter;
  });

  return (
    <div className="w-full max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Your Posts</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Manage Posts</h2>
          <Button className="gradient-btn hover-scale">
            Create New Post
          </Button>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Input
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
        </div>
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="all" onClick={() => setFilter('all')}>All Posts</TabsTrigger>
            <TabsTrigger value="saved" onClick={() => setFilter('saved')}>Saved</TabsTrigger>
            <TabsTrigger value="scheduled" onClick={() => setFilter('scheduled')}>Scheduled</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            {filteredPosts.length > 0 ? (
              filteredPosts.map(post => (
                <PostCard
                  key={post.id}
                  title={post.title}
                  content={post.content}
                  hashtags={post.hashtags}
                />
              ))
            ) : (
              <div className="text-center py-8 text-grayScale-400">
                <p>No posts found matching your search.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="saved" className="space-y-4">
            {filteredPosts.length > 0 ? (
              filteredPosts.map(post => (
                <PostCard
                  key={post.id}
                  title={post.title}
                  content={post.content}
                  hashtags={post.hashtags}
                />
              ))
            ) : (
              <div className="text-center py-8 text-grayScale-400">
                <p>No saved posts found.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="scheduled" className="space-y-4">
            {filteredPosts.length > 0 ? (
              filteredPosts.map(post => (
                <PostCard
                  key={post.id}
                  title={post.title}
                  content={post.content}
                  hashtags={post.hashtags}
                />
              ))
            ) : (
              <div className="text-center py-8 text-grayScale-400">
                <p>No scheduled posts found.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PostsPage;
