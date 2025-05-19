
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get API key from environment variables
    const openAIApiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openAIApiKey) {
      throw new Error("OPENAI_API_KEY environment variable not set");
    }

    // Get request params
    const { userInput } = await req.json();
    
    // Call OpenAI API to generate topic suggestions
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openAIApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { 
            role: "system", 
            content: "You are an expert on LinkedIn engagement and professional content. Generate 6 high-quality LinkedIn post topic ideas that professionals would find valuable and engaging. Each topic should be specific, actionable, and formatted with an emoji icon, title, and brief description."
          },
          { 
            role: "user", 
            content: userInput ? 
              `Generate LinkedIn post topic ideas related to: ${userInput}` : 
              "Generate trending LinkedIn post topic ideas for professionals" 
          }
        ],
        temperature: 0.7,
      }),
    });
    
    const data = await response.json();
    
    if (!data.choices || !data.choices[0]?.message?.content) {
      throw new Error("Invalid response from OpenAI API");
    }
    
    // Process the AI response
    const aiContent = data.choices[0].message.content.trim();
    
    // Parse the text into structured topics
    const topicRegex = /^(.*?):\s*(.*?)(?:\n|$)/gm;
    const topics = [];
    let match;
    let id = 1;
    
    // Extract topics from AI response text
    while ((match = topicRegex.exec(aiContent)) !== null && topics.length < 6) {
      const title = match[1].trim();
      const description = match[2].trim();
      
      // Extract emoji if present
      const emojiMatch = title.match(/^(\p{Emoji})\s+(.*)/u);
      let icon = "✨"; // Default icon
      let cleanTitle = title;
      
      if (emojiMatch) {
        icon = emojiMatch[1];
        cleanTitle = emojiMatch[2];
      }
      
      topics.push({
        id,
        label: cleanTitle,
        icon,
        trending: id <= 3, // Mark first 3 as trending
        description
      });
      
      id++;
    }
    
    // If we couldn't extract structured topics, create fallback topics
    if (topics.length === 0) {
      const lines = aiContent.split("\n").filter(line => line.trim() !== "");
      
      for (let i = 0; i < Math.min(lines.length, 6); i++) {
        const line = lines[i].trim();
        if (line) {
          topics.push({
            id: i + 1,
            label: line,
            icon: "✨",
            trending: (i + 1) <= 3,
            description: "AI suggested LinkedIn topic"
          });
        }
      }
    }

    return new Response(
      JSON.stringify({ topics }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error suggesting LinkedIn topics:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
