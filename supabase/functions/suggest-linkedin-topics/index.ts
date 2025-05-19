
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
            content: "You are an expert on LinkedIn engagement and professional content. Generate 6 high-quality LinkedIn post topic ideas that professionals would find valuable and engaging. Each topic should be specific, actionable, and include a title, emoji icon, trending status (first 3 true, rest false), and brief description (15-20 words). Format as JSON with a 'topics' array containing objects with these fields."
          },
          { 
            role: "user", 
            content: userInput ? 
              `Generate LinkedIn post topic ideas related to: ${userInput}` : 
              "Generate trending LinkedIn post topic ideas for professionals" 
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
    let parsedData;
    try {
      parsedData = JSON.parse(data.choices[0].message.content);
      
      if (!parsedData.topics || !Array.isArray(parsedData.topics)) {
        throw new Error("Invalid response format");
      }
      
      // Format topics consistently
      const formattedTopics = parsedData.topics.map((topic, index) => ({
        id: index + 1,
        label: topic.title || topic.label || "LinkedIn Topic",
        icon: topic.emoji || "✨",
        trending: topic.trending !== undefined ? topic.trending : (index < 3),
        description: topic.description || "AI suggested LinkedIn topic"
      }));
      
      return new Response(
        JSON.stringify({ topics: formattedTopics }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } catch (error) {
      console.error("Error parsing OpenAI response:", error);
      throw new Error("Failed to parse topic suggestions");
    }
  } catch (error) {
    console.error("Error suggesting LinkedIn topics:", error);
    
    return new Response(
      JSON.stringify({ error: error.message, topics: [] }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
