
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { topic, trendingHashtags = [], postType } = await req.json();
    
    if (!topic) {
      return new Response(
        JSON.stringify({ error: 'Topic is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create a prompt based on the post type
    let prompt = '';
    let systemPrompt = 'You are a professional LinkedIn content creator who specializes in creating engaging, insightful posts.';
    
    switch (postType) {
      case 'insightful':
        systemPrompt += ' Create an insightful perspective post that demonstrates thought leadership.';
        prompt = `Write a LinkedIn post about "${topic}" that offers a unique perspective or insight. The post should be between 100-250 words, professional in tone, and end with a question to encourage engagement. Incorporate these hashtags at the end: ${trendingHashtags.join(', ')} and #${topic.replace(/\s+/g, '')}`;
        break;
      case 'story':
        systemPrompt += ' Create a personal story post that connects with readers emotionally while maintaining professionalism.';
        prompt = `Write a LinkedIn post about "${topic}" in the form of a personal story or journey. The post should be between 100-250 words, start with a hook, include a challenge and resolution, and end with a lesson or insight. Incorporate these hashtags at the end: ${trendingHashtags.join(', ')} and #${topic.replace(/\s+/g, '')}Journey`;
        break;
      case 'callToAction':
        systemPrompt += ' Create a compelling call-to-action post that motivates readers to take action.';
        prompt = `Write a LinkedIn post about "${topic}" that includes a strong call to action. The post should be between 100-250 words, highlight a problem or opportunity related to ${topic}, propose a solution or resource, and explicitly ask readers to take a specific action (comment, share, sign up, etc.). Incorporate these hashtags at the end: ${trendingHashtags.join(', ')} and #${topic.replace(/\s+/g, '')}Experts`;
        break;
      default:
        systemPrompt += ' Create a balanced, engaging post with broad appeal.';
        prompt = `Write a professional LinkedIn post about "${topic}". The post should be between 100-250 words, engaging, and incorporate these hashtags at the end: ${trendingHashtags.join(', ')} and #${topic.replace(/\s+/g, '')}`;
    }

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Using the most cost-effective model that's still powerful
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7, // Balancing creativity with coherence
        max_tokens: 500, // Sufficient for LinkedIn posts
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      console.error('OpenAI API error:', data.error);
      return new Response(
        JSON.stringify({ error: 'Failed to generate post', details: data.error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const generatedPost = data.choices[0].message.content;
    const title = postType === 'insightful' ? 'Insightful Perspective' : 
                 postType === 'story' ? 'Personal Story' : 
                 postType === 'callToAction' ? 'Call to Action' : 'LinkedIn Post';

    return new Response(
      JSON.stringify({ 
        title,
        content: generatedPost,
        hashtags: [...trendingHashtags, `#${topic.replace(/\s+/g, '')}`]
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in generate-linkedin-post function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
