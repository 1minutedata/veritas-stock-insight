-- Create scraped_leads table
CREATE TABLE public.scraped_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  email TEXT NOT NULL,
  title TEXT,
  platform TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  scraped_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.scraped_leads ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can access their own scraped leads"
ON public.scraped_leads
FOR ALL
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_scraped_leads_updated_at
BEFORE UPDATE ON public.scraped_leads
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_scraped_leads_user_id ON public.scraped_leads(user_id);
CREATE INDEX idx_scraped_leads_status ON public.scraped_leads(status);
CREATE INDEX idx_scraped_leads_platform ON public.scraped_leads(platform);