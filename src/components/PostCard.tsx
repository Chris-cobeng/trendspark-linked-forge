
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Copy, Calendar, Edit, Trash2, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface PostCardProps {
  title: string;
  content: string;
  hashtags: string[];
  status?: 'saved' | 'scheduled';
  scheduledDate?: string;
}

const PostCard: React.FC<PostCardProps> = ({ 
  title, 
  content, 
  hashtags,
  status,
  scheduledDate
}) => {
  const { toast } = useToast();
  const [isHovered, setIsHovered] = useState(false);

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
      title: "Schedule post",
      description: "Opening scheduling calendar",
    });
  };

  const handleEdit = () => {
    toast({
      title: "Edit post",
      description: "Opening post editor",
    });
  };

  const handleDelete = () => {
    toast({
      title: "Delete post",
      description: "Are you sure you want to delete this post?",
      variant: "destructive",
    });
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className="w-full card-shadow border-grayScale-200"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardHeader className="pb-2 flex flex-row items-start justify-between">
          <div>
            <h3 className="text-lg font-medium text-linkedBlue">{title}</h3>
            {status === 'scheduled' && scheduledDate && (
              <div className="flex items-center mt-1 text-xs text-grayScale-500">
                <Clock size={14} className="mr-1" />
                Scheduled for {format(new Date(scheduledDate), 'MMM dd, yyyy')}
              </div>
            )}
          </div>
          {status && (
            <Badge 
              variant={status === 'scheduled' ? "outline" : "secondary"} 
              className={`${status === 'scheduled' ? 'text-linkedBlue border-linkedBlue' : 'bg-grayScale-100 text-grayScale-500'}`}
            >
              {status === 'scheduled' ? 'Scheduled' : 'Saved'}
            </Badge>
          )}
        </CardHeader>
        
        <CardContent>
          <p className="text-sm text-grayScale-500 mb-3 whitespace-pre-line">{content}</p>
          <div className="flex flex-wrap gap-1">
            {hashtags.map((tag, index) => (
              <span
                key={index}
                className="text-xs bg-grayScale-100 text-linkedBlue px-2 py-1 rounded-full hover:bg-linkedBlue hover:text-white transition-colors duration-200"
              >
                {tag}
              </span>
            ))}
          </div>
        </CardContent>
        
        <CardFooter className="border-t pt-3 flex justify-between">
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="hover-scale" 
              onClick={handleCopy}
            >
              <Copy size={16} className="mr-1" /> Copy
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="hover-scale" 
              onClick={handleSchedule}
            >
              <Calendar size={16} className="mr-1" /> {status === 'scheduled' ? 'Reschedule' : 'Schedule'}
            </Button>
          </div>
          
          <motion.div 
            className="flex gap-2" 
            initial={{ opacity: isHovered ? 0 : 1 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-grayScale-400 hover:text-linkedBlue"
              onClick={handleEdit}
            >
              <Edit size={16} />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-grayScale-400 hover:text-red-500"
              onClick={handleDelete}
            >
              <Trash2 size={16} />
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default PostCard;
