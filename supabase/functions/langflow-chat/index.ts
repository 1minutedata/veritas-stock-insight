import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const { message, sessionId } = await req.json();

    const langflowApiKey = Deno.env.get('LANGFLOW_API_KEY');
    if (!langflowApiKey) {
      throw new Error('LANGFLOW_API_KEY environment variable not found');
    }

    const payload = {
      "output_type": "chat",
      "input_type": "chat", 
      "input_value": message,
      "session_id": sessionId || "user_1"
    };

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "x-api-key": langflowApiKey
      },
      body: JSON.stringify(payload)
    };

    console.log('Calling Langflow API with payload:', payload);

    const response = await fetch('http://localhost:7860/api/v1/run/fd85ef34-7199-4446-b7b9-11daa1f1f73d', options);
    
    if (!response.ok) {
      throw new Error(`Langflow API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Langflow response:', data);

    return new Response(JSON.stringify({
      success: true,
      response: data,
      message: data.outputs?.[0]?.outputs?.[0]?.results?.message?.text || "No response from Langflow"
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in langflow-chat function:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});