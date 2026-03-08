import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { investments, portfolioAllocation, formatINR } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

const growthData = [
  { month: "Jan", value: 1800000 },
  { month: "Feb", value: 1870000 },
  { month: "Mar", value: 1920000 },
  { month: "Apr", value: 2000000 },
  { month: "May", value: 2100000 },
  { month: "Jun", value: 2195000 },
];

export default function Investments() {
  const totalInvested = investments.reduce((s, i) => s + i.invested, 0);
  const totalCurrent = investments.reduce((s, i) => s + i.current, 0);
  const totalPL = totalCurrent - totalInvested;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Investments</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Portfolio: <span className="text-foreground font-semibold">{formatINR(totalCurrent)}</span>
          {" "}— P/L: <span className={cn("font-semibold", totalPL >= 0 ? "text-primary" : "text-destructive")}>
            {totalPL >= 0 ? "+" : ""}{formatINR(totalPL)}
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {investments.map((inv, i) => {
          const pl = inv.current - inv.invested;
          const positive = pl >= 0;
          return (
            <motion.div key={inv.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <Card className="glass border-border/50 hover:border-primary/20 transition-all">
                <CardContent className="pt-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm">{inv.name}</p>
                      <p className="text-xs text-muted-foreground">{inv.type}</p>
                    </div>
                    {positive ? <TrendingUp className="h-4 w-4 text-primary" /> : <TrendingDown className="h-4 w-4 text-destructive" />}
                  </div>
                  <p className="text-xl font-bold font-mono">{formatINR(inv.current)}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Invested: {formatINR(inv.invested)}</span>
                    <Badge variant="outline" className={cn("text-xs",
                      positive ? "border-primary/50 text-primary" : "border-destructive/50 text-destructive"
                    )}>{positive ? "+" : ""}{inv.change}%</Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="glass border-border/50">
          <CardHeader className="pb-2"><CardTitle className="text-base">Portfolio Allocation</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={portfolioAllocation} cx="50%" cy="50%" innerRadius={60} outerRadius={95} paddingAngle={3} dataKey="value">
                  {portfolioAllocation.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-3">
              {portfolioAllocation.map(p => (
                <div key={p.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <div className="h-2 w-2 rounded-full" style={{ background: p.color }} />{p.name}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-border/50">
          <CardHeader className="pb-2"><CardTitle className="text-base">Growth Trend</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(223,47%,14%)" />
                <XAxis dataKey="month" stroke="hsl(215,20%,55%)" fontSize={12} />
                <YAxis stroke="hsl(215,20%,55%)" fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="hsl(160,84%,39%)" strokeWidth={2.5} dot={false} name="Portfolio Value" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
