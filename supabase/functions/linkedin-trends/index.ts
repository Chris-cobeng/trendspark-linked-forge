
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

    // Call OpenAI API to generate trending topics
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
            content: "You are an expert on LinkedIn content trends and professional engagement. Generate 20 trending topics for LinkedIn posts that professionals would find valuable. For each topic, provide: 1) A short, engaging title, 2) A relevant emoji, 3) A brief description (15-20 words), and 4) If it's trending (mark the top 8 as trending). Format your response as a structured JSON array without any explanations."
          }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" },
      }),
    });
    
    const data = await response.json();
    
    if (!data.choices || !data.choices[0]?.message?.content) {
      throw new Error("Invalid response from OpenAI API");
    }
    
    // Process the AI response
    let parsedTopics;
    try {
      parsedTopics = JSON.parse(data.choices[0].message.content);
    } catch (error) {
      console.error("Error parsing OpenAI response:", error);
      throw new Error("Failed to parse topics from OpenAI");
    }
    
    // Return the topics
    return new Response(
      JSON.stringify(parsedTopics),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error generating LinkedIn trends:", error);
    
    // Return a structured error response
    return new Response(
      JSON.stringify({ 
        error: error.message,
        topics: [] 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
