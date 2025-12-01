import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FinancialReport, ReportPeriod } from '../models/report.model';

interface CategoryBreakdown {
  income: { [key: string]: number };
  expense: { [key: string]: number };
}

interface TrendData {
  dates: string[];
  income: number[];
  expenses: number[];
}

interface BackendReport {
  period: string;
  totalIncome: number;
  totalExpense: number;
  balance: number;
  categoryBreakdown: CategoryBreakdown;
  insights: string[];
  trendData: TrendData;
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private http = inject(HttpClient);
  private API_URL = 'http://localhost:8080/api/analytics';

  getCategoryBreakdown(): Observable<CategoryBreakdown> {
    return this.http.get<CategoryBreakdown>(`${this.API_URL}/category-breakdown`);
  }

  getTrendData(days: number = 7): Observable<TrendData> {
    const params = new HttpParams().set('days', days.toString());
    return this.http.get<TrendData>(`${this.API_URL}/trends`, { params });
  }

  getReport(period: string = 'monthly'): Observable<BackendReport> {
    const params = new HttpParams().set('period', period);
    return this.http.get<BackendReport>(`${this.API_URL}/report`, { params });
  }
}
