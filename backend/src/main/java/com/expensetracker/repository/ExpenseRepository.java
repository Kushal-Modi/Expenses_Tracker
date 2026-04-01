package com.expensetracker.repository;

import com.expensetracker.model.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.expensetracker.model.User;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    List<Expense> findByUser(User user);
    
    Optional<Expense> findByIdAndUser(Long id, User user);
    
    boolean existsByIdAndUser(Long id, User user);

    List<Expense> findByCategoryAndUser(String category, User user);

    List<Expense> findByDateBetweenAndUser(LocalDate startDate, LocalDate endDate, User user);

    List<Expense> findByTitleContainingIgnoreCaseAndUser(String keyword, User user);
}
