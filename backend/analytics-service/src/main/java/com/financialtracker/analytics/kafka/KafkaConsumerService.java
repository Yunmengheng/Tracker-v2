package com.financialtracker.analytics.kafka;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class KafkaConsumerService {

    private final ObjectMapper objectMapper;

    @KafkaListener(topics = "transaction-events", groupId = "analytics-group")
    public void consumeTransactionEvent(String message) {
        try {
            TransactionEvent event = objectMapper.readValue(message, TransactionEvent.class);
            log.info("Received transaction event: {} for user {}", event.getEventType(), event.getUserId());
            
            // Here you would update analytics cache when transactions change
            // For now, we just log the event
            
        } catch (JsonProcessingException e) {
            log.error("Error processing transaction event", e);
        }
    }
}
