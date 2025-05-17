
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Copy, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PostCardProps {
  title: string;
  content: string;
  hashtags: string[];
}

const PostCard: React.FC<PostCardProps> = ({ title, content, hashtags }) => {
  const { toast } = useToast();

  const handleCopy = () => {
    const textToCopy = `${content}\n\n${hashtags.join(' ')}`;
    navigator.clipboard.writeText(textToCopy);
    toast({
      title: "Copied to clipboard",
      description: "Post content has been copied to clipboard",
    });
  };

  const handleSchedule = () => {
    toast({
      title: "Schedule feature",
      description: "Post scheduling coming soon!",
    });
  };

  return (
    <Card className="w-full mb-4 card-shadow animate-enter">
      <CardHeader className="pb-2">
        <h3 className="text-lg font-medium text-linkedBlue">{title}</h3>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-grayScale-500 mb-3">{content}</p>
        <div className="flex flex-wrap gap-1">
          {hashtags.map((tag, index) => (
            <span
              key={index}
              className="text-xs bg-grayScale-100 text-linkedBlue px-2 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </CardContent>
      <CardFooter className="border-t pt-3 flex justify-between">
        <Button variant="outline" size="sm" className="hover-scale" onClick={handleCopy}>
          <Copy size={16} className="mr-1" /> Copy
        </Button>
        <Button variant="outline" size="sm" className="hover-scale" onClick={handleSchedule}>
          <Calendar size={16} className="mr-1" /> Schedule
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
