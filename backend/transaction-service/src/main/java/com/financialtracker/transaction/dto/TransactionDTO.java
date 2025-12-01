package com.financialtracker.transaction.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionDTO {
    private String id;
    private String type;
    private String category;
    private Double amount;
    private LocalDate date;
    private String description;
    private String notes;
}
