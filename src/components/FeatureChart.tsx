import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

interface FeatureChartProps {
  type: "sentiment" | "performance" | "automation";
  title: string;
  description: string;
}

const sentimentData = [
  { name: "Jan", bullish: 65, bearish: 25, neutral: 10 },
  { name: "Feb", bullish: 72, bearish: 18, neutral: 10 },
  { name: "Mar", bullish: 58, bearish: 32, neutral: 10 },
  { name: "Apr", bullish: 81, bearish: 14, neutral: 5 },
  { name: "May", bullish: 69, bearish: 22, neutral: 9 },
  { name: "Jun", bullish: 77, bearish: 16, neutral: 7 },
];

const performanceData = [
  { name: "Portfolio A", value: 15.2 },
  { name: "Portfolio B", value: 12.8 },
  { name: "Portfolio C", value: 18.4 },
  { name: "Portfolio D", value: 9.1 },
  { name: "Portfolio E", value: 21.7 },
];

const automationData = [
  { name: "Email Alerts", value: 35, color: "hsl(225, 73%, 62%)" },
  { name: "Slack Notifications", value: 25, color: "hsl(134, 61%, 51%)" },
  { name: "Auto Trading", value: 20, color: "hsl(260, 73%, 62%)" },
  { name: "Invoice Generation", value: 20, color: "hsl(290, 73%, 62%)" },
];

export function FeatureChart({ type, title, description }: FeatureChartProps) {
  return (
    <Card className="p-6 bg-gradient-feature border-border/50 backdrop-blur-sm">
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
        
        <div className="h-64">
          {type === "sentiment" && (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sentimentData}>
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(215, 20.2%, 65.1%)', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(215, 20.2%, 65.1%)', fontSize: 12 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="bullish" 
                  stroke="hsl(134, 61%, 51%)" 
                  strokeWidth={3}
                  dot={{ fill: "hsl(134, 61%, 51%)", strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="bearish" 
                  stroke="hsl(0, 84%, 60%)" 
                  strokeWidth={3}
                  dot={{ fill: "hsl(0, 84%, 60%)", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
          
          {type === "performance" && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(215, 20.2%, 65.1%)', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(215, 20.2%, 65.1%)', fontSize: 12 }}
                />
                <Bar 
                  dataKey="value" 
                  fill="url(#barGradient)"
                  radius={[4, 4, 0, 0]}
                />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(225, 73%, 62%)" />
                    <stop offset="100%" stopColor="hsl(260, 73%, 62%)" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          )}
          
          {type === "automation" && (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={automationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {automationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </Card>
  );
}