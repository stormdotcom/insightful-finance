import { Wallet, TrendingUp, TrendingDown, PiggyBank, CreditCard } from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import {
  monthlyExpensesTrend, incomeVsExpense, expenseCategories,
  recentTransactions, debts, portfolioAllocation, formatINR,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const CustomTooltipContent = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-lg p-3 text-sm shadow-xl border border-border/50">
      <p className="font-medium mb-1">{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} style={{ color: entry.color }} className="text-xs">
          {entry.name}: {formatINR(entry.value)}
        </p>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const totalDebt = debts.reduce((s, d) => s + d.remaining, 0);
  const totalInvested = portfolioAllocation.reduce((s, p) => s + p.value, 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Financial Overview</h1>
        <p className="text-sm text-muted-foreground mt-1">Welcome back — here's your financial snapshot.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <StatCard title="Total Balance" value="₹2,04,580" change="+12.5% from last month" changeType="positive" icon={Wallet} />
        <StatCard title="Monthly Income" value="₹1,33,000" change="+8.2%" changeType="positive" icon={TrendingUp} iconClassName="bg-accent/10 text-accent" />
        <StatCard title="Monthly Expenses" value="₹35,000" change="-4.1%" changeType="positive" icon={TrendingDown} iconClassName="bg-warning/10 text-warning" />
        <StatCard title="Investments" value={formatINR(totalInvested)} change="+15.3% YTD" changeType="positive" icon={PiggyBank} iconClassName="bg-info/10 text-info" />
        <StatCard title="Total Debt" value={formatINR(totalDebt)} change="-₹18,000 this month" changeType="positive" icon={CreditCard} iconClassName="bg-destructive/10 text-destructive" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="glass border-border/50">
          <CardHeader className="pb-2"><CardTitle className="text-base font-semibold">Expense Trend</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={monthlyExpensesTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(223,47%,14%)" />
                <XAxis dataKey="month" stroke="hsl(215,20%,55%)" fontSize={12} />
                <YAxis stroke="hsl(215,20%,55%)" fontSize={12} />
                <Tooltip content={<CustomTooltipContent />} />
                <Line type="monotone" dataKey="amount" stroke="hsl(160,84%,39%)" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass border-border/50">
          <CardHeader className="pb-2"><CardTitle className="text-base font-semibold">Income vs Expenses</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={incomeVsExpense}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(223,47%,14%)" />
                <XAxis dataKey="month" stroke="hsl(215,20%,55%)" fontSize={12} />
                <YAxis stroke="hsl(215,20%,55%)" fontSize={12} />
                <Tooltip content={<CustomTooltipContent />} />
                <Legend />
                <Bar dataKey="income" fill="hsl(160,84%,39%)" radius={[4, 4, 0, 0]} name="Income" />
                <Bar dataKey="expenses" fill="hsl(234,89%,74%)" radius={[4, 4, 0, 0]} name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="glass border-border/50">
          <CardHeader className="pb-2"><CardTitle className="text-base font-semibold">Spending by Category</CardTitle></CardHeader>
          <CardContent className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={expenseCategories} cx="50%" cy="50%" innerRadius={60} outerRadius={95} paddingAngle={3} dataKey="value">
                  {expenseCategories.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip content={<CustomTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
          <div className="px-6 pb-4 flex flex-wrap gap-2">
            {expenseCategories.slice(0, 4).map((c) => (
              <div key={c.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div className="h-2 w-2 rounded-full" style={{ background: c.color }} />{c.name}
              </div>
            ))}
          </div>
        </Card>

        <Card className="glass border-border/50 lg:col-span-2">
          <CardHeader className="pb-2"><CardTitle className="text-base font-semibold">Recent Transactions</CardTitle></CardHeader>
          <CardContent className="space-y-1">
            {recentTransactions.slice(0, 7).map((tx, i) => (
              <motion.div key={tx.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-secondary/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold",
                    tx.type === "income" ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground")}>
                    {tx.type === "income" ? "+" : "-"}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{tx.name}</p>
                    <p className="text-xs text-muted-foreground">{tx.category} • {tx.date}</p>
                  </div>
                </div>
                <span className={cn("text-sm font-semibold font-mono", tx.amount > 0 ? "text-primary" : "text-foreground")}>
                  {tx.amount > 0 ? "+" : ""}{formatINR(tx.amount)}
                </span>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
