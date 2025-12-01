package com.financialtracker.analytics.repository;

import com.financialtracker.analytics.model.AnalyticsCache;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AnalyticsCacheRepository extends MongoRepository<AnalyticsCache, String> {
    Optional<AnalyticsCache> findByUserIdAndType(String userId, String type);
}
