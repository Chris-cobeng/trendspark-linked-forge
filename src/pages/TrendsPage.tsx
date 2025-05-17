
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, ArrowUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Sample trending data
const trendingTopics = [
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

const TrendsPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGeneratePostFromTrend = (topic: string) => {
    navigate('/', { state: { selectedTopic: topic } });
  };

  // Function to get a color based on growth percentage
  const getGrowthColor = (growth: number) => {
    if (growth > 20) return 'text-green-600';
    if (growth > 10) return 'text-green-500';
    return 'text-green-400';
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Trending Topics</h1>
      <p className="text-grayScale-500 mb-6">Discover what professionals are talking about on LinkedIn</p>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center">
            <TrendingUp size={20} className="mr-2 text-linkedBlue" />
            LinkedIn Trends
          </h2>
          <p className="text-sm text-grayScale-400">Updated May 17, 2025</p>
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
          {['#LeadershipSkills', '#ArtificialIntelligence', '#RemoteWork', 
            '#DigitalTransformation', '#CareerAdvice', '#Innovation', 
            '#ProfessionalDevelopment', '#Networking', '#StartupLife',
            '#LinkedInTips', '#WorkCulture', '#FutureOfWork'].map((tag) => (
            <div
              key={tag}
              className="bg-grayScale-100 hover:bg-grayScale-200 transition-colors px-3 py-2 rounded-full cursor-pointer"
            >
              <span className="text-sm font-medium text-linkedBlue">{tag}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrendsPage;
