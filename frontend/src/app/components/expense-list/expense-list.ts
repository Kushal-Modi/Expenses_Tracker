import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ExpenseService } from '../../services/expense.service';
import { Expense } from '../../models/expense.model';

@Component({
  selector: 'app-expense-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './expense-list.html',
  styleUrl: './expense-list.css',
})
export class ExpenseList implements OnInit {
  expenses: Expense[] = [];
  filteredExpenses: Expense[] = [];
  
  // Filter states
  searchQuery: string = '';
  categoryFilter: string = '';
  dateFilter: string = '';
  customStartDate: string = '';
  customEndDate: string = '';

  constructor(private expenseService: ExpenseService, private router: Router) {}

  ngOnInit(): void {
    this.loadExpenses();
  }

  loadExpenses(): void {
    this.expenseService.getAllExpenses().subscribe({
      next: (data) => {
        this.expenses = data;
        this.filteredExpenses = [...this.expenses];
        this.applyFilters();
      },
      error: (err) => console.error('Error fetching expenses', err)
    });
  }

  deleteExpense(id: number | undefined): void {
    if (id && confirm('Are you sure you want to delete this expense?')) {
      this.expenseService.deleteExpense(id).subscribe({
        next: () => this.loadExpenses(),
        error: (err) => console.error('Error deleting expense', err)
      });
    }
  }

  applyFilters(): void {
    let tempExpenses = [...this.expenses];

    // 1. Text Search Filter
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      tempExpenses = tempExpenses.filter(e => e.title.toLowerCase().includes(q));
    }

    // 2. Category Filter
    if (this.categoryFilter && this.categoryFilter !== '') {
      tempExpenses = tempExpenses.filter(e => e.category === this.categoryFilter);
    }

    // 3. Date Filter
    if (this.dateFilter && this.dateFilter !== '') {
      const now = new Date();
      if (this.dateFilter === '7days') {
        const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7));
        tempExpenses = tempExpenses.filter(e => new Date(e.date) >= sevenDaysAgo);
      } else if (this.dateFilter === '30days') {
        const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
        tempExpenses = tempExpenses.filter(e => new Date(e.date) >= thirtyDaysAgo);
      } else if (this.dateFilter === 'custom' && this.customStartDate && this.customEndDate) {
        const start = new Date(this.customStartDate);
        const end = new Date(this.customEndDate);
        // Include the entire end date by setting it to end of day
        end.setHours(23, 59, 59, 999);
        tempExpenses = tempExpenses.filter(e => {
          const expenseDate = new Date(e.date);
          return expenseDate >= start && expenseDate <= end;
        });
      }
    }

    this.filteredExpenses = tempExpenses;
  }

  exportCSV(): void {
    if (this.filteredExpenses.length === 0) {
      alert('No data to export.');
      return;
    }

    const headers = ['Date', 'Title', 'Category', 'Amount'];
    const rows = this.filteredExpenses.map(e => [
      e.date,
      `"${e.title.replace(/"/g, '""')}"`, // Quote title to handle commas securely
      e.category,
      e.amount.toString()
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    
    // Create an invisible anchor to trigger download
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'filtered_expenses.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
