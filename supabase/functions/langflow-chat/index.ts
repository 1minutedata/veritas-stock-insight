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
    const { message, sessionId, baseUrl: bodyBaseUrl, flowId: bodyFlowId, apiKey: providedApiKey } = await req.json();

    const envApiKey = Deno.env.get('LANGFLOW_API_KEY');
    const langflowApiKey = providedApiKey || envApiKey;
    if (!langflowApiKey) {
      throw new Error('Missing Langflow API key. Add LANGFLOW_API_KEY secret or provide apiKey in request body.');
    }

    const envBaseUrl = Deno.env.get('LANGFLOW_BASE_URL');
    const envFlowId = Deno.env.get('LANGFLOW_FLOW_ID');
    const baseUrl = (bodyBaseUrl || envBaseUrl || '').replace(/\/$/, '');
    const flowId = bodyFlowId || envFlowId || '';

    if (!baseUrl) {
      throw new Error('Missing Langflow baseUrl. Provide baseUrl in body or set LANGFLOW_BASE_URL secret.');
    }
    if (!flowId) {
      throw new Error('Missing Langflow flowId. Provide flowId in body or set LANGFLOW_FLOW_ID secret.');
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