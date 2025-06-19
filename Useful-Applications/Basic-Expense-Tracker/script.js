
// Memory storage for expenses
let expenses = [];
let expenseId = 1;

// DOM elements
const expenseForm = document.getElementById("expenseForm");
const expensesList = document.getElementById("expensesList");
const totalExpensesEl = document.getElementById("totalExpenses");
const monthlyExpensesEl = document.getElementById("monthlyExpenses");
const transactionCountEl = document.getElementById("transactionCount");
const canvas = document.getElementById("expenseChart");
const ctx = canvas.getContext("2d");

document.getElementById("date").valueAsDate = new Date();

// Colors for chart
const categoryColors = {
    food: '#ff6b6b',
    transport: '#4ecdc4',
    entertainment: '#45b7d1',
    shopping: '#f39c12',
    bills: '#9b59b6',
    other: '#95a5a6'
};

// Expense event listener
expenseForm.addEventListener("submit", function(e) {
    e.preventDefault();
    addExpense();
});

function addExpense() {
    const description = document.getElementById("description").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const category = document.getElementById("category").value;
    const date = document.getElementById("date").value;

    const expense = {
        id: expenseId++,
        description,
        amount,
        category,
        date,
        timestamp: new Date().getTime()
    };

    expenses.unshift(expense);
    updateDisplay();
    expenseForm.reset();
    document.getElementById("date").valueAsDate = new Date();

    // Visual feedback
    const btn = expenseForm.querySelector(".btn");
    const originalText = btn.textContent;
    btn.textContent = "✅ Added!";
    btn.style.background = '#27ae60';
    setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = "";
    }, 1000);
}

function deleteExpense(id) {
    expenses = expenses.filter(expense => expense.id !== id);
    updateDisplay();
}

function updateDisplay() {
    updateSummary();
    renderExpenses();
    drawChart();
}

function updateSummary() {
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const monthlyTotal = expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
    }).reduce((sum, expense) => sum + expense.amount, 0);

    totalExpensesEl.textContent = `$${total.toFixed(2)}`;
    monthlyExpensesEl.textContent = `$${monthlyTotal.toFixed(2)}`;
    transactionCountEl.textContent = expenses.length;
}

function renderExpenses() {
    if (expenses.length === 0) {
        expensesList.innerHTML = `<div class="empty-state">No expenses yet. Add your first expense above!</div>`;
        return;
    }

    const html = expenses.map(expense => `
        <div class="expense-item category-${expense.category}">
            <div class="expense-details">
                <div class="expense-description">${expense.description}</div>
                <span class="expense-category">${getCategoryIcon(expense.category)} ${getCategoryName(expense.category)}</span>
            </div>
            <div style="display: flex; align-items: center;">
                <div class="expense-amount">$${expense.amount.toFixed(2)}</div>
                <div class="expense-date">${formatDate(expense.date)}</div>
                <button class="delete-btn" onclick="deleteExpense(${expense.id})">🗑️</button>
            </div>
        </div>
    `).join("");

    expensesList.innerHTML = html;
}

function getCategoryIcon(category) {
    const icons = {
        food: '🍔',
        transport: '🚗',
        entertainment: '🎬',
        shopping: '🛍️',
        bills: '📋',
        other: '📝'
    };
    return icons[category] || '📝';
}

function getCategoryName(category) {
    const names = {
        food: 'Food & Dining',
        transport: 'Transportation',
        entertainment: 'Entertainment',
        shopping: 'Shopping',
        bills: 'Bills & Utilities',
        other: 'Other'
    };
    return names[category] || 'Other';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

function drawChart() {
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas at first
    ctx.clearRect(0, 0, width, height);

    if (expenses.length === 0) {
        ctx.fillStyle = '#999';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('No data to display', width / 2, height / 2);
        return;
    }

    // Calculate totals from categories
    const categoryTotals = {};
    expenses.forEach(expense => {
        categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
    });

    const total = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);

    // Draw the pie chart to the canvas
    const centerX = width / 2;
    const centerY = height / 2 - 20;
    const radius = Math.min(width, height) / 2 - 60;

    let currentAngle = -Math.PI / 2;

    Object.entries(categoryTotals).forEach(([category, amount]) => {
        const sliceAngle = (amount / total) * 2 * Math.PI;

        // Drawing a slice to the canvas
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
        ctx.closePath();
        ctx.fillStyle = categoryColors[category];
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();

        currentAngle += sliceAngle;
    });

    // Draw legend
    let legendY = height - 80;
    let legendX = 20;
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';

    Object.entries(categoryTotals).forEach(([category, amount], index) => {
        if (index > 0 && index % 3 === 0) {
            legendY += 20;
            legendX = 20;
        }

        // Color box
        ctx.fillStyle = categoryColors[category];
        ctx.fillRect(legendX, legendY, 12, 12);

        // Text
        ctx.fillStyle = '#333';
        const percentage = ((amount / total) * 100).toFixed(1);
        ctx.fillText(`${getCategoryName(category)} (${percentage}%)`, legendX + 18, legendY + 10);

        legendX += 150;
    });
}

// Display initialize
updateDisplay();

// Sample data for a demo
setTimeout(() => {
    const sampleExpenses = [
        { description: 'Lunch at cafe', amount: 12.50, category: 'food', date: '2025-06-18' },
        { description: 'Gas for car', amount: 45.00, category: 'transport', date: '2025-06-17' },
        { description: 'Movie tickets', amount: 24.00, category: 'entertainment', date: '2025-06-16' }
    ];

    sampleExpenses.forEach(expense => {
        expenses.unshift({
            ...expense,
            id: expenseId++,
            timestamp: new Date().getTime()
        });
    });

    updateDisplay();
}, 500);