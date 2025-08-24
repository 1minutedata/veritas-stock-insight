
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Composio } from "npm:@composio/core";
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

type AttemptResult<T = any> = {
  ok: boolean;
  url: string;
  method: string;
  status?: number;
  statusText?: string;
  bodySnippet?: string;
  data?: T;
  error?: string;
};

const MAX_SNIPPET_LEN = 400;

const baseUrlV2 = 'https://backend.composio.dev/api/v2';
const baseUrlV1 = 'https://backend.composio.dev/api/v1';

function safeSnippet(text: string | undefined | null, maxLen = MAX_SNIPPET_LEN) {
  if (!text) return '';
  return text.slice(0, maxLen);
}

async function attemptFetchJson(url: string, init: RequestInit): Promise<AttemptResult> {
  const method = (init.method || 'GET').toUpperCase();
  console.log(`[composio-auth] Attempting ${method} ${url}`);
  try {
    const res = await fetch(url, init);
    const status = res.status;
    const statusText = res.statusText;
    const rawText = await res.text();
    const bodySnippet = safeSnippet(rawText);
    console.log(`[composio-auth] Response ${status} ${statusText} from ${url}. Snippet: ${bodySnippet}`);

    if (!res.ok) {
      return { ok: false, url, method, status, statusText, bodySnippet };
    }

    // Try parse JSON (if not JSON, return raw parsed to JSON response)
    try {
      const data = rawText ? JSON.parse(rawText) : {};
      return { ok: true, url, method, status, statusText, data };
    } catch (e) {
      console.warn(`[composio-auth] Non-JSON response from ${url}. Returning raw text snippet.`);
      return { ok: true, url, method, status, statusText, bodySnippet };
    }
  } catch (err: any) {
    console.error(`[composio-auth] Fetch error for ${url}:`, err?.message || err);
    return { ok: false, url, method, error: err?.message || String(err) };
  }
}

// Create Composio SDK client (falls back to REST if SDK is unavailable)
function createComposioClient(apiKey: string) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new Composio({ apiKey } as any);
  } catch (_e) {
    return null;
  }
}

async function initiateConnection(composioApiKey: string, userId: string, authConfigId: string) {
  const results: AttemptResult[] = [];

  // Try SDK first for maximum compatibility
  try {
    const client = createComposioClient(composioApiKey);
    if (client) {
      const conn = await (client as any).connectedAccounts.initiate(userId, authConfigId);
      return {
        success: true,
        result: {
          ok: true,
          url: 'sdk://connectedAccounts.initiate',
          method: 'SDK',
          status: 200,
          statusText: 'OK',
          data: conn,
        },
        attempts: [
          { ok: true, url: 'sdk://connectedAccounts.initiate', method: 'SDK', status: 200, statusText: 'OK' },
        ],
      };
    }
  } catch (e: any) {
    results.push({ ok: false, url: 'sdk://connectedAccounts.initiate', method: 'SDK', error: e?.message || String(e) });
  }

  // Fallback to REST endpoints (multiple variants)
  const attempts = [
    {
      url: `${baseUrlV2}/connectedAccounts/initiate`,
      method: 'POST',
      body: JSON.stringify({ userId, authConfigId }),
      headers: { 'X-API-Key': composioApiKey, 'Content-Type': 'application/json' },
    },
    {
      url: `${baseUrlV2}/connected_accounts/initiate`,
      method: 'POST',
      body: JSON.stringify({ user_id: userId, auth_config_id: authConfigId }),
      headers: { 'X-API-Key': composioApiKey, 'Content-Type': 'application/json' },
    },
    {
      url: `${baseUrlV1}/connected_accounts/initiate`,
      method: 'POST',
      body: JSON.stringify({ user_id: userId, auth_config_id: authConfigId }),
      headers: { 'X-API-Key': composioApiKey, 'Content-Type': 'application/json' },
    },
  ];

  for (const a of attempts) {
    const res = await attemptFetchJson(a.url, { method: a.method, headers: a.headers, body: a.body });
    results.push(res);
    if (res.ok) return { success: true, result: res, attempts: results };
  }
  return { success: false, attempts: results };
}

async function checkConnection(composioApiKey: string, connectionRequestId: string) {
  const results: AttemptResult[] = [];

  // Try SDK first: wait for connection to be ready or return current status
  try {
    const client = createComposioClient(composioApiKey);
    if (client) {
      const conn = await (client as any).connectedAccounts.waitForConnection(connectionRequestId);
      return {
        success: true,
        result: {
          ok: true,
          url: 'sdk://connectedAccounts.waitForConnection',
          method: 'SDK',
          status: 200,
          statusText: 'OK',
          data: conn,
        },
        attempts: [
          { ok: true, url: 'sdk://connectedAccounts.waitForConnection', method: 'SDK', status: 200, statusText: 'OK' },
        ],
      };
    }
  } catch (e: any) {
    results.push({ ok: false, url: 'sdk://connectedAccounts.waitForConnection', method: 'SDK', error: e?.message || String(e) });
  }

  // Fallback to REST
  const attempts = [
    {
      url: `${baseUrlV2}/connectedAccounts/${connectionRequestId}/status`,
      method: 'GET',
      headers: { 'X-API-Key': composioApiKey },
    },
    {
      url: `${baseUrlV2}/connected_accounts/${connectionRequestId}/status`,
      method: 'GET',
      headers: { 'X-API-Key': composioApiKey },
    },
    {
      url: `${baseUrlV1}/connected_accounts/wait_for_connection/${connectionRequestId}`,
      method: 'GET',
      headers: { 'X-API-Key': composioApiKey },
    },
  ];

  for (const a of attempts) {
    const res = await attemptFetchJson(a.url, { method: a.method, headers: a.headers });
    results.push(res);
    if (res.ok) return { success: true, result: res, attempts: results };
  }
  return { success: false, attempts: results };
}

async function getToolsOrActions(composioApiKey: string, userId: string, tools?: string[]) {
  // Prefer v2 GET /actions; fallback to v1 POST /tools
  const attempts = [
    {
      url: `${baseUrlV2}/actions`,
      method: 'GET',
      headers: { 'X-API-Key': composioApiKey, 'Content-Type': 'application/json' },
    },
    {
      url: `${baseUrlV1}/tools`,
      method: 'POST',
      body: JSON.stringify({ user_id: userId, tools }),
      headers: { 'X-API-Key': composioApiKey, 'Content-Type': 'application/json' },
    },
  ];

  const results: AttemptResult[] = [];
  for (const a of attempts) {
    const res = await attemptFetchJson(a.url, { method: a.method, headers: a.headers, body: a.body });
    results.push(res);
    if (res.ok) return { success: true, result: res, attempts: results };
  }
  return { success: false, attempts: results };
}

async function executeAction(composioApiKey: string, userId: string, actionData: any) {
  // v2 POST /actions/execute expects { userId, action, parameters }
  // v1 POST /tools/execute expects { user_id, tool, arguments }
  const attempts = [
    {
      url: `${baseUrlV2}/actions/execute`,
      method: 'POST',
      body: JSON.stringify({ userId, ...actionData }),
      headers: { 'X-API-Key': composioApiKey, 'Content-Type': 'application/json' },
    },
    {
      url: `${baseUrlV1}/tools/execute`,
      method: 'POST',
      body: JSON.stringify({
        user_id: userId,
        tool: actionData?.action,
        arguments: actionData?.parameters,
      }),
      headers: { 'X-API-Key': composioApiKey, 'Content-Type': 'application/json' },
    },
  ];

  const results: AttemptResult[] = [];
  for (const a of attempts) {
    const res = await attemptFetchJson(a.url, { method: a.method, headers: a.headers, body: a.body });
    results.push(res);
    if (res.ok) return { success: true, result: res, attempts: results };
  }
  return { success: false, attempts: results };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  let parsed: ComposioAuthRequest | null = null;
  try {
    parsed = await req.json();
  } catch (e: any) {
    console.error('[composio-auth] Failed to parse JSON body:', e?.message || e);
    return new Response(JSON.stringify({ error: 'Invalid JSON body', details: e?.message || String(e) }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const { action, userId, authConfigId, tools, actionData, connectionRequestId } = parsed || {};
  console.log('[composio-auth] Incoming request:', { action, userIdPresent: !!userId, hasActionData: !!actionData, connectionRequestId });

  try {
    const composioApiKey = Deno.env.get('COMPOSIO_API_KEY');
    if (!composioApiKey) {
      console.error('[composio-auth] Missing COMPOSIO_API_KEY in environment');
      return new Response(JSON.stringify({ error: 'COMPOSIO_API_KEY not configured' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    switch (action) {
      case 'initiate': {
        if (!userId || !authConfigId) {
          return new Response(JSON.stringify({ error: 'userId and authConfigId are required for initiation' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        console.log(`[composio-auth] Initiating connection for user: ${userId} with auth config: ${authConfigId}`);
        const result = await initiateConnection(composioApiKey, userId, authConfigId);

        if (!result.success) {
          console.error('[composio-auth] Initiation failed. Attempt details:', result.attempts);
          return new Response(JSON.stringify({
            error: 'Failed to initiate connection',
            attempts: result.attempts,
          }), {
            status: 502,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        console.log('[composio-auth] Connection initiation successful:', result.result?.data || result.result?.bodySnippet);
        return new Response(JSON.stringify(result.result?.data ?? { ok: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'checkConnection': {
        if (!connectionRequestId) {
          return new Response(JSON.stringify({ error: 'connectionRequestId is required for checking connection' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const result = await checkConnection(composioApiKey, connectionRequestId);
        if (!result.success) {
          console.error('[composio-auth] Check connection failed. Attempt details:', result.attempts);
          return new Response(JSON.stringify({
            error: 'Failed to check connection',
            attempts: result.attempts,
          }), {
            status: 502,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        return new Response(JSON.stringify(result.result?.data ?? { ok: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'getTools': {
        if (!userId) {
          return new Response(JSON.stringify({ error: 'userId is required' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const result = await getToolsOrActions(composioApiKey, userId, tools);
        if (!result.success) {
          console.error('[composio-auth] Get tools/actions failed. Attempt details:', result.attempts);
          return new Response(JSON.stringify({
            error: 'Failed to get tools/actions',
            attempts: result.attempts,
          }), {
            status: 502,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        return new Response(JSON.stringify(result.result?.data ?? { ok: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'executeAction': {
        if (!userId || !actionData) {
          return new Response(JSON.stringify({ error: 'userId and actionData are required' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        console.log('[composio-auth] Executing action:', { userId, actionData });
        const result = await executeAction(composioApiKey, userId, actionData);
        if (!result.success) {
          console.error('[composio-auth] Execute action failed. Attempt details:', result.attempts);
          return new Response(JSON.stringify({
            error: 'Failed to execute action',
            attempts: result.attempts,
          }), {
            status: 502,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        return new Response(JSON.stringify(result.result?.data ?? { ok: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
  } catch (error: any) {
    console.error('Error in composio-auth function (outer catch):', error);
    return new Response(JSON.stringify({ error: error?.message || 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
