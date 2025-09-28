
export type ParsedCommand =
  | { kind: 'gmail'; to: string; subject: string; body: string }
  | { kind: 'slack'; channel: string; text: string }
  | { kind: 'quickbooks'; amount: number; memo: string }
  | null;

const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/;

export function parseCommand(input: string): ParsedCommand {
  const text = input.trim();

  // Gmail
  if (/gmail|email/i.test(text)) {
    const toMatch = text.match(emailRegex);
    const to = toMatch ? toMatch[1] : '';
    // Subject and body heuristics
    const subjectMatch = text.match(/subject\s*:\s*([^]+?)(?=body\s*:|$)/i);
    const bodyMatch = text.match(/body\s*:\s*([^]+)$/i);
    const subject = subjectMatch ? subjectMatch[1].trim() : 'Stock Analysis from LyticalPilot';
    const body = bodyMatch ? bodyMatch[1].trim() : text.replace(/.*?(gmail|email)\b/i, '').trim();
    if (to) {
      return { kind: 'gmail', to, subject, body };
    }
  }

  // Slack
  if (/slack/i.test(text)) {
    const channelMatch = text.match(/(#\w+|@\w+)/);
    const channel = channelMatch ? channelMatch[1] : '';
    // Prefer "message:" or the rest of text after "slack"
    const msgMatch = text.match(/message\s*:\s*([^]+)$/i);
    const msg = msgMatch ? msgMatch[1].trim() : text.replace(/.*?slack\b/i, '').trim() || 'Automated update from LyticalPilot';
    if (channel) {
      return { kind: 'slack', channel, text: msg };
    }
  }

  // QuickBooks
  if (/quickbooks/i.test(text)) {
    const amountMatch = text.match(/amount\s*[:=]?\s*\$?(-?\d+(\.\d+)?)/i);
    const memoMatch = text.match(/memo\s*:\s*([^]+)$/i);
    const amount = amountMatch ? parseFloat(amountMatch[1]) : NaN;
    const memo = memoMatch ? memoMatch[1].trim() : 'Automated entry from LyticalPilot';
    if (!Number.isNaN(amount)) {
      return { kind: 'quickbooks', amount, memo };
    }
  }

  return null;
}
