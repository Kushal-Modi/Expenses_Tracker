package com.expensetracker.service;

import com.expensetracker.model.Budget;
import com.expensetracker.model.User;
import com.expensetracker.repository.BudgetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BudgetService {

    @Autowired
    private BudgetRepository budgetRepository;

    public List<Budget> getAllBudgets(User user) {
        return budgetRepository.findByUser(user);
    }

    public Optional<Budget> getBudgetById(Long id, User user) {
        return budgetRepository.findById(id)
                .filter(b -> b.getUser().getId().equals(user.getId()));
    }

    public Budget addOrUpdateBudget(Budget budget, User user) {
        Optional<Budget> existing = budgetRepository.findByCategoryAndUser(budget.getCategory(), user);
        if (existing.isPresent()) {
            Budget b = existing.get();
            b.setAmount(budget.getAmount());
            return budgetRepository.save(b);
        }
        budget.setUser(user);
        return budgetRepository.save(budget);
    }

    public void deleteBudget(Long id, User user) {
        Budget budget = budgetRepository.findById(id)
                .filter(b -> b.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new RuntimeException("Budget not found"));
        budgetRepository.delete(budget);
    }
}
