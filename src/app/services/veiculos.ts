import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { DadosVeiculo, Veiculos, VeiculosAPI } from '../models/veiculo.model';

@Injectable({
	providedIn: 'root',
})
export class VeiculosService {
	private readonly apiUrl = 'http://localhost:3001';

	constructor(private http: HttpClient) {}

	listar(): Observable<Veiculos> {
		return this.http.get<VeiculosAPI>(`${this.apiUrl}/vehicles`).pipe(
			map((resposta) => resposta.vehicles)
		);
	}

	consultarDados(vin: string): Observable<DadosVeiculo> {
		return this.http.post<DadosVeiculo>(`${this.apiUrl}/vehicleData`, { vin });
	}
}
