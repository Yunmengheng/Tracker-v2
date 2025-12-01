package com.financialtracker.transaction.service;

import com.financialtracker.transaction.dto.TransactionDTO;
import com.financialtracker.transaction.dto.TransactionStats;
import com.financialtracker.transaction.kafka.KafkaProducerService;
import com.financialtracker.transaction.kafka.TransactionEvent;
import com.financialtracker.transaction.model.Transaction;
import com.financialtracker.transaction.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final KafkaProducerService kafkaProducerService;

    public List<TransactionDTO> getAllTransactions(String userId) {
        return transactionRepository.findByUserId(userId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<TransactionDTO> getTransactionsByType(String userId, String type) {
        return transactionRepository.findByUserIdAndType(userId, type).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<TransactionDTO> getTransactionsByDateRange(String userId, LocalDate startDate, LocalDate endDate) {
        return transactionRepository.findByUserIdAndDateBetween(userId, startDate, endDate).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public TransactionDTO createTransaction(String userId, TransactionDTO dto) {
        Transaction transaction = new Transaction();
        transaction.setUserId(userId);
        transaction.setType(dto.getType());
        transaction.setCategory(dto.getCategory());
        transaction.setAmount(dto.getAmount());
        transaction.setDate(dto.getDate());
        transaction.setDescription(dto.getDescription());
        transaction.setNotes(dto.getNotes());
        transaction.setCreatedAt(LocalDateTime.now());
        transaction.setUpdatedAt(LocalDateTime.now());

        transaction = transactionRepository.save(transaction);

        // Send Kafka event
        TransactionEvent event = new TransactionEvent(
                "CREATED",
                transaction.getId(),
                userId,
                transaction.getType(),
                transaction.getCategory(),
                transaction.getAmount(),
                transaction.getDate().toString()
        );
        kafkaProducerService.sendTransactionEvent(event);

        return mapToDTO(transaction);
    }

    public TransactionDTO updateTransaction(String userId, String id, TransactionDTO dto) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        if (!transaction.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        transaction.setType(dto.getType());
        transaction.setCategory(dto.getCategory());
        transaction.setAmount(dto.getAmount());
        transaction.setDate(dto.getDate());
        transaction.setDescription(dto.getDescription());
        transaction.setNotes(dto.getNotes());
        transaction.setUpdatedAt(LocalDateTime.now());

        transaction = transactionRepository.save(transaction);

        // Send Kafka event
        TransactionEvent event = new TransactionEvent(
                "UPDATED",
                transaction.getId(),
                userId,
                transaction.getType(),
                transaction.getCategory(),
                transaction.getAmount(),
                transaction.getDate().toString()
        );
        kafkaProducerService.sendTransactionEvent(event);

        return mapToDTO(transaction);
    }

    public void deleteTransaction(String userId, String id) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        if (!transaction.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        transactionRepository.deleteById(id);

        // Send Kafka event
        TransactionEvent event = new TransactionEvent(
                "DELETED",
                id,
                userId,
                transaction.getType(),
                transaction.getCategory(),
                transaction.getAmount(),
                transaction.getDate().toString()
        );
        kafkaProducerService.sendTransactionEvent(event);
    }

    public TransactionStats getStats(String userId) {
        List<Transaction> transactions = transactionRepository.findByUserId(userId);
        
        double totalIncome = transactions.stream()
                .filter(t -> "INCOME".equals(t.getType()))
                .mapToDouble(Transaction::getAmount)
                .sum();
        
        double totalExpenses = transactions.stream()
                .filter(t -> "EXPENSE".equals(t.getType()))
                .mapToDouble(Transaction::getAmount)
                .sum();

        return new TransactionStats(
                totalIncome,
                totalExpenses,
                totalIncome - totalExpenses,
                (long) transactions.size()
        );
    }

    private TransactionDTO mapToDTO(Transaction transaction) {
        return new TransactionDTO(
                transaction.getId(),
                transaction.getType(),
                transaction.getCategory(),
                transaction.getAmount(),
                transaction.getDate(),
                transaction.getDescription(),
                transaction.getNotes()
        );
    }
}
