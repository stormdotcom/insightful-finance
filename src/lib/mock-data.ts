export const CURRENCY = "₹";

export const monthlyExpensesTrend = [
  { month: "Jan", amount: 26000 },
  { month: "Feb", amount: 23000 },
  { month: "Mar", amount: 28500 },
  { month: "Apr", amount: 25500 },
  { month: "May", amount: 24000 },
  { month: "Jun", amount: 27500 },
  { month: "Jul", amount: 25000 },
  { month: "Aug", amount: 29000 },
  { month: "Sep", amount: 22000 },
  { month: "Oct", amount: 27000 },
  { month: "Nov", amount: 25500 },
  { month: "Dec", amount: 31000 },
];

export const incomeVsExpense = [
  { month: "Jan", income: 85000, expenses: 26000 },
  { month: "Feb", income: 85000, expenses: 23000 },
  { month: "Mar", income: 90000, expenses: 28500 },
  { month: "Apr", income: 85000, expenses: 25500 },
  { month: "May", income: 95000, expenses: 24000 },
  { month: "Jun", income: 85000, expenses: 27500 },
  { month: "Jul", income: 98000, expenses: 25000 },
  { month: "Aug", income: 85000, expenses: 29000 },
  { month: "Sep", income: 90000, expenses: 22000 },
  { month: "Oct", income: 85000, expenses: 27000 },
  { month: "Nov", income: 95000, expenses: 25500 },
  { month: "Dec", income: 100000, expenses: 31000 },
];

export const expenseCategories = [
  { name: "Food", value: 7000, color: "hsl(160, 84%, 39%)" },
  { name: "Rent", value: 12000, color: "hsl(234, 89%, 74%)" },
  { name: "Transport", value: 3500, color: "hsl(38, 92%, 50%)" },
  { name: "Shopping", value: 4500, color: "hsl(350, 89%, 60%)" },
  { name: "Subscriptions", value: 1500, color: "hsl(199, 89%, 48%)" },
  { name: "Healthcare", value: 2000, color: "hsl(263, 70%, 50%)" },
  { name: "Utilities", value: 3000, color: "hsl(174, 72%, 46%)" },
  { name: "Other", value: 1500, color: "hsl(84, 81%, 44%)" },
];

export const recentTransactions = [
  { id: 1, name: "BigBasket Order", category: "Food", amount: -1850, date: "2026-03-07", type: "expense" as const, method: "UPI" },
  { id: 2, name: "Monthly Salary", category: "Salary", amount: 85000, date: "2026-03-01", type: "income" as const, method: "Bank Transfer" },
  { id: 3, name: "Netflix", category: "Subscriptions", amount: -649, date: "2026-03-05", type: "expense" as const, method: "Credit Card" },
  { id: 4, name: "Ola Ride", category: "Transport", amount: -450, date: "2026-03-06", type: "expense" as const, method: "UPI" },
  { id: 5, name: "Freelance Project", category: "Freelance", amount: 25000, date: "2026-03-04", type: "income" as const, method: "Bank Transfer" },
  { id: 6, name: "Electricity Bill", category: "Utilities", amount: -2200, date: "2026-03-03", type: "expense" as const, method: "Auto-pay" },
  { id: 7, name: "Flipkart Purchase", category: "Shopping", amount: -3499, date: "2026-03-02", type: "expense" as const, method: "Credit Card" },
  { id: 8, name: "Gym Membership", category: "Healthcare", amount: -1500, date: "2026-03-01", type: "expense" as const, method: "Auto-pay" },
];

export const debts = [
  { id: 1, creditor: "HDFC Bank", total: 800000, remaining: 450000, rate: 8.5, monthly: 18000, due: "2028-06-15", type: "Car Loan" },
  { id: 2, creditor: "Education Loan", total: 1200000, remaining: 750000, rate: 7.5, monthly: 15000, due: "2032-09-01", type: "Education Loan" },
  { id: 3, creditor: "ICICI Credit Card", total: 200000, remaining: 85000, rate: 36, monthly: 8000, due: "2027-01-20", type: "Credit Card" },
  { id: 4, creditor: "SBI Home Loan", total: 5000000, remaining: 4200000, rate: 8.4, monthly: 42000, due: "2050-01-01", type: "Home Loan" },
];

export const investments = [
  { id: 1, name: "Nifty 50 Index Fund", type: "Stocks", invested: 500000, current: 620000, change: 24.0 },
  { id: 2, name: "Bitcoin", type: "Crypto", invested: 200000, current: 310000, change: 55.0 },
  { id: 3, name: "HDFC Balanced Fund", type: "Mutual Funds", invested: 350000, current: 385000, change: 10.0 },
  { id: 4, name: "Sovereign Gold Bond", type: "Gold", invested: 150000, current: 175000, change: 16.7 },
  { id: 5, name: "REIT Fund", type: "Real Estate", invested: 250000, current: 280000, change: 12.0 },
  { id: 6, name: "FD / RD", type: "Savings", invested: 400000, current: 425000, change: 6.25 },
];

export const portfolioAllocation = [
  { name: "Stocks", value: 620000, color: "hsl(160, 84%, 39%)" },
  { name: "Crypto", value: 310000, color: "hsl(38, 92%, 50%)" },
  { name: "Mutual Funds", value: 385000, color: "hsl(234, 89%, 74%)" },
  { name: "Gold", value: 175000, color: "hsl(350, 89%, 60%)" },
  { name: "Real Estate", value: 280000, color: "hsl(199, 89%, 48%)" },
  { name: "Savings", value: 425000, color: "hsl(174, 72%, 46%)" },
];

export const budgets = [
  { category: "Food", limit: 8000, spent: 7000 },
  { category: "Transport", limit: 4000, spent: 4500 },
  { category: "Entertainment", limit: 3000, spent: 1800 },
  { category: "Shopping", limit: 5000, spent: 4500 },
  { category: "Subscriptions", limit: 2000, spent: 1500 },
  { category: "Healthcare", limit: 3000, spent: 2000 },
  { category: "Utilities", limit: 4000, spent: 3000 },
];

export const incomeSourcesData = [
  { name: "Salary", value: 85000, color: "hsl(160, 84%, 39%)" },
  { name: "Freelance", value: 25000, color: "hsl(234, 89%, 74%)" },
  { name: "Passive", value: 8000, color: "hsl(174, 72%, 46%)" },
  { name: "Business", value: 15000, color: "hsl(38, 92%, 50%)" },
];

export const monthlyIncomeHistory = [
  { month: "Jan", salary: 85000, freelance: 15000, passive: 7000, business: 12000 },
  { month: "Feb", salary: 85000, freelance: 20000, passive: 7500, business: 13000 },
  { month: "Mar", salary: 85000, freelance: 25000, passive: 7800, business: 14000 },
  { month: "Apr", salary: 85000, freelance: 10000, passive: 8000, business: 15000 },
  { month: "May", salary: 90000, freelance: 22000, passive: 8200, business: 15500 },
  { month: "Jun", salary: 90000, freelance: 18000, passive: 8500, business: 16000 },
];

export const netWorthHistory = [
  { month: "Jan", assets: 2000000, liabilities: 5500000, net: -3500000 },
  { month: "Feb", assets: 2100000, liabilities: 5450000, net: -3350000 },
  { month: "Mar", assets: 2200000, liabilities: 5400000, net: -3200000 },
  { month: "Apr", assets: 2300000, liabilities: 5350000, net: -3050000 },
  { month: "May", assets: 2400000, liabilities: 5300000, net: -2900000 },
  { month: "Jun", assets: 2500000, liabilities: 5250000, net: -2750000 },
  { month: "Jul", assets: 2600000, liabilities: 5200000, net: -2600000 },
  { month: "Aug", assets: 2700000, liabilities: 5150000, net: -2450000 },
  { month: "Sep", assets: 2800000, liabilities: 5100000, net: -2300000 },
  { month: "Oct", assets: 2900000, liabilities: 5050000, net: -2150000 },
  { month: "Nov", assets: 3000000, liabilities: 5000000, net: -2000000 },
  { month: "Dec", assets: 3100000, liabilities: 4950000, net: -1850000 },
];

/** Format number as INR with ₹ symbol */
export function formatINR(amount: number): string {
  const abs = Math.abs(amount);
  const formatted = abs.toLocaleString("en-IN");
  return `${amount < 0 ? "-" : ""}₹${formatted}`;
}
