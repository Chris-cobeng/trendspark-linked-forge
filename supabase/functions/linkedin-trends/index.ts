
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
    const rapidApiKey = Deno.env.get("RAPIDAPI_KEY");
    if (!rapidApiKey) {
      throw new Error("RAPIDAPI_KEY environment variable not set");
    }

    // Create a Supabase client for caching trend data
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get the OpenAI API key for refining topics
    const openAIApiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openAIApiKey) {
      console.warn("OPENAI_API_KEY not set, will use basic topic refinement");
    }

    // Check if we have cached trends that are recent (less than 6 hours old)
    const { data: cachedTrends, error: cacheError } = await supabase
      .from("linkedin_trends")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1);

    if (cachedTrends && cachedTrends.length > 0) {
      const lastUpdate = new Date(cachedTrends[0].created_at);
      const now = new Date();
      const hoursSinceUpdate = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60);
      
      // If we have recent cached data, return it
      if (hoursSinceUpdate < 6) {
        console.log("Returning cached LinkedIn trends data");
        return new Response(
          JSON.stringify({ 
            trends: cachedTrends[0].trends, 
            hashtags: cachedTrends[0].hashtags,
            source: "cache",
            updated_at: cachedTrends[0].created_at
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Set up the fetch request to RapidAPI
    const leaders = ["tonyrobbins", "simonsinek", "garyvee", "brianacosta", "danielpink", "tedgaubert"];
    const randomUser = leaders[Math.floor(Math.random() * leaders.length)];

    const url = `https://linkedin-api8.p.rapidapi.com/profiles/position-skills?username=${randomUser}`;
    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-host": "linkedin-api8.p.rapidapi.com",
        "x-rapidapi-key": rapidApiKey,
      },
    };

    console.log("Fetching fresh LinkedIn trends data");
    const response = await fetch(url, options);
    const data = await response.json();

    // Process the API response to extract skills
    const skills = data?.skills || [];
    
    let trendingTopics = [];
    
    // Use OpenAI to refine topics if API key is available
    if (openAIApiKey && skills.length > 0) {
      try {
        // Extract raw skills for OpenAI to process
        const rawSkills = skills.slice(0, 15).map((skill: any) => skill.name).filter(Boolean).join(", ");
        
        // Call OpenAI to refine these into better LinkedIn topics
        const openAIResponse = await fetch("https://api.openai.com/v1/chat/completions", {
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
                content: "You are an expert on LinkedIn content and professional trends. Transform raw skills into engaging LinkedIn post topics that professionals would want to read about. Make them specific, actionable, and appealing."
              },
              { 
                role: "user", 
                content: `Transform these raw skills and keywords into 8 specific, engaging LinkedIn post topics that professionals would find valuable: ${rawSkills}. For each topic, include: 1) An engaging title, 2) A brief description, 3) Related hashtags, 4) Related keywords. Format as JSON.` 
              }
            ],
            temperature: 0.7,
          }),
        });
        
        const aiData = await openAIResponse.json();
        const aiContent = aiData.choices[0]?.message?.content;
        
        // Parse the AI-generated content
        try {
          const parsedContent = JSON.parse(aiContent);
          if (Array.isArray(parsedContent)) {
            trendingTopics = parsedContent.map((item, index) => ({
              id: index + 1,
              topic: item.title || `Professional Topic ${index + 1}`,
              description: item.description || `Trending discussions about professional development`,
              engagement: Math.floor(Math.random() * 20) + 75, 
              growth: Math.floor(Math.random() * 20) + 5,
              hashtags: item.hashtags || [`#Professional${index + 1}`, "#LinkedInStrategy"],
              relatedTopics: item.keywords || ["Professional Development"]
            }));
          } else if (parsedContent.topics && Array.isArray(parsedContent.topics)) {
            trendingTopics = parsedContent.topics.map((item, index) => ({
              id: index + 1,
              topic: item.title || `Professional Topic ${index + 1}`,
              description: item.description || `Trending discussions about professional development`,
              engagement: Math.floor(Math.random() * 20) + 75, 
              growth: Math.floor(Math.random() * 20) + 5,
              hashtags: item.hashtags || [`#Professional${index + 1}`, "#LinkedInStrategy"],
              relatedTopics: item.keywords || ["Professional Development"]
            }));
          }
        } catch (parseError) {
          console.error("Error parsing AI response:", parseError);
          // Fall back to standard processing if AI response parsing fails
        }
      } catch (aiError) {
        console.error("Error refining topics with AI:", aiError);
        // Continue with standard processing if AI refinement fails
      }
    }
    
    // If AI processing failed or wasn't available, use standard processing
    if (trendingTopics.length === 0) {
      // Transform skills into trending topics using standard approach
      trendingTopics = skills.slice(0, 8).map((skill: any, index: number) => {
        const topics = [
          "Remote Work", "AI in Business", "Personal Branding", 
          "Leadership Skills", "Digital Transformation", "Work-Life Balance",
          "Content Marketing", "Networking Strategies", "Career Development",
          "Team Management", "Industry Insights", "Professional Growth"
        ];
        
        const hashtags = [
          "#RemoteWork", "#AIBusiness", "#PersonalBranding", 
          "#Leadership", "#DigitalTransformation", "#WorkLifeBalance",
          "#ContentMarketing", "#ProfessionalNetworking", "#CareerGrowth",
          "#TeamManagement", "#IndustryInsights", "#ProfessionalDevelopment"
        ];
        
        // Use the skill name or fall back to a predefined topic
        const topicName = skill.name || topics[index % topics.length];
        
        return {
          id: index + 1,
          topic: topicName,
          description: `Trending discussions about ${topicName} in professional settings`,
          engagement: Math.floor(Math.random() * 20) + 75, // Random engagement score between 75-95
          growth: Math.floor(Math.random() * 20) + 5, // Random growth between 5-25%
          hashtags: [
            `#${topicName.replace(/\s+/g, "")}`, 
            hashtags[index % hashtags.length], 
            `#${skill.name?.replace(/\s+/g, "")}` || "#Professional"
          ].filter((v, i, a) => a.indexOf(v) === i), // Remove duplicates
          relatedTopics: skills
            .filter((_: any, i: number) => i !== index) // Exclude current skill
            .slice(0, 3)
            .map((s: any) => s.name || topics[(index + 1) % topics.length])
        };
      });
    }
    
    // Extract hashtags from all topics
    const trendingHashtags = Array.from(
      new Set(
        trendingTopics.flatMap((topic: any) => topic.hashtags)
          .concat([
            "#LeadershipSkills", "#ArtificialIntelligence", "#RemoteWork", 
            "#DigitalTransformation", "#CareerAdvice", "#Innovation", 
            "#ProfessionalDevelopment", "#Networking", "#StartupLife",
            "#LinkedInTips", "#WorkCulture", "#FutureOfWork"
          ])
      )
    ).slice(0, 15);

    // Store the processed data in Supabase for caching
    const trendsData = {
      trends: trendingTopics,
      hashtags: trendingHashtags,
      created_at: new Date().toISOString(),
    };
    
    const { error: insertError } = await supabase
      .from("linkedin_trends")
      .insert(trendsData);
    
    if (insertError) {
      console.error("Error caching trend data:", insertError);
    }

    return new Response(
      JSON.stringify({ 
        trends: trendingTopics, 
        hashtags: trendingHashtags,
        source: "api",
        updated_at: trendsData.created_at
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error fetching LinkedIn trends:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
