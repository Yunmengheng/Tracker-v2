package com.financialtracker.analytics.service;

import com.financialtracker.analytics.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final RestTemplate restTemplate = new RestTemplate();

    public CategoryBreakdown getCategoryBreakdown(String userId) {
        // In real implementation, fetch from transaction service or cached data
        Map<String, Double> income = new HashMap<>();
        income.put("Salary", 5000.0);
        income.put("Freelance", 1500.0);
        income.put("Investment", 500.0);

        Map<String, Double> expense = new HashMap<>();
        expense.put("Food", 800.0);
        expense.put("Transport", 200.0);
        expense.put("Shopping", 400.0);
        expense.put("Bills", 600.0);

        return new CategoryBreakdown(income, expense);
    }

    public TrendData getTrendData(String userId, int days) {
        List<String> dates = new ArrayList<>();
        List<Double> income = new ArrayList<>();
        List<Double> expenses = new ArrayList<>();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM-dd");
        
        for (int i = days - 1; i >= 0; i--) {
            LocalDate date = LocalDate.now().minusDays(i);
            dates.add(date.format(formatter));
            
            // Mock data - in reality, fetch from transaction service
            income.add(200.0 + Math.random() * 100);
            expenses.add(150.0 + Math.random() * 80);
        }

        return new TrendData(dates, income, expenses);
    }

    public Report getReport(String userId, String period) {
        CategoryBreakdown breakdown = getCategoryBreakdown(userId);
        TrendData trendData = getTrendData(userId, 7);
        
        double totalIncome = breakdown.getIncome().values().stream()
                .mapToDouble(Double::doubleValue).sum();
        double totalExpense = breakdown.getExpense().values().stream()
                .mapToDouble(Double::doubleValue).sum();

        List<String> insights = generateInsights(totalIncome, totalExpense, breakdown);

        return new Report(
                period,
                totalIncome,
                totalExpense,
                totalIncome - totalExpense,
                breakdown,
                insights,
                trendData
        );
    }

    private List<String> generateInsights(double totalIncome, double totalExpense, CategoryBreakdown breakdown) {
        List<String> insights = new ArrayList<>();
        
        double savingsRate = ((totalIncome - totalExpense) / totalIncome) * 100;
        insights.add(String.format("Your savings rate is %.1f%%", savingsRate));
        
        String topExpenseCategory = breakdown.getExpense().entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("Unknown");
        insights.add("Your highest expense category is " + topExpenseCategory);
        
        if (totalExpense > totalIncome) {
            insights.add("Warning: Your expenses exceed your income this period");
        } else {
            insights.add("Great! You're spending less than you earn");
        }
        
        return insights;
    }
}
