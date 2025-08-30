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

    // Use server-side secrets only
    const langflowApiKey = Deno.env.get('LANGFLOW_API_KEY');
    const baseUrl = (Deno.env.get('LANGFLOW_BASE_URL') || '').replace(/\/$/, '');
    const flowId = Deno.env.get('LANGFLOW_FLOW_ID') || '';

    if (!langflowApiKey) {
      throw new Error('Missing Langflow API key. Contact administrator to configure LANGFLOW_API_KEY secret.');
    }
    if (!baseUrl) {
      throw new Error('Missing Langflow base URL. Contact administrator to configure LANGFLOW_BASE_URL secret.');
    }
    if (!flowId) {
      throw new Error('Missing Langflow flow ID. Contact administrator to configure LANGFLOW_FLOW_ID secret.');
    }

    const payload = {
      output_type: "chat",
      input_type: "chat",
      input_value: message,
      session_id: sessionId || "user_1",
    };

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': langflowApiKey,
      },
      body: JSON.stringify(payload),
    } as RequestInit;

    const url = `${baseUrl}/api/v1/run/${flowId}`;
    console.log('Calling Langflow API URL:', url);
    console.log('Calling Langflow API with payload:', payload);

    const response = await fetch(url, options);

      throw new Error(`Langflow API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Langflow response:', data);

    const messageText =
      data?.outputs?.[0]?.outputs?.[0]?.results?.message?.text ||
      data?.outputs?.[0]?.outputs?.[0]?.artifacts?.message ||
      JSON.stringify(data);

    return new Response(JSON.stringify({
      success: true,
      response: data,
      message: messageText
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