import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Transaction, TransactionType, TransactionFilter } from '../models/transaction.model';

interface TransactionStats {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  transactionCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private http = inject(HttpClient);
  private API_URL = 'http://localhost:8080/api/transactions';

  getAll(): Observable<Transaction[]> {
    return this.http.get<any[]>(`${this.API_URL}`).pipe(
      map(transactions => transactions.map(t => this.mapToTransaction(t)))
    );
  }

  getByType(type: TransactionType): Observable<Transaction[]> {
    return this.http.get<any[]>(`${this.API_URL}/type/${type}`).pipe(
      map(transactions => transactions.map(t => this.mapToTransaction(t)))
    );
  }

  getByDateRange(startDate: Date, endDate: Date): Observable<Transaction[]> {
    const params = new HttpParams()
      .set('startDate', startDate.toISOString().split('T')[0])
      .set('endDate', endDate.toISOString().split('T')[0]);

    return this.http.get<any[]>(`${this.API_URL}/date-range`, { params }).pipe(
      map(transactions => transactions.map(t => this.mapToTransaction(t)))
    );
  }

  getStats(): Observable<TransactionStats> {
    return this.http.get<TransactionStats>(`${this.API_URL}/stats`);
  }

  create(transaction: Partial<Transaction>): Observable<Transaction> {
    const payload = {
      type: transaction.type,
      category: transaction.category,
      amount: transaction.amount,
      date: transaction.date,
      description: transaction.description,
      notes: transaction.notes
    };

    return this.http.post<any>(`${this.API_URL}`, payload).pipe(
      map(t => this.mapToTransaction(t))
    );
  }

  update(id: string, transaction: Partial<Transaction>): Observable<Transaction> {
    const payload = {
      type: transaction.type,
      category: transaction.category,
      amount: transaction.amount,
      date: transaction.date,
      description: transaction.description,
      notes: transaction.notes
    };

    return this.http.put<any>(`${this.API_URL}/${id}`, payload).pipe(
      map(t => this.mapToTransaction(t))
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  private mapToTransaction(data: any): Transaction {
    return {
      id: data.id,
      userId: '',
      type: data.type as TransactionType,
      category: data.category,
      amount: data.amount,
      date: new Date(data.date),
      description: data.description,
      notes: data.notes,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
}
