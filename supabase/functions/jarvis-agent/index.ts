import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface JarvisRequest {
  userId: string;
  message: string;
  connectedIntegrations: string[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, message, connectedIntegrations }: JarvisRequest = await req.json();
    
    console.log(`[jarvis-agent] Processing request for user: ${userId}`, { 
      message, 
      connectedIntegrations 
    });

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    const composioApiKey = Deno.env.get('COMPOSIO_API_KEY');

    if (!openaiApiKey || !composioApiKey) {
      console.error('[jarvis-agent] Missing required API keys');
      return new Response(JSON.stringify({ 
        error: 'Missing required API keys' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get available tools from Composio for connected integrations
    const toolkits = connectedIntegrations.map(integration => 
      integration.toUpperCase()
    ).filter(toolkit => ['GMAIL', 'SLACK', 'QUICKBOOKS'].includes(toolkit));

    console.log(`[jarvis-agent] Fetching tools for toolkits:`, toolkits);

    // Fetch tools from Composio
    const toolsResponse = await fetch('https://backend.composio.dev/api/v2/actions', {
      method: 'GET',
      headers: {
        'X-API-Key': composioApiKey,
        'Content-Type': 'application/json',
      },
    });

    let availableTools = [];
    if (toolsResponse.ok) {
      const toolsData = await toolsResponse.json();
      // Filter tools for connected integrations
      availableTools = (toolsData.items || [])
        .filter((tool: any) => {
          const toolName = tool.name || tool.slug || '';
          return toolkits.some(toolkit => toolName.startsWith(toolkit));
        })
        .slice(0, 10); // Limit to 10 most relevant tools
      
      console.log(`[jarvis-agent] Found ${availableTools.length} available tools`);
    } else {
      console.warn('[jarvis-agent] Failed to fetch tools from Composio');
    }

    // Create OpenAI tools format
    const openaiTools = availableTools.map((tool: any) => ({
      type: 'function',
      function: {
        name: tool.name || tool.slug,
        description: tool.description || `Execute ${tool.name || tool.slug}`,
        parameters: {
          type: 'object',
          properties: tool.parameters?.properties || {},
          required: tool.parameters?.required || [],
        },
      },
    }));

    console.log(`[jarvis-agent] Created ${openaiTools.length} OpenAI-formatted tools`);

    // Determine the appropriate system prompt based on connected integrations
    const systemPrompt = `You are Jarvis, an intelligent AI assistant that can execute actions across various platforms.

Available integrations: ${connectedIntegrations.join(', ')}

You can help with:
- Gmail: Send emails, read messages, manage inbox
- Slack: Send messages, create channels, manage workspace
- QuickBooks: Create entries, manage finances, generate reports

When a user asks you to do something, analyze their request and use the appropriate tool to execute the action. Always be helpful and execute the requested actions efficiently.

User ID: ${userId}`;

    // First, get OpenAI's response to determine what tools to call
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        tools: openaiTools,
        tool_choice: 'auto',
        temperature: 0.1,
      }),
    });

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      console.error('[jarvis-agent] OpenAI API error:', errorText);
      return new Response(JSON.stringify({ 
        error: 'Failed to process request with OpenAI',
        details: errorText 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const openaiData = await openaiResponse.json();
    console.log('[jarvis-agent] OpenAI response:', JSON.stringify(openaiData, null, 2));

    const choice = openaiData.choices[0];
    let assistantMessage = choice.message.content || 'I understand your request.';
    const toolCalls = choice.message.tool_calls || [];

    // Execute any tool calls
    const toolResults = [];
    for (const toolCall of toolCalls) {
      const functionName = toolCall.function.name;
      const functionArgs = JSON.parse(toolCall.function.arguments || '{}');
      
      console.log(`[jarvis-agent] Executing tool: ${functionName}`, functionArgs);

      try {
        // Execute the tool using Composio
        const executeResponse = await fetch(`https://wssfoultuhczalslwdmd.supabase.co/functions/v1/composio-auth`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'executeAction',
            userId: userId,
            actionData: {
              action: functionName,
              parameters: functionArgs,
            },
          }),
        });

        if (executeResponse.ok) {
          const executeData = await executeResponse.json();
          toolResults.push({
            toolCall: toolCall.id,
            result: executeData,
            success: true,
          });
          console.log(`[jarvis-agent] Tool ${functionName} executed successfully:`, executeData);
        } else {
          const errorData = await executeResponse.text();
          console.error(`[jarvis-agent] Tool ${functionName} execution failed:`, errorData);
          toolResults.push({
            toolCall: toolCall.id,
            result: { error: errorData },
            success: false,
          });
        }
      } catch (error) {
        console.error(`[jarvis-agent] Error executing tool ${functionName}:`, error);
        toolResults.push({
          toolCall: toolCall.id,
          result: { error: error.message },
          success: false,
        });
      }
    }

    // If tools were executed, get a final response from OpenAI
    if (toolResults.length > 0) {
      const finalMessages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
        choice.message,
        ...toolResults.map(result => ({
          role: 'tool',
          tool_call_id: result.toolCall,
          content: JSON.stringify(result.result),
        })),
      ];

      const finalResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: finalMessages,
          temperature: 0.1,
        }),
      });

      if (finalResponse.ok) {
        const finalData = await finalResponse.json();
        assistantMessage = finalData.choices[0].message.content;
        console.log('[jarvis-agent] Final assistant response:', assistantMessage);
      }
    }

    return new Response(JSON.stringify({
      message: assistantMessage,
      toolsExecuted: toolResults.length,
      success: true,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[jarvis-agent] Error:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false,
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});