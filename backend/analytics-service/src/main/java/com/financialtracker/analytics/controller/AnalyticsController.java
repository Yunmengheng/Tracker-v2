package com.financialtracker.analytics.controller;

import com.financialtracker.analytics.dto.*;
import com.financialtracker.analytics.service.AnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/analytics")
@RequiredArgsConstructor
@Tag(name = "Analytics", description = "Analytics and reporting API")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/category-breakdown")
    @Operation(summary = "Get category breakdown")
    public ResponseEntity<CategoryBreakdown> getCategoryBreakdown(
            @RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(analyticsService.getCategoryBreakdown(userId));
    }

    @GetMapping("/trends")
    @Operation(summary = "Get trend data")
    public ResponseEntity<TrendData> getTrendData(
            @RequestHeader("X-User-Id") String userId,
            @RequestParam(defaultValue = "7") int days) {
        return ResponseEntity.ok(analyticsService.getTrendData(userId, days));
    }

    @GetMapping("/report")
    @Operation(summary = "Get financial report")
    public ResponseEntity<Report> getReport(
            @RequestHeader("X-User-Id") String userId,
            @RequestParam(defaultValue = "monthly") String period) {
        return ResponseEntity.ok(analyticsService.getReport(userId, period));
    }
}
