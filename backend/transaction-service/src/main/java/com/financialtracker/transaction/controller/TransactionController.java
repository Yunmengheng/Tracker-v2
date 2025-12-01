package com.financialtracker.transaction.controller;

import com.financialtracker.transaction.dto.TransactionDTO;
import com.financialtracker.transaction.dto.TransactionStats;
import com.financialtracker.transaction.service.TransactionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/transactions")
@RequiredArgsConstructor
@Tag(name = "Transactions", description = "Transaction management API")
public class TransactionController {

    private final TransactionService transactionService;

    @GetMapping
    @Operation(summary = "Get all transactions for user")
    public ResponseEntity<List<TransactionDTO>> getAllTransactions(
            @RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(transactionService.getAllTransactions(userId));
    }

    @GetMapping("/type/{type}")
    @Operation(summary = "Get transactions by type")
    public ResponseEntity<List<TransactionDTO>> getByType(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable String type) {
        return ResponseEntity.ok(transactionService.getTransactionsByType(userId, type));
    }

    @GetMapping("/date-range")
    @Operation(summary = "Get transactions by date range")
    public ResponseEntity<List<TransactionDTO>> getByDateRange(
            @RequestHeader("X-User-Id") String userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(transactionService.getTransactionsByDateRange(userId, startDate, endDate));
    }

    @GetMapping("/stats")
    @Operation(summary = "Get transaction statistics")
    public ResponseEntity<TransactionStats> getStats(@RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(transactionService.getStats(userId));
    }

    @PostMapping
    @Operation(summary = "Create new transaction")
    public ResponseEntity<TransactionDTO> createTransaction(
            @RequestHeader("X-User-Id") String userId,
            @RequestBody TransactionDTO dto) {
        return ResponseEntity.ok(transactionService.createTransaction(userId, dto));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update transaction")
    public ResponseEntity<TransactionDTO> updateTransaction(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable String id,
            @RequestBody TransactionDTO dto) {
        return ResponseEntity.ok(transactionService.updateTransaction(userId, id, dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete transaction")
    public ResponseEntity<Void> deleteTransaction(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable String id) {
        transactionService.deleteTransaction(userId, id);
        return ResponseEntity.noContent().build();
    }
}
