
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, ArrowUp, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface TrendingTopic {
  id: number;
  topic: string;
  description: string;
  engagement: number;
  growth: number;
  hashtags: string[];
  relatedTopics: string[];
}

const TrendsPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([]);
  const [trendingHashtags, setTrendingHashtags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const fetchTrends = async (forceRefresh = false) => {
    try {
      setRefreshing(true);
      
      const { data, error } = await supabase.functions.invoke('linkedin-trends', {
        body: { forceRefresh },
      });

      if (error) throw error;
      
      setTrendingTopics(data.trends || []);
      setTrendingHashtags(data.hashtags || []);
      setLastUpdated(data.updated_at);
      
      if (data.source === 'api') {
        toast({
          title: "LinkedIn trends refreshed",
          description: "Latest trend data has been loaded from LinkedIn",
        });
      }
    } catch (error) {
      console.error('Error fetching trends:', error);
      toast({
        title: "Error loading trends",
        description: "Failed to load trends data. Using sample data instead.",
        variant: "destructive",
      });
      
      // Fall back to sample data if API fails
      loadSampleData();
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadSampleData = () => {
    // Sample trending data as fallback
    const sampleTopics = [
      {
        id: 1,
        topic: 'Remote Work',
        description: 'Discussions about hybrid work models and remote productivity',
        engagement: 87,
        growth: 12,
        hashtags: ['#RemoteWork', '#HybridWork', '#FutureOfWork'],
        relatedTopics: ['Work-Life Balance', 'Digital Workspace Tools']
      },
      {
        id: 2,
        topic: 'AI in Business',
        description: 'How artificial intelligence is transforming business operations',
        engagement: 93,
        growth: 23,
        hashtags: ['#AIBusiness', '#MachineLearning', '#BusinessInnovation'],
        relatedTopics: ['Data Science', 'Automation', 'Digital Transformation']
      },
      {
        id: 3,
        topic: 'Personal Branding',
        description: 'Building and maintaining your professional online presence',
        engagement: 78,
        growth: 8,
        hashtags: ['#PersonalBranding', '#LinkedInStrategy', '#ProfessionalGrowth'],
        relatedTopics: ['Content Strategy', 'LinkedIn Optimization', 'Career Growth']
      },
      {
        id: 4,
        topic: 'Leadership Skills',
        description: 'Developing essential skills for modern leadership',
        engagement: 82,
        growth: 5,
        hashtags: ['#Leadership', '#ManagementTips', '#TeamBuilding'],
        relatedTopics: ['Emotional Intelligence', 'Team Management', 'Communication']
      },
      {
        id: 5,
        topic: 'Digital Transformation',
        description: 'How businesses are adapting to the digital landscape',
        engagement: 89,
        growth: 15,
        hashtags: ['#DigitalTransformation', '#BusinessStrategy', '#Innovation'],
        relatedTopics: ['Change Management', 'Technology Adoption', 'Business Models']
      },
      {
        id: 6,
        topic: 'Work-Life Balance',
        description: 'Strategies for maintaining balance in professional careers',
        engagement: 76,
        growth: 9,
        hashtags: ['#WorkLifeBalance', '#Wellness', '#ProductivityTips'],
        relatedTopics: ['Mental Health', 'Productivity', 'Self-Care']
      }
    ];
    
    const sampleHashtags = [
      '#LeadershipSkills', '#ArtificialIntelligence', '#RemoteWork', 
      '#DigitalTransformation', '#CareerAdvice', '#Innovation', 
      '#ProfessionalDevelopment', '#Networking', '#StartupLife',
      '#LinkedInTips', '#WorkCulture', '#FutureOfWork'
    ];
    
    setTrendingTopics(sampleTopics);
    setTrendingHashtags(sampleHashtags);
    setLastUpdated(new Date().toISOString());
  };

  const handleRefresh = () => {
    fetchTrends(true);
  };

  const handleGeneratePostFromTrend = (topic: string) => {
    navigate('/dashboard', { state: { selectedTopic: topic } });
  };

  // Function to get a color based on growth percentage
  const getGrowthColor = (growth: number) => {
    if (growth > 20) return 'text-green-600';
    if (growth > 10) return 'text-green-500';
    return 'text-green-400';
  };

  useEffect(() => {
    fetchTrends();
  }, []);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { 
      month: 'short',
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Trending Topics</h1>
        <div className="flex items-center gap-2">
          {lastUpdated && (
            <span className="text-sm text-grayScale-400">
              Updated: {formatDate(lastUpdated)}
            </span>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw size={16} className={`${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </Button>
        </div>
      </div>
      
      <p className="text-grayScale-500 mb-6">Discover what professionals are talking about on LinkedIn</p>
      
      {loading ? (
        <div className="bg-white p-20 rounded-lg shadow-sm border mb-6 flex justify-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-linkedBlue border-t-transparent"></div>
            <p className="text-lg font-medium text-gray-700">Loading trending topics...</p>
          </div>
        </div>
      ) : (
        <>
          <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center">
                <TrendingUp size={20} className="mr-2 text-linkedBlue" />
                LinkedIn Trends
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {trendingTopics.map((trend) => (
                <Card key={trend.id} className="card-shadow animate-enter">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-lg">{trend.topic}</h3>
                      <div className={`flex items-center ${getGrowthColor(trend.growth)}`}>
                        <ArrowUp size={14} />
                        <span className="text-xs font-medium">{trend.growth}%</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-grayScale-500 mb-3">{trend.description}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {trend.hashtags.map((tag, index) => (
                        <span
                          key={index}
                          className="text-xs bg-grayScale-100 text-linkedBlue px-2 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="text-xs text-grayScale-400">
                      <span className="font-medium">Related:</span> {trend.relatedTopics.join(', ')}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <Button 
                      className="w-full gradient-btn hover-scale"
                      onClick={() => handleGeneratePostFromTrend(trend.topic)}
                    >
                      Generate Post
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">Trending Hashtags</h2>
            <div className="flex flex-wrap gap-2">
              {trendingHashtags.map((tag) => (
                <div
                  key={tag}
                  className="bg-grayScale-100 hover:bg-grayScale-200 transition-colors px-3 py-2 rounded-full cursor-pointer"
                  onClick={() => handleGeneratePostFromTrend(tag.replace('#', ''))}
                >
                  <span className="text-sm font-medium text-linkedBlue">{tag}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TrendsPage;
