package com.financialtracker.transaction.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionStats {
    private Double totalIncome;
    private Double totalExpenses;
    private Double balance;
    private Long transactionCount;
}
