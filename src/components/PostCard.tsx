
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Calendar, Copy, CheckCircle, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PostCardProps {
  title: string;
  content: string;
  hashtags?: string[];
  onSave?: () => void;
}

const PostCard: React.FC<PostCardProps> = ({ title, content, hashtags = [], onSave }) => {
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const handleCopyToClipboard = () => {
    // Combine content and hashtags for copying
    const fullContent = `${content}\n\n${hashtags.join(' ')}`;
    
    navigator.clipboard.writeText(fullContent)
      .then(() => {
        setCopied(true);
        toast({
          title: "Copied to clipboard",
          description: "Post content has been copied to your clipboard",
        });
        
        // Reset the copied state after 2 seconds
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
        toast({
          title: "Copy failed",
          description: "Failed to copy to clipboard",
          variant: "destructive",
        });
      });
  };

  const handleSavePost = () => {
    if (onSave) {
      setSaving(true);
      try {
        onSave();
      } finally {
        // Reset saving state after a short delay to show the animation
        setTimeout(() => setSaving(false), 1000);
      }
    }
  };

  // Split the content to find hashtags that might be embedded in the text
  const formatContent = () => {
    // If the content already contains hashtags at the end, we'll display them separately
    const contentParts = content.split(/\n\n(?=#)/);
    return contentParts[0]; // Return just the main content without the hashtags
  };

  return (
    <Card className="overflow-hidden border shadow-sm hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-semibold text-lg">{title}</h3>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 hover-scale"
              onClick={handleCopyToClipboard}
            >
              {copied ? (
                <>
                  <CheckCircle size={14} className="text-green-500" />
                  <span className="text-xs">Copied</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span className="text-xs">Copy</span>
                </>
              )}
            </Button>
            
            {onSave && (
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1 hover-scale"
                onClick={handleSavePost}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <div className="animate-spin h-3.5 w-3.5 border-2 border-primary border-t-transparent rounded-full"></div>
                    <span className="text-xs">Saving</span>
                  </>
                ) : (
                  <>
                    <Save size={14} />
                    <span className="text-xs">Save</span>
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
        
        <div className="prose prose-sm max-w-none">
          <p className="whitespace-pre-wrap text-sm text-gray-700">{formatContent()}</p>
        </div>
        
        {hashtags && hashtags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1">
            {hashtags.map((tag, index) => (
              <span
                key={index}
                className="text-xs bg-blue-50 text-linkedBlue px-2 py-1 rounded-full"
              >
                {tag.startsWith('#') ? tag : `#${tag}`}
              </span>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

export default PostCard;
