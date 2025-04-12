import React, { useState, useEffect } from 'react';
import { 
  PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { Cat, DollarSign, AlertTriangle, PieChart2, BarChart, Home } from 'lucide-react';

export default function BudgetKatApp() {
  // Sample data
  const initialCategories = [
    { id: 1, name: 'Food', icon: '🐟', budget: 500, color: '#FF6384' },
    { id: 2, name: 'Transport', icon: '🧶', budget: 300, color: '#36A2EB' },
    { id: 3, name: 'Utilities', icon: '🐾', budget: 200, color: '#FFCE56' },
    { id: 4, name: 'Entertainment', icon: '🧸', budget: 150, color: '#4BC0C0' }
  ];

  // State
  const [categories, setCategories] = useState(initialCategories);
  const [transactions, setTransactions] = useState([]);
  const [newTransaction, setNewTransaction] = useState({
    description: '',
    amount: '',
    category: 1,
    type: 'expense',
    date: new Date().toISOString().slice(0, 10)
  });
  const [activeView, setActiveView] = useState('dashboard');
  const [income, setIncome] = useState(2000);

  // Generate monthly data for the line chart
  const generateMonthlyData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map(month => {
      const randomExpense = Math.floor(Math.random() * 1000) + 500;
      return {
        name: month,
        expense: randomExpense,
        budget: 1150 // Sum of all category budgets
      };
    });
  };

  const [monthlyData, setMonthlyData] = useState(generateMonthlyData());

  // Add sample transactions on first load
  useEffect(() => {
    const sampleTransactions = [
      { id: 1, description: 'Grocery shopping', amount: 75.50, category: 1, type: 'expense', date: '2025-04-05' },
      { id: 2, description: 'Gas', amount: 45.00, category: 2, type: 'expense', date: '2025-04-07' },
      { id: 3, description: 'Electricity bill', amount: 120.00, category: 3, type: 'expense', date: '2025-04-10' },
      { id: 4, description: 'Movie tickets', amount: 30.00, category: 4, type: 'expense', date: '2025-04-01' },
      { id: 5, description: 'Salary', amount: 2000.00, category: 1, type: 'income', date: '2025-04-01' }
    ];
    setTransactions(sampleTransactions);
  }, []);

  // Calculate totals
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const categoryTotals = categories.map(category => {
    const total = transactions
      .filter(t => t.type === 'expense' && t.category === category.id)
      .reduce((sum, t) => sum + Number(t.amount), 0);
    return {
      ...category,
      spent: total,
      remaining: category.budget - total
    };
  });

  // For pie chart
  const pieData = categoryTotals.map(cat => ({
    name: cat.name,
    value: cat.spent > 0 ? cat.spent : 0
  }));

  // Generate insights
  const generateInsights = () => {
    const insights = [];
    
    // Find overspending categories
    const overspentCategories = categoryTotals.filter(cat => cat.remaining < 0);
    if (overspentCategories.length > 0) {
      insights.push({
        type: 'alert',
        message: `You've overspent in ${overspentCategories.map(c => c.name).join(', ')}!`
      });
    }
    
    // Find savings opportunities
    const savingsCategories = categoryTotals.filter(cat => cat.remaining > cat.budget * 0.5);
    if (savingsCategories.length > 0) {
      insights.push({
        type: 'savings',
        message: `You're saving well in ${savingsCategories.map(c => c.name).join(', ')}!`
      });
    }
    
    // Balance status
    const balance = totalIncome - totalExpenses;
    if (balance < 0) {
      insights.push({
        type: 'balance',
        message: `Watch out! You're spending more than you earn this month.`
      });
    } else if (balance > totalIncome * 0.3) {
      insights.push({
        type: 'balance',
        message: `Great job! You're saving more than 30% of your income.`
      });
    }
    
    return insights;
  };

  const insights = generateInsights();

  // Add new transaction
  const handleAddTransaction = (e) => {
    e.preventDefault();
    const transaction = {
      id: transactions.length + 1,
      ...newTransaction,
      amount: Number(newTransaction.amount),
      category: Number(newTransaction.category)
    };
    
    setTransactions([...transactions, transaction]);
    setNewTransaction({
      description: '',
      amount: '',
      category: 1,
      type: 'expense',
      date: new Date().toISOString().slice(0, 10)
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTransaction({
      ...newTransaction,
      [name]: value
    });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-purple-600 text-white p-4 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Cat className="w-8 h-8" />
            <h1 className="text-2xl font-bold">BudgetKat</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation */}
        <nav className="bg-purple-800 text-white w-16 flex flex-col items-center py-4">
          <button 
            onClick={() => setActiveView('dashboard')} 
            className={`p-3 rounded-full mb-4 ${activeView === 'dashboard' ? 'bg-purple-500' : 'hover:bg-purple-700'}`}
          >
            <Home />
          </button>
          <button 
            onClick={() => setActiveView('transactions')} 
            className={`p-3 rounded-full mb-4 ${activeView === 'transactions' ? 'bg-purple-500' : 'hover:bg-purple-700'}`}
          >
            <DollarSign />
          </button>
          <button 
            onClick={() => setActiveView('reports')} 
            className={`p-3 rounded-full mb-4 ${activeView === 'reports' ? 'bg-purple-500' : 'hover:bg-purple-700'}`}
          >
            <BarChart />
          </button>
          <button 
            onClick={() => setActiveView('insights')} 
            className={`p-3 rounded-full mb-4 ${activeView === 'insights' ? 'bg-purple-500' : 'hover:bg-purple-700'}`}
          >
            <AlertTriangle />
          </button>
        </nav>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeView === 'dashboard' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Dashboard</h2>
              
              {/* Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg shadow">
                  <h3 className="text-gray-500 mb-2">Total Income</h3>
                  <p className="text-2xl font-bold text-green-500">${totalIncome.toFixed(2)}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <h3 className="text-gray-500 mb-2">Total Expenses</h3>
                  <p className="text-2xl font-bold text-red-500">${totalExpenses.toFixed(2)}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <h3 className="text-gray-500 mb-2">Balance</h3>
                  <p className={`text-2xl font-bold ${totalIncome - totalExpenses >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    ${(totalIncome - totalExpenses).toFixed(2)}
                  </p>
                </div>
              </div>
              
              {/* Category Budget Status */}
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Budget Status</h3>
                <div className="space-y-4">
                  {categoryTotals.map(category => (
                    <div key={category.id} className="space-y-1">
                      <div className="flex justify-between">
                        <span className="flex items-center">
                          <span className="mr-2">{category.icon}</span>
                          {category.name}
                        </span>
                        <span>
                          ${category.spent.toFixed(2)} / ${category.budget.toFixed(2)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${category.remaining >= 0 ? 'bg-green-500' : 'bg-red-500'}`} 
                          style={{ width: `${Math.min(100, (category.spent / category.budget) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Recent Transactions */}
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
                <div className="space-y-2">
                  {transactions.slice(-5).reverse().map(transaction => {
                    const category = categories.find(c => c.id === transaction.category);
                    return (
                      <div key={transaction.id} className="flex justify-between border-b pb-2">
                        <span className="flex items-center">
                          <span className="mr-2">{category?.icon}</span>
                          {transaction.description}
                        </span>
                        <span className={transaction.type === 'income' ? 'text-green-500' : 'text-red-500'}>
                          {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
          
          {activeView === 'transactions' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Transactions</h2>
              
              {/* Add Transaction Form */}
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Add New Transaction</h3>
                <form onSubmit={handleAddTransaction} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Description</label>
                      <input 
                        type="text" 
                        name="description"
                        value={newTransaction.description}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded" 
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Amount</label>
                      <input 
                        type="number" 
                        name="amount"
                        value={newTransaction.amount}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded" 
                        step="0.01" 
                        min="0" 
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Category</label>
                      <select 
                        name="category"
                        value={newTransaction.category}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                      >
                        {categories.map(category => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Type</label>
                      <select 
                        name="type"
                        value={newTransaction.type}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                      >
                        <option value="expense">Expense</option>
                        <option value="income">Income</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Date</label>
                      <input 
                        type="date" 
                        name="date"
                        value={newTransaction.date}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded" 
                        required
                      />
                    </div>
                  </div>
                  <button 
                    type="submit" 
                    className="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition-colors"
                  >
                    Add Transaction
                  </button>
                </form>
              </div>
              
              {/* Transactions List */}
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">All Transactions</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="text-left p-2">Date</th>
                        <th className="text-left p-2">Description</th>
                        <th className="text-left p-2">Category</th>
                        <th className="text-right p-2">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map(transaction => {
                        const category = categories.find(c => c.id === transaction.category);
                        return (
                          <tr key={transaction.id} className="border-b">
                            <td className="p-2">{transaction.date}</td>
                            <td className="p-2">{transaction.description}</td>
                            <td className="p-2">
                              <span className="mr-1">{category?.icon}</span>
                              {category?.name}
                            </td>
                            <td className={`p-2 text-right ${transaction.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                              {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          
          {activeView === 'reports' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Reports</h2>
              
              {/* Expense Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-lg shadow">
                  <h3 className="text-lg font-semibold mb-4">Expenses by Category</h3>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={categoryTotals[index].color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                {/* Monthly Expense Trend */}
                <div className="bg-white p-4 rounded-lg shadow">
                  <h3 className="text-lg font-semibold mb-4">Monthly Expense Trend</h3>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => `$${value}`} />
                        <Legend />
                        <Line type="monotone" dataKey="expense" stroke="#FF6384" activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="budget" stroke="#36A2EB" strokeDasharray="5 5" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              
              {/* Category Details */}
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Category Details</h3>
                <div className="space-y-4">
                  {categoryTotals.map(category => (
                    <div key={category.id} className="border-b pb-4">
                      <div className="flex justify-between mb-2">
                        <h4 className="font-medium flex items-center">
                          <span className="mr-2">{category.icon}</span>
                          {category.name}
                        </h4>
                        <span className={category.remaining >= 0 ? 'text-green-500' : 'text-red-500'}>
                          ${category.spent.toFixed(2)} / ${category.budget.toFixed(2)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div 
                          className={`h-2 rounded-full ${category.remaining >= 0 ? 'bg-green-500' : 'bg-red-500'}`} 
                          style={{ width: `${Math.min(100, (category.spent / category.budget) * 100)}%` }}
                        ></div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {category.remaining >= 0 
                          ? `${(category.spent / category.budget * 100).toFixed(0)}% of budget used, $${category.remaining.toFixed(2)} remaining` 
                          : `Over budget by $${Math.abs(category.remaining).toFixed(2)}`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {activeView === 'insights' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Smart Insights</h2>
              
              {/* AI Generated Insights */}
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">AI Budget Analysis</h3>
                <div className="space-y-4">
                  {insights.length > 0 ? (
                    insights.map((insight, index) => (
                      <div 
                        key={index} 
                        className={`p-4 rounded flex items-start ${
                          insight.type === 'alert' ? 'bg-red-100' : 
                          insight.type === 'savings' ? 'bg-green-100' : 'bg-blue-100'
                        }`}
                      >
                        <AlertTriangle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                        <p>{insight.message}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No insights available. Add more transactions to get personalized budget advice.</p>
                  )}
                </div>
              </div>
              
              {/* Spending Recommendations */}
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Spending Recommendations</h3>
                <div className="space-y-4">
                  {categoryTotals.map(category => {
                    let recommendation = null;
                    if (category.remaining < 0) {
                      recommendation = `You've overspent in ${category.name}. Try to cut back for the rest of the month.`;
                    } else if (category.spent > category.budget * 0.8) {
                      recommendation = `You're close to your ${category.name} budget. Be careful with additional spending.`;
                    } else if (category.spent < category.budget * 0.2) {
                      recommendation = `You've used very little of your ${category.name} budget. Is this budget set correctly?`;
                    }
                    
                    return recommendation ? (
                      <div key={category.id} className="p-4 bg-gray-100 rounded">
                        <div className="flex items-center mb-2">
                          <span className="mr-2">{category.icon}</span>
                          <h4 className="font-medium">{category.name}</h4>
                        </div>
                        <p>{recommendation}</p>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
              
              {/* Savings Potential */}
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Savings Potential</h3>
                <div className="p-4 bg-purple-100 rounded mb-4">
                  <p className="text-lg mb-2">
                    You could save an extra <span className="font-bold">${(totalIncome * 0.2).toFixed(2)}</span> per month
                  </p>
                  <p>Based on your income and current spending patterns, you have the potential to save 20% of your income.</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Tips to increase savings:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Set up automatic transfers to a savings account on payday</li>
                    <li>Review your subscription services and cancel unused ones</li>
                    <li>Set specific savings goals to stay motivated</li>
                    <li>Look for ways to reduce your highest expense categories</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}