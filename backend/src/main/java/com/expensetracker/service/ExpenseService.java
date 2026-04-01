package com.expensetracker.service;

import com.expensetracker.model.Expense;
import com.expensetracker.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.expensetracker.model.User;
import java.util.List;
import java.util.Optional;

@Service
public class ExpenseService {

    @Autowired
    private ExpenseRepository expenseRepository;

    /**
     * Get all expenses from the database for a user
     */
    public List<Expense> getAllExpenses(User user) {
        return expenseRepository.findByUser(user);
    }

    /**
     * Get a single expense by ID for a user
     */
    public Optional<Expense> getExpenseById(Long id, User user) {
        return expenseRepository.findByIdAndUser(id, user);
    }

    /**
     * Save a new expense
     */
    public Expense addExpense(Expense expense, User user) {
        expense.setUser(user);
        return expenseRepository.save(expense);
    }

    /**
     * Update an existing expense
     */
    public Expense updateExpense(Long id, Expense updatedExpense, User user) {
        Expense existing = expenseRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Expense not found with id: " + id));

        existing.setTitle(updatedExpense.getTitle());
        existing.setAmount(updatedExpense.getAmount());
        existing.setCategory(updatedExpense.getCategory());
        existing.setDate(updatedExpense.getDate());

        return expenseRepository.save(existing);
    }

    /**
     * Delete an expense by ID
     */
    public void deleteExpense(Long id, User user) {
        if (!expenseRepository.existsByIdAndUser(id, user)) {
            throw new RuntimeException("Expense not found with id: " + id + " or you don't have permission");
        }
        expenseRepository.deleteById(id);
    }

    /**
     * Get expenses by category
     */
    public List<Expense> getExpensesByCategory(String category, User user) {
        return expenseRepository.findByCategoryAndUser(category, user);
    }

    /**
     * Search expenses by title keyword
     */
    public List<Expense> searchExpenses(String keyword, User user) {
        return expenseRepository.findByTitleContainingIgnoreCaseAndUser(keyword, user);
    }
}
