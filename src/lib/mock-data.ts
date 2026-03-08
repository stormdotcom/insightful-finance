export const monthlyExpensesTrend = [
  { month: "Jan", amount: 3200 },
  { month: "Feb", amount: 2800 },
  { month: "Mar", amount: 3500 },
  { month: "Apr", amount: 3100 },
  { month: "May", amount: 2900 },
  { month: "Jun", amount: 3400 },
  { month: "Jul", amount: 3000 },
  { month: "Aug", amount: 3600 },
  { month: "Sep", amount: 2700 },
  { month: "Oct", amount: 3300 },
  { month: "Nov", amount: 3100 },
  { month: "Dec", amount: 3800 },
];

export const incomeVsExpense = [
  { month: "Jan", income: 5200, expenses: 3200 },
  { month: "Feb", income: 5200, expenses: 2800 },
  { month: "Mar", income: 5500, expenses: 3500 },
  { month: "Apr", income: 5200, expenses: 3100 },
  { month: "May", income: 5800, expenses: 2900 },
  { month: "Jun", income: 5200, expenses: 3400 },
  { month: "Jul", income: 6000, expenses: 3000 },
  { month: "Aug", income: 5200, expenses: 3600 },
  { month: "Sep", income: 5500, expenses: 2700 },
  { month: "Oct", income: 5200, expenses: 3300 },
  { month: "Nov", income: 5800, expenses: 3100 },
  { month: "Dec", income: 6200, expenses: 3800 },
];

export const expenseCategories = [
  { name: "Food", value: 850, color: "hsl(160, 84%, 39%)" },
  { name: "Rent", value: 1200, color: "hsl(234, 89%, 74%)" },
  { name: "Transport", value: 320, color: "hsl(38, 92%, 50%)" },
  { name: "Shopping", value: 450, color: "hsl(350, 89%, 60%)" },
  { name: "Subscriptions", value: 180, color: "hsl(199, 89%, 48%)" },
  { name: "Healthcare", value: 200, color: "hsl(263, 70%, 50%)" },
  { name: "Utilities", value: 280, color: "hsl(174, 72%, 46%)" },
  { name: "Other", value: 120, color: "hsl(84, 81%, 44%)" },
];

export const recentTransactions = [
  { id: 1, name: "Whole Foods Market", category: "Food", amount: -89.50, date: "2026-03-07", type: "expense" as const, method: "Credit Card" },
  { id: 2, name: "Monthly Salary", category: "Salary", amount: 5200, date: "2026-03-01", type: "income" as const, method: "Bank Transfer" },
  { id: 3, name: "Netflix", category: "Subscriptions", amount: -15.99, date: "2026-03-05", type: "expense" as const, method: "Credit Card" },
  { id: 4, name: "Uber Ride", category: "Transport", amount: -24.50, date: "2026-03-06", type: "expense" as const, method: "Debit Card" },
  { id: 5, name: "Freelance Project", category: "Freelance", amount: 1200, date: "2026-03-04", type: "income" as const, method: "PayPal" },
  { id: 6, name: "Electricity Bill", category: "Utilities", amount: -120, date: "2026-03-03", type: "expense" as const, method: "Auto-pay" },
  { id: 7, name: "Amazon Purchase", category: "Shopping", amount: -67.30, date: "2026-03-02", type: "expense" as const, method: "Credit Card" },
  { id: 8, name: "Gym Membership", category: "Healthcare", amount: -49.99, date: "2026-03-01", type: "expense" as const, method: "Auto-pay" },
];

export const debts = [
  { id: 1, creditor: "Chase Bank", total: 15000, remaining: 8500, rate: 4.5, monthly: 450, due: "2028-06-15", type: "Car Loan" },
  { id: 2, creditor: "Student Loans", total: 35000, remaining: 22000, rate: 5.8, monthly: 380, due: "2032-09-01", type: "Student Loan" },
  { id: 3, creditor: "Capital One", total: 5000, remaining: 2100, rate: 18.9, monthly: 200, due: "2027-01-20", type: "Credit Card" },
  { id: 4, creditor: "Home Mortgage", total: 280000, remaining: 245000, rate: 3.2, monthly: 1200, due: "2055-01-01", type: "Mortgage" },
];

export const investments = [
  { id: 1, name: "S&P 500 ETF", type: "Stocks", invested: 12000, current: 14500, change: 20.8 },
  { id: 2, name: "Bitcoin", type: "Crypto", invested: 5000, current: 7200, change: 44.0 },
  { id: 3, name: "Vanguard Total Bond", type: "Mutual Funds", invested: 8000, current: 8400, change: 5.0 },
  { id: 4, name: "Gold ETF", type: "Gold", invested: 3000, current: 3350, change: 11.7 },
  { id: 5, name: "REIT Fund", type: "Real Estate", invested: 6000, current: 6800, change: 13.3 },
  { id: 6, name: "High Yield Savings", type: "Savings", invested: 10000, current: 10450, change: 4.5 },
];

export const portfolioAllocation = [
  { name: "Stocks", value: 14500, color: "hsl(160, 84%, 39%)" },
  { name: "Crypto", value: 7200, color: "hsl(38, 92%, 50%)" },
  { name: "Mutual Funds", value: 8400, color: "hsl(234, 89%, 74%)" },
  { name: "Gold", value: 3350, color: "hsl(350, 89%, 60%)" },
  { name: "Real Estate", value: 6800, color: "hsl(199, 89%, 48%)" },
  { name: "Savings", value: 10450, color: "hsl(174, 72%, 46%)" },
];

export const budgets = [
  { category: "Food", limit: 400, spent: 340 },
  { category: "Transport", limit: 150, spent: 180 },
  { category: "Entertainment", limit: 100, spent: 65 },
  { category: "Shopping", limit: 300, spent: 280 },
  { category: "Subscriptions", limit: 80, spent: 75 },
  { category: "Healthcare", limit: 200, spent: 50 },
  { category: "Utilities", limit: 300, spent: 280 },
];

export const incomeSourcesData = [
  { name: "Salary", value: 5200, color: "hsl(160, 84%, 39%)" },
  { name: "Freelance", value: 1200, color: "hsl(234, 89%, 74%)" },
  { name: "Passive", value: 450, color: "hsl(174, 72%, 46%)" },
  { name: "Business", value: 800, color: "hsl(38, 92%, 50%)" },
];

export const monthlyIncomeHistory = [
  { month: "Jan", salary: 5200, freelance: 800, passive: 400, business: 600 },
  { month: "Feb", salary: 5200, freelance: 1000, passive: 420, business: 700 },
  { month: "Mar", salary: 5200, freelance: 1200, passive: 430, business: 750 },
  { month: "Apr", salary: 5200, freelance: 600, passive: 440, business: 800 },
  { month: "May", salary: 5500, freelance: 1100, passive: 445, business: 820 },
  { month: "Jun", salary: 5500, freelance: 900, passive: 450, business: 850 },
];

export const netWorthHistory = [
  { month: "Jan", assets: 85000, liabilities: 277000, net: -192000 },
  { month: "Feb", assets: 87000, liabilities: 275000, net: -188000 },
  { month: "Mar", assets: 90000, liabilities: 273500, net: -183500 },
  { month: "Apr", assets: 92500, liabilities: 272000, net: -179500 },
  { month: "May", assets: 95000, liabilities: 270000, net: -175000 },
  { month: "Jun", assets: 98000, liabilities: 268500, net: -170500 },
  { month: "Jul", assets: 101000, liabilities: 267000, net: -166000 },
  { month: "Aug", assets: 104000, liabilities: 265000, net: -161000 },
  { month: "Sep", assets: 106500, liabilities: 263500, net: -157000 },
  { month: "Oct", assets: 109000, liabilities: 262000, net: -153000 },
  { month: "Nov", assets: 112000, liabilities: 260000, net: -148000 },
  { month: "Dec", assets: 115000, liabilities: 258000, net: -143000 },
];
