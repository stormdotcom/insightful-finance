import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { debts } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const debtProjection = [
  { month: "Mar", remaining: 277600 },
  { month: "Jun", remaining: 270900 },
  { month: "Sep", remaining: 264100 },
  { month: "Dec", remaining: 257000 },
  { month: "Mar '27", remaining: 249800 },
  { month: "Jun '27", remaining: 242500 },
];

export default function DebtManager() {
  const totalDebt = debts.reduce((s, d) => s + d.remaining, 0);
  const totalOriginal = debts.reduce((s, d) => s + d.total, 0);
  const paidOff = ((1 - totalDebt / totalOriginal) * 100).toFixed(1);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Debt Manager</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Total debt: <span className="text-foreground font-semibold">${totalDebt.toLocaleString()}</span> — {paidOff}% paid off
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gradient-primary text-primary-foreground gap-1.5"><Plus className="h-4 w-4" /> Add Debt</Button>
          </DialogTrigger>
          <DialogContent className="glass">
            <DialogHeader><DialogTitle>Add Debt</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div><Label>Creditor Name</Label><Input placeholder="e.g. Chase Bank" className="bg-secondary/50" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Total Amount</Label><Input type="number" placeholder="0.00" className="bg-secondary/50" /></div>
                <div><Label>Interest Rate (%)</Label><Input type="number" placeholder="0.0" className="bg-secondary/50" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Monthly Payment</Label><Input type="number" placeholder="0.00" className="bg-secondary/50" /></div>
                <div><Label>Due Date</Label><Input type="date" className="bg-secondary/50" /></div>
              </div>
              <Button className="w-full gradient-primary text-primary-foreground">Save Debt</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {debts.map((debt, i) => {
          const progress = ((debt.total - debt.remaining) / debt.total) * 100;
          return (
            <motion.div key={debt.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card className="glass border-border/50">
                <CardContent className="pt-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{debt.creditor}</p>
                      <p className="text-xs text-muted-foreground">{debt.type} • {debt.rate}% APR</p>
                    </div>
                    <Badge variant="outline" className={cn(
                      debt.rate > 10 ? "border-destructive/50 text-destructive" : "border-primary/50 text-primary"
                    )}>{debt.rate}%</Badge>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-muted-foreground">Remaining</span>
                      <span className="font-mono font-semibold">${debt.remaining.toLocaleString()} / ${debt.total.toLocaleString()}</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">{progress.toFixed(0)}% paid • ${debt.monthly}/mo</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <Card className="glass border-border/50">
        <CardHeader className="pb-2"><CardTitle className="text-base">Debt Payoff Projection</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={debtProjection}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(223,47%,14%)" />
              <XAxis dataKey="month" stroke="hsl(215,20%,55%)" fontSize={12} />
              <YAxis stroke="hsl(215,20%,55%)" fontSize={12} />
              <Tooltip />
              <Line type="monotone" dataKey="remaining" stroke="hsl(350,89%,60%)" strokeWidth={2.5} dot={false} name="Remaining Debt" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
