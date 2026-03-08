import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { incomeSourcesData, monthlyIncomeHistory } from "@/lib/mock-data";

const sources = ["Salary", "Freelance", "Business", "Passive income", "Other"];

export default function Income() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Income</h1>
          <p className="text-sm text-muted-foreground mt-1">Track your income sources.</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gradient-primary text-primary-foreground gap-1.5"><Plus className="h-4 w-4" /> Add Income</Button>
          </DialogTrigger>
          <DialogContent className="glass">
            <DialogHeader><DialogTitle>Add Income</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div><Label>Amount</Label><Input type="number" placeholder="0.00" className="bg-secondary/50" /></div>
              <div><Label>Source</Label>
                <Select><SelectTrigger className="bg-secondary/50"><SelectValue placeholder="Select source" /></SelectTrigger>
                  <SelectContent>{sources.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Date</Label><Input type="date" className="bg-secondary/50" /></div>
              <div><Label>Notes</Label><Input placeholder="Additional notes" className="bg-secondary/50" /></div>
              <Button className="w-full gradient-primary text-primary-foreground">Save Income</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="glass border-border/50">
          <CardHeader className="pb-2"><CardTitle className="text-base">Income Distribution</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={incomeSourcesData} cx="50%" cy="50%" innerRadius={60} outerRadius={95} paddingAngle={3} dataKey="value">
                  {incomeSourcesData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-3 mt-2">
              {incomeSourcesData.map(s => (
                <div key={s.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <div className="h-2 w-2 rounded-full" style={{ background: s.color }} />{s.name}: ${s.value.toLocaleString()}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-border/50">
          <CardHeader className="pb-2"><CardTitle className="text-base">Monthly Income Trend</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyIncomeHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(223,47%,14%)" />
                <XAxis dataKey="month" stroke="hsl(215,20%,55%)" fontSize={12} />
                <YAxis stroke="hsl(215,20%,55%)" fontSize={12} />
                <Tooltip />
                <Legend />
                <Bar dataKey="salary" fill="hsl(160,84%,39%)" name="Salary" radius={[3,3,0,0]} stackId="a" />
                <Bar dataKey="freelance" fill="hsl(234,89%,74%)" name="Freelance" radius={[3,3,0,0]} stackId="a" />
                <Bar dataKey="passive" fill="hsl(174,72%,46%)" name="Passive" radius={[3,3,0,0]} stackId="a" />
                <Bar dataKey="business" fill="hsl(38,92%,50%)" name="Business" radius={[3,3,0,0]} stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
