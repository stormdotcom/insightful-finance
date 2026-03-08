import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { monthlyExpensesTrend, incomeVsExpense, netWorthHistory } from "@/lib/mock-data";

const savingsRate = [
  { month: "Jan", rate: 38 }, { month: "Feb", rate: 46 },
  { month: "Mar", rate: 36 }, { month: "Apr", rate: 40 },
  { month: "May", rate: 50 }, { month: "Jun", rate: 35 },
  { month: "Jul", rate: 50 }, { month: "Aug", rate: 31 },
  { month: "Sep", rate: 51 }, { month: "Oct", rate: 37 },
  { month: "Nov", rate: 47 }, { month: "Dec", rate: 39 },
];

export default function Reports() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Reports & Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">Deep dive into your financial data.</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="glass">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="networth">Net Worth</TabsTrigger>
          <TabsTrigger value="savings">Savings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="glass border-border/50">
            <CardHeader className="pb-2"><CardTitle className="text-base">Income vs Expenses (Yearly)</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={incomeVsExpense}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(223,47%,14%)" />
                  <XAxis dataKey="month" stroke="hsl(215,20%,55%)" fontSize={12} />
                  <YAxis stroke="hsl(215,20%,55%)" fontSize={12} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="income" fill="hsl(160,84%,39%)" name="Income" radius={[3,3,0,0]} />
                  <Bar dataKey="expenses" fill="hsl(234,89%,74%)" name="Expenses" radius={[3,3,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card className="glass border-border/50">
            <CardHeader className="pb-2"><CardTitle className="text-base">Savings Rate</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={savingsRate}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(223,47%,14%)" />
                  <XAxis dataKey="month" stroke="hsl(215,20%,55%)" fontSize={12} />
                  <YAxis stroke="hsl(215,20%,55%)" fontSize={12} unit="%" />
                  <Tooltip />
                  <Area type="monotone" dataKey="rate" stroke="hsl(174,72%,46%)" fill="hsl(174,72%,46%)" fillOpacity={0.15} strokeWidth={2} name="Savings %" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses">
          <Card className="glass border-border/50">
            <CardHeader className="pb-2"><CardTitle className="text-base">Yearly Expense Trends</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={monthlyExpensesTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(223,47%,14%)" />
                  <XAxis dataKey="month" stroke="hsl(215,20%,55%)" fontSize={12} />
                  <YAxis stroke="hsl(215,20%,55%)" fontSize={12} />
                  <Tooltip />
                  <Line type="monotone" dataKey="amount" stroke="hsl(38,92%,50%)" strokeWidth={2.5} dot={{ r: 4, fill: "hsl(38,92%,50%)" }} name="Expenses" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="networth">
          <Card className="glass border-border/50">
            <CardHeader className="pb-2"><CardTitle className="text-base">Net Worth Over Time</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={netWorthHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(223,47%,14%)" />
                  <XAxis dataKey="month" stroke="hsl(215,20%,55%)" fontSize={12} />
                  <YAxis stroke="hsl(215,20%,55%)" fontSize={12} />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="assets" stroke="hsl(160,84%,39%)" fill="hsl(160,84%,39%)" fillOpacity={0.1} strokeWidth={2} name="Assets" />
                  <Area type="monotone" dataKey="liabilities" stroke="hsl(350,89%,60%)" fill="hsl(350,89%,60%)" fillOpacity={0.1} strokeWidth={2} name="Liabilities" />
                  <Area type="monotone" dataKey="net" stroke="hsl(234,89%,74%)" fill="hsl(234,89%,74%)" fillOpacity={0.1} strokeWidth={2} name="Net Worth" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="savings">
          <Card className="glass border-border/50">
            <CardHeader className="pb-2"><CardTitle className="text-base">Monthly Savings Rate</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={savingsRate}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(223,47%,14%)" />
                  <XAxis dataKey="month" stroke="hsl(215,20%,55%)" fontSize={12} />
                  <YAxis stroke="hsl(215,20%,55%)" fontSize={12} unit="%" />
                  <Tooltip />
                  <Bar dataKey="rate" fill="hsl(160,84%,39%)" radius={[4,4,0,0]} name="Savings Rate %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
