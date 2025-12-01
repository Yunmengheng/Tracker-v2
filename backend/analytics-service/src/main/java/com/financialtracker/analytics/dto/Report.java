package com.financialtracker.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Report {
    private String period;
    private Double totalIncome;
    private Double totalExpense;
    private Double balance;
    private CategoryBreakdown categoryBreakdown;
    private List<String> insights;
    private TrendData trendData;
}
