
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

    // Process the API response to extract trends and hashtags
    const skills = data?.skills || [];
    
    // Transform skills into trending topics
    const trendingTopics = skills.slice(0, 10).map((skill: any, index: number) => {
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
    
    // Extract hashtags
    const trendingHashtags = Array.from(
      new Set(
        trendingTopics.flatMap((topic) => topic.hashtags)
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
