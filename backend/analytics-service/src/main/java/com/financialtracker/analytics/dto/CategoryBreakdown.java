package com.financialtracker.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryBreakdown {
    private Map<String, Double> income;
    private Map<String, Double> expense;
}
