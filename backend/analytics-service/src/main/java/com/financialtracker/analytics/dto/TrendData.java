package com.financialtracker.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TrendData {
    private List<String> dates;
    private List<Double> income;
    private List<Double> expenses;
}
