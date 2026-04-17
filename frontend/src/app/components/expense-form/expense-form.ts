import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ExpenseService } from '../../services/expense.service';
import { Expense } from '../../models/expense.model';

@Component({
  selector: 'app-expense-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './expense-form.html',
  styleUrl: './expense-form.css'
})
export class ExpenseForm implements OnInit {
  expense: Expense = {
    title: '',
    amount: 0,
    category: '',
    date: new Date().toISOString().split('T')[0],
    isIncome: false
  };

  isEditMode = false;
  categories = ['Housing', 'Food', 'Transportation', 'Utilities', 'Entertainment', 'Healthcare', 'Shopping', 'Other'];

  constructor(
    private expenseService: ExpenseService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.expenseService.getExpenseById(+id).subscribe({
        next: (data) => this.expense = data,
        error: (err) => console.error('Error fetching expense', err)
      });
    }
  }

  onSubmit(): void {
    if (this.isEditMode && this.expense.id) {
      this.expenseService.updateExpense(this.expense.id, this.expense).subscribe({
        next: () => this.router.navigate(['/expenses']),
        error: (err) => console.error('Error updating expense', err)
      });
    } else {
      this.expenseService.addExpense(this.expense).subscribe({
        next: () => this.router.navigate(['/expenses']),
        error: (err) => console.error('Error adding expense', err)
      });
    }
  }
}
