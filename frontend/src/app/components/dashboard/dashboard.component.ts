import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { Router, RouterModule } from '@angular/router';
import { ExpenseService } from '../../services/expense.service';
import { BudgetService, Budget } from '../../services/budget.service';
import { Expense } from '../../models/expense.model';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, BaseChartDirective],
  providers: [provideCharts(withDefaultRegisterables())],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  expenses: Expense[] = [];
  budgets: Budget[] = [];
  isLoading = true;

  // Pie Chart (Expenses by Category)
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'bottom' },
    }
  };
  
  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: [],
    datasets: [{ data: [] }]
  };
  
  public pieChartType: ChartType = 'pie';

  // Line Chart (Spending Trends)
  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.1)' } },
      x: { grid: { display: false } }
    }
  };

  public lineChartData: ChartData<'line'> = {
    labels: [],
    datasets: [{
      data: [],
      label: 'Daily Spending',
      borderColor: '#36A2EB',
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      fill: true,
      tension: 0.4
    }]
  };

  constructor(
    private expenseService: ExpenseService,
    private budgetService: BudgetService
  ) {}

  ngOnInit(): void {
    forkJoin({
      expenses: this.expenseService.getAllExpenses().pipe(
        catchError(err => {
          console.error('Error fetching expenses', err);
          return of([]);
        })
      ),
      budgets: this.budgetService.getAllBudgets().pipe(
        catchError(err => {
          console.error('Error fetching budgets', err);
          return of([]);
        })
      )
    }).subscribe({
      next: (data) => {
        this.expenses = data.expenses;
        this.budgets = data.budgets;
        this.processChartData();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  processChartData(): void {
    const expensesOnly = this.expenses.filter(e => !e.isIncome);
    
    // 1. Pie Chart Data
    const categoryTotals: { [key: string]: number } = {};
    expensesOnly.forEach(ex => {
      categoryTotals[ex.category] = (categoryTotals[ex.category] || 0) + ex.amount;
    });

    this.pieChartData = {
      labels: Object.keys(categoryTotals),
      datasets: [{
        data: Object.values(categoryTotals),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40']
      }]
    };

    // 2. Line Chart Data (Daily Spending - Last 7 Days)
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    const dailySpending = last7Days.map(date => {
      return expensesOnly
        .filter(e => e.date === date)
        .reduce((sum, e) => sum + e.amount, 0);
    });

    this.lineChartData = {
      labels: last7Days.map(d => d.split('-').slice(1).join('/')),
      datasets: [{
        ...this.lineChartData.datasets[0],
        data: dailySpending
      }]
    };
  }

  get totalIncome(): number {
    return this.expenses.filter(e => e.isIncome).reduce((sum, e) => sum + e.amount, 0);
  }

  get totalExpense(): number {
    return this.expenses.filter(e => !e.isIncome).reduce((sum, e) => sum + e.amount, 0);
  }

  get balance(): number {
    return this.totalIncome - this.totalExpense;
  }

  get budgetAlerts(): any[] {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return this.budgets.map(b => {
      const spent = this.expenses
        .filter(e => {
          if (e.isIncome || e.category !== b.category) return false;
          const expDate = new Date(e.date);
          return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
        })
        .reduce((sum, e) => sum + e.amount, 0);
      const percent = Math.min((spent / b.amount) * 100, 100);
      return { ...b, spent, percent };
    });
  }
}
