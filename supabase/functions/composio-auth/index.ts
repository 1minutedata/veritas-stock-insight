import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ComposioAuthRequest {
  action: 'initiate' | 'getTools' | 'executeAction';
  userId?: string;
  authConfigId?: string;
  tools?: string[];
  actionData?: any;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, userId, authConfigId, tools, actionData }: ComposioAuthRequest = await req.json();
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
          throw new Error(`Failed to initiate connection: ${initiateResponse.statusText}`);
        }

        const initiateData = await initiateResponse.json();
        return new Response(JSON.stringify(initiateData), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      case 'getTools':
        if (!userId || !tools) {
          throw new Error('userId and tools are required');
        }

        const toolsResponse = await fetch(`${baseUrl}/tools`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${composioApiKey}`,
            'X-User-ID': userId,
          },
        });

        if (!toolsResponse.ok) {
          throw new Error(`Failed to get tools: ${toolsResponse.statusText}`);
        }

        const toolsData = await toolsResponse.json();
        const filteredTools = toolsData.filter((tool: any) => 
          tools.includes(tool.name)
        );

        return new Response(JSON.stringify({ tools: filteredTools }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      case 'executeAction':
        if (!userId || !actionData) {
          throw new Error('userId and actionData are required');
        }

        const executeResponse = await fetch(`${baseUrl}/actions/execute`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${composioApiKey}`,
            'Content-Type': 'application/json',
            'X-User-ID': userId,
          },
          body: JSON.stringify(actionData),
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