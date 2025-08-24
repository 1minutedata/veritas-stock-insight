import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const composioApiKey = Deno.env.get('COMPOSIO_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userId } = await req.json();

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    if (!composioApiKey) {
      throw new Error('Composio API key not configured');
    }

    console.log('[jarvis-agent] Processing message:', { message, userId });

    // Get available tools from Composio
    const toolsResponse = await fetch('https://backend.composio.dev/api/v1/tools', {
      method: 'GET',
      headers: {
        'X-API-Key': composioApiKey,
        'Content-Type': 'application/json',
      },
    });

    if (!toolsResponse.ok) {
      throw new Error(`Failed to fetch tools: ${toolsResponse.statusText}`);
    }

    const toolsData = await toolsResponse.json();
    console.log('[jarvis-agent] Available tools:', toolsData);

    // Filter for Gmail, Slack, and QuickBooks tools
    const relevantTools = toolsData.tools?.filter((tool: any) => {
      const appName = tool.appName?.toLowerCase() || '';
      return appName.includes('gmail') || appName.includes('slack') || appName.includes('quickbooks');
    }) || [];

    console.log('[jarvis-agent] Relevant tools:', relevantTools);

    // Convert Composio tools to OpenAI function format
    const openAITools = relevantTools.map((tool: any) => ({
      type: 'function',
      function: {
        name: tool.name,
        description: tool.description,
        parameters: tool.parameters || {
          type: 'object',
          properties: {},
          required: []
        }
      }
    }));

    // Call OpenAI with the tools
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are Jarvis, an AI assistant that helps users execute tasks using Gmail, Slack, and QuickBooks tools. 
            
            When a user asks you to do something:
            1. Determine if it requires one of the available tools
            2. Extract the necessary parameters from their request
            3. Execute the appropriate tool
            4. Provide a helpful response about what was accomplished
            
            Available integrations:
            - Gmail: for sending emails
            - Slack: for posting messages to channels
            - QuickBooks: for creating financial entries
            
            Always be helpful and execute the requested actions when possible.`
          },
          {
            role: 'user',
            content: message
          }
        ],
        tools: openAITools,
        tool_choice: 'auto',
        max_tokens: 1000,
        temperature: 0.7
      }),
    });

    if (!openAIResponse.ok) {
      throw new Error(`OpenAI API error: ${openAIResponse.statusText}`);
    }

    const openAIData = await openAIResponse.json();
    console.log('[jarvis-agent] OpenAI response:', openAIData);

    const choice = openAIData.choices[0];
    let response = choice.message.content;

    // If OpenAI wants to call a tool, execute it via Composio
    if (choice.message.tool_calls && choice.message.tool_calls.length > 0) {
      console.log('[jarvis-agent] Executing tool calls:', choice.message.tool_calls);
      
      for (const toolCall of choice.message.tool_calls) {
        try {
          const toolName = toolCall.function.name;
          const toolArgs = JSON.parse(toolCall.function.arguments);
          
          console.log('[jarvis-agent] Executing tool:', { toolName, toolArgs });

          // Execute the tool via Composio
          const executeResponse = await fetch('https://backend.composio.dev/api/v1/tools/execute', {
            method: 'POST',
            headers: {
              'X-API-Key': composioApiKey,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: userId,
              toolName: toolName,
              input: toolArgs
            }),
          });

          if (!executeResponse.ok) {
            throw new Error(`Tool execution failed: ${executeResponse.statusText}`);
          }

          const executeData = await executeResponse.json();
          console.log('[jarvis-agent] Tool execution result:', executeData);
          
          response = `✅ Successfully executed ${toolName}. ${response || 'Task completed!'}`;
        } catch (toolError) {
          console.error('[jarvis-agent] Tool execution error:', toolError);
          response = `❌ Failed to execute tool: ${toolError.message}`;
        }
      }
    }

    return new Response(JSON.stringify({ response }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[jarvis-agent] Error:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      response: "Sorry, I encountered an error processing your request. Please try again."
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});