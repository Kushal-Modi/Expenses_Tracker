import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { ExpenseService } from '../../services/expense.service';
import { Expense } from '../../models/expense.model';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  providers: [provideCharts(withDefaultRegisterables())],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  expenses: Expense[] = [];
  isLoading = true;

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

  constructor(private expenseService: ExpenseService) {}

  ngOnInit(): void {
    this.expenseService.getAllExpenses().subscribe({
      next: (data: Expense[]) => {
        this.expenses = data;
        this.processChartData();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  processChartData(): void {
    const categoryTotals: { [key: string]: number } = {};
    
    this.expenses.forEach(ex => {
      if (categoryTotals[ex.category]) {
        categoryTotals[ex.category] += ex.amount;
      } else {
        categoryTotals[ex.category] = ex.amount;
      }
    });

    this.pieChartData = {
      labels: Object.keys(categoryTotals),
      datasets: [{
        data: Object.values(categoryTotals),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
        ],
        hoverBackgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
        ]
      }]
    };
  }

  get totalSpend(): number {
    return this.expenses.reduce((sum, ex) => sum + ex.amount, 0);
  }
}
