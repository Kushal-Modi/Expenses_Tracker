import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BudgetService, Budget } from '../../services/budget.service';

@Component({
  selector: 'app-budget-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './budget-management.html',
  styleUrl: './budget-management.css'
})
export class BudgetManagement implements OnInit {
  budgets: Budget[] = [];
  categories = ['Housing', 'Food', 'Transportation', 'Utilities', 'Entertainment', 'Healthcare', 'Shopping', 'Other'];
  
  newBudget: Budget = {
    category: '',
    amount: 0
  };

  constructor(private budgetService: BudgetService) {}

  ngOnInit(): void {
    this.loadBudgets();
  }

  loadBudgets(): void {
    this.budgetService.getAllBudgets().subscribe({
      next: (data) => this.budgets = data,
      error: (err) => console.error('Error fetching budgets', err)
    });
  }

  saveBudget(): void {
    if (this.newBudget.category && this.newBudget.amount > 0) {
      this.budgetService.addOrUpdateBudget(this.newBudget).subscribe({
        next: () => {
          this.loadBudgets();
          this.newBudget = { category: '', amount: 0 };
        },
        error: (err) => console.error('Error saving budget', err)
      });
    }
  }

  deleteBudget(id: number | undefined): void {
    if (id && confirm('Are you sure you want to delete this budget?')) {
      this.budgetService.deleteBudget(id).subscribe({
        next: () => this.loadBudgets(),
        error: (err) => console.error('Error deleting budget', err)
      });
    }
  }
}
