package com.expensetracker.controller;

import com.expensetracker.model.Expense;
import com.expensetracker.model.User;
import com.expensetracker.service.ExpenseService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/expenses")
@CrossOrigin(origins = "http://localhost:4200", allowedHeaders = "*", methods = {
        RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT,
        RequestMethod.DELETE, RequestMethod.OPTIONS
})
public class ExpenseController {

    @Autowired
    private ExpenseService expenseService;

    private User getCurrentUser() {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    /**
     * GET /api/expenses - Retrieve all expenses
     */
    @GetMapping
    public ResponseEntity<List<Expense>> getAllExpenses() {
        List<Expense> expenses = expenseService.getAllExpenses(getCurrentUser());
        return ResponseEntity.ok(expenses);
    }

    /**
     * GET /api/expenses/{id} - Retrieve a specific expense
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getExpenseById(@PathVariable Long id) {
        return expenseService.getExpenseById(id, getCurrentUser())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * POST /api/expenses - Create a new expense
     */
    @PostMapping
    public ResponseEntity<Expense> addExpense(@Valid @RequestBody Expense expense) {
        Expense saved = expenseService.addExpense(expense, getCurrentUser());
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    /**
     * PUT /api/expenses/{id} - Update an existing expense
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateExpense(@PathVariable Long id,
                                           @Valid @RequestBody Expense expense) {
        try {
            Expense updated = expenseService.updateExpense(id, expense, getCurrentUser());
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }

    /**
     * DELETE /api/expenses/{id} - Delete an expense
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteExpense(@PathVariable Long id) {
        try {
            expenseService.deleteExpense(id, getCurrentUser());
            Map<String, String> response = new HashMap<>();
            response.put("message", "Expense deleted successfully");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }

    /**
     * GET /api/expenses/category/{category} - Get expenses by category
     */
    @GetMapping("/category/{category}")
    public ResponseEntity<List<Expense>> getByCategory(@PathVariable String category) {
        return ResponseEntity.ok(expenseService.getExpensesByCategory(category, getCurrentUser()));
    }

    /**
     * GET /api/expenses/search?keyword=xxx - Search expenses
     */
    @GetMapping("/search")
    public ResponseEntity<List<Expense>> searchExpenses(@RequestParam String keyword) {
        return ResponseEntity.ok(expenseService.searchExpenses(keyword, getCurrentUser()));
    }
}
