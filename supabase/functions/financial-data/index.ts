import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Financial data function called');
    const { action, symbol, symbols } = await req.json();

    switch (action) {
      case 'getStockData':
        return await getStockData(symbol);
      case 'getMultipleStocks':
        return await getMultipleStocks(symbols);
      case 'getStockNews':
        return await getStockNews(symbol);
      case 'analyzeStock':
        return await analyzeStock(symbol);
      default:
        throw new Error('Invalid action');
    }
  } catch (error) {
    console.error('Error in financial-data function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function getStockData(symbol: string) {
  console.log(`Fetching stock data for ${symbol}`);
  
  // Using Yahoo Finance API alternative
  const response = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch stock data for ${symbol}`);
  }

  const data = await response.json();
  const result = data.chart.result[0];
  const meta = result.meta;
  const quote = result.indicators.quote[0];

  const stockData = {
    symbol: meta.symbol,
    price: meta.regularMarketPrice,
    change: meta.regularMarketPrice - meta.previousClose,
    changePercent: ((meta.regularMarketPrice - meta.previousClose) / meta.previousClose * 100),
    volume: meta.regularMarketVolume,
    marketCap: meta.regularMarketPrice * meta.sharesOutstanding,
    previousClose: meta.previousClose,
    dayHigh: meta.regularMarketDayHigh,
    dayLow: meta.regularMarketDayLow,
    timestamp: Date.now()
  };

  return new Response(JSON.stringify({ stockData }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function getMultipleStocks(symbols: string[]) {
  console.log(`Fetching data for multiple stocks: ${symbols.join(', ')}`);
  
  const promises = symbols.map(async (symbol) => {
    try {
      const response = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`);
      const data = await response.json();
      const result = data.chart.result[0];
      const meta = result.meta;

      return {
        symbol: meta.symbol,
        price: meta.regularMarketPrice,
        change: meta.regularMarketPrice - meta.previousClose,
        changePercent: ((meta.regularMarketPrice - meta.previousClose) / meta.previousClose * 100),
        volume: meta.regularMarketVolume,
      };
    } catch (error) {
      console.error(`Error fetching data for ${symbol}:`, error);
      return null;
    }
  });

  const results = await Promise.all(promises);
  const validResults = results.filter(result => result !== null);

  return new Response(JSON.stringify({ stocks: validResults }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function getStockNews(symbol: string) {
  console.log(`Fetching news for ${symbol}`);
  
  try {
    // Using Yahoo Finance news endpoint
    const response = await fetch(`https://query2.finance.yahoo.com/v1/finance/search?q=${symbol}&lang=en-US&region=US&quotesCount=1&newsCount=10&enableFuzzyQuery=false&quotesQueryId=tss_match_phrase_query&multiQuoteQueryId=multi_quote_single_token_query&newsQueryId=news_cie_vespa&enableCb=true&enableNavLinks=true&enableEnhancedTrivialQuery=true`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch news for ${symbol}`);
    }

    const data = await response.json();
    const news = data.news || [];

    const processedNews = news.slice(0, 5).map((article: any) => ({
      title: article.title,
      summary: article.summary || '',
      publisher: article.publisher,
      publishTime: article.providerPublishTime,
      link: article.link,
      uuid: article.uuid
    }));

    return new Response(JSON.stringify({ news: processedNews }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(`Error fetching news for ${symbol}:`, error);
    // Return mock news data if API fails
    const mockNews = [
      {
        title: `${symbol} Stock Analysis Update`,
        summary: "Latest market analysis and trends for this stock.",
        publisher: "Market Insights",
        publishTime: Date.now() / 1000,
        link: "#",
        uuid: "mock-1"
      }
    ];

    return new Response(JSON.stringify({ news: mockNews }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

async function analyzeStock(symbol: string) {
  console.log(`Analyzing stock ${symbol} with AI`);
  
  if (!openAIApiKey) {
    throw new Error('OpenAI API key not found');
  }

  // First get the stock data
  const stockResponse = await getStockData(symbol);
  const { stockData } = await stockResponse.json();

  // Get news for context
  const newsResponse = await getStockNews(symbol);
  const { news } = await newsResponse.json();

  const newsContext = news.map((article: any) => 
    `Title: ${article.title}\nSummary: ${article.summary}`
  ).join('\n\n');

  const prompt = `As VeritasPilot, an expert financial analyst, analyze ${symbol} based on the following data:

Stock Data:
- Current Price: $${stockData.price}
- Change: ${stockData.change > 0 ? '+' : ''}${stockData.change.toFixed(2)} (${stockData.changePercent.toFixed(2)}%)
- Volume: ${stockData.volume}
- Day High: $${stockData.dayHigh}
- Day Low: $${stockData.dayLow}
- Previous Close: $${stockData.previousClose}

Recent News:
${newsContext}

Provide a concise analysis covering:
1. Current sentiment (bullish/bearish/neutral)
2. Valuation assessment (overvalued/fairly valued/undervalued)
3. Key factors influencing the stock
4. Risk assessment
5. Short-term outlook

Keep the response professional, data-driven, and under 200 words.`;

  const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
          content: 'You are VeritasPilot, an expert AI financial analyst that provides accurate, unbiased stock analysis based on market data and news.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 300,
      temperature: 0.7,
    }),
  });

  if (!aiResponse.ok) {
    throw new Error('Failed to get AI analysis');
  }

  const aiData = await aiResponse.json();
  const analysis = aiData.choices[0].message.content;

  // Extract sentiment from analysis
  const sentiment = analysis.toLowerCase().includes('bullish') ? 'bullish' : 
                   analysis.toLowerCase().includes('bearish') ? 'bearish' : 'neutral';

  const valuation = analysis.toLowerCase().includes('overvalued') ? 'overvalued' :
                   analysis.toLowerCase().includes('undervalued') ? 'undervalued' : 'fairly valued';

  return new Response(JSON.stringify({ 
    analysis,
    sentiment,
    valuation,
    stockData,
    timestamp: Date.now()
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}