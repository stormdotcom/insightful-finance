import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { budgets, formatINR } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle } from "lucide-react";

export default function BudgetPlanner() {
  const totalLimit = budgets.reduce((s, b) => s + b.limit, 0);
  const totalSpent = budgets.reduce((s, b) => s + b.spent, 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Budget Planner</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Spent <span className="text-foreground font-semibold">{formatINR(totalSpent)}</span> of {formatINR(totalLimit)} budget
        </p>
      </div>

      <Card className="glass border-border/50">
        <CardContent className="pt-5">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Overall Budget</span>
            <span className="font-mono font-semibold">{((totalSpent / totalLimit) * 100).toFixed(0)}%</span>
          </div>
          <Progress value={(totalSpent / totalLimit) * 100} className="h-3" />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {budgets.map((budget, i) => {
          const pct = (budget.spent / budget.limit) * 100;
          const over = budget.spent > budget.limit;
          return (
            <motion.div key={budget.category} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <Card className={cn("glass border-border/50", over && "border-destructive/30")}>
                <CardContent className="pt-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {over ? <AlertTriangle className="h-4 w-4 text-destructive" /> : <CheckCircle className="h-4 w-4 text-primary" />}
                      <p className="font-semibold">{budget.category}</p>
                    </div>
                    {over && <Badge variant="destructive" className="text-xs">Over budget</Badge>}
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-muted-foreground">{formatINR(budget.spent)} spent</span>
                      <span className="font-mono text-muted-foreground">{formatINR(budget.limit)} limit</span>
                    </div>
                    <Progress value={Math.min(pct, 100)} className={cn("h-2", over && "[&>div]:bg-destructive")} />
                    <p className="text-xs text-muted-foreground mt-1">
                      {over
                        ? `${formatINR(budget.spent - budget.limit)} over limit`
                        : `${formatINR(budget.limit - budget.spent)} remaining`}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
