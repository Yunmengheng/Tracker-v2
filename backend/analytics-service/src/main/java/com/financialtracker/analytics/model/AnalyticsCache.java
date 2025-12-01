package com.financialtracker.analytics.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "analytics_cache")
public class AnalyticsCache {
    @Id
    private String id;
    private String userId;
    private String type; // CATEGORY_BREAKDOWN, TREND_DATA, INSIGHTS
    private Object data;
    private LocalDateTime updatedAt;
}
