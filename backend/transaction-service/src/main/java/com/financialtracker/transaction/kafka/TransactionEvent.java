package com.financialtracker.transaction.kafka;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionEvent {
    private String eventType; // CREATED, UPDATED, DELETED
    private String transactionId;
    private String userId;
    private String type;
    private String category;
    private Double amount;
    private String date;
}
