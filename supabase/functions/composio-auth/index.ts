import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ComposioAuthRequest {
  action: 'initiate' | 'getTools' | 'executeAction' | 'checkConnection';
  userId?: string;
  authConfigId?: string;
  tools?: string[];
  actionData?: any;
  connectionRequestId?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, userId, authConfigId, tools, actionData, connectionRequestId }: ComposioAuthRequest = await req.json();
    const composioApiKey = Deno.env.get('COMPOSIO_API_KEY');

    if (!composioApiKey) {
      throw new Error('COMPOSIO_API_KEY not configured');
    }

    const baseUrl = 'https://backend.composio.dev/api/v1';

    switch (action) {
      case 'initiate':
        if (!userId || !authConfigId) {
          throw new Error('userId and authConfigId are required for initiation');
        }

        console.log(`Initiating connection for user: ${userId} with auth config: ${authConfigId}`);

        const initiateResponse = await fetch(`${baseUrl}/connected_accounts/initiate`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${composioApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: userId,
            auth_config_id: authConfigId,
          }),
        });

        if (!initiateResponse.ok) {
          const errorText = await initiateResponse.text();
          console.error(`Failed to initiate connection: ${initiateResponse.status} ${initiateResponse.statusText}`, errorText);
          throw new Error(`Failed to initiate connection: ${initiateResponse.status} ${initiateResponse.statusText}`);
        }

        const initiateData = await initiateResponse.json();
        console.log('Connection initiation successful:', initiateData);
        
        return new Response(JSON.stringify(initiateData), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      case 'checkConnection':
        if (!connectionRequestId) {
          throw new Error('connectionRequestId is required for checking connection');
        }

        const checkResponse = await fetch(`${baseUrl}/connected_accounts/wait_for_connection/${connectionRequestId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${composioApiKey}`,
          },
        });

        if (!checkResponse.ok) {
          throw new Error(`Failed to check connection: ${checkResponse.statusText}`);
        }

        const checkData = await checkResponse.json();
        return new Response(JSON.stringify(checkData), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      case 'getTools':
        if (!userId || !tools) {
          throw new Error('userId and tools are required');
        }

        const toolsResponse = await fetch(`${baseUrl}/tools`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${composioApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: userId,
            tools: tools,
          }),
        });

        if (!toolsResponse.ok) {
          throw new Error(`Failed to get tools: ${toolsResponse.statusText}`);
        }

        const toolsData = await toolsResponse.json();
        return new Response(JSON.stringify(toolsData), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      case 'executeAction':
        if (!userId || !actionData) {
          throw new Error('userId and actionData are required');
        }

        const executeResponse = await fetch(`${baseUrl}/tools/execute`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${composioApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: userId,
            ...actionData,
          }),
        });

        if (!executeResponse.ok) {
          throw new Error(`Failed to execute action: ${executeResponse.statusText}`);
        }

        const executeData = await executeResponse.json();
        return new Response(JSON.stringify(executeData), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      default:
        throw new Error('Invalid action');
    }

  } catch (error: any) {
    console.error('Error in composio-auth function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});