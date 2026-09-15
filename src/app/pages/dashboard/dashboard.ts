import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../services/auth';
import { DadosVeiculo, Veiculo } from '../../models/veiculo.model';
import { VeiculosService } from '../../services/veiculos';

@Component({
  selector: 'app-dashboard',
  imports: [FormsModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  menuAberto = false;
  veiculos: Veiculo[] = [];
  veiculoSelecionado: Veiculo | null = null;
  codigoVin = '';
  dadosVeiculo: DadosVeiculo | null = null;
  mensagemCodigo: string | null = null;
  mensagemDeErro: string | null = null;

  constructor(
    private auth: Auth,
    private router: Router,
    private elementRef: ElementRef<HTMLElement>,
    private veiculosService: VeiculosService
  ) {}

  ngOnInit(): void {
    this.veiculosService.listar().subscribe({
      next: (veiculos) => {
        this.veiculos = veiculos;
        this.veiculoSelecionado = veiculos.find((veiculo) => veiculo.vehicle === 'Ranger') ?? veiculos[0] ?? null;
      },
      error: () => {
        this.mensagemDeErro = 'Não foi possível carregar os dados dos veículos.';
      },
    });
  }

  selecionarVeiculo(nome: string): void {
    this.veiculoSelecionado = this.veiculos.find((veiculo) => veiculo.vehicle === nome) ?? null;
  }

  consultarCodigo(vin: string): void {
    const codigoNormalizado = vin.trim().toUpperCase();

    if (codigoNormalizado.length !== 20) {
      this.dadosVeiculo = null;
      this.mensagemCodigo = codigoNormalizado ? 'Digite um código VIN válido com 20 caracteres.' : null;
      return;
    }

    this.veiculosService.consultarDados(codigoNormalizado).subscribe({
      next: (dados) => {
        this.dadosVeiculo = dados;
        this.mensagemCodigo = null;
      },
      error: (erro: { status: number; error?: { message?: string } }) => {
        this.dadosVeiculo = null;
        this.mensagemCodigo = erro.error?.message ?? 'Não foi possível consultar o código VIN.';
      },
    });
  }

  @HostListener('document:click', ['$event'])
  @HostListener('document:focusin', ['$event'])
  fecharAoSairDoFoco(event: Event): void {
    if (this.menuAberto && !this.elementRef.nativeElement.contains(event.target as Node)) {
      this.menuAberto = false;
    }
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  alternarMenu(): void {
    this.menuAberto = !this.menuAberto;
  }
}
