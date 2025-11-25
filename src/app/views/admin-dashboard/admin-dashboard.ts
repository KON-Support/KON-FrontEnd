import { Component } from '@angular/core';
import { CardEstatistica } from '../../components/card-estatistica/card-estatistica';
import { ChamadosNaoAtribuidos } from '../../components/chamados-nao-atribuidos/chamados-nao-atribuidos';
import { NavbarAdmin } from "../../components/navbar-admin/navbar-admin";

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CardEstatistica, ChamadosNaoAtribuidos, NavbarAdmin],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss',
})

export class AdminDashboard { }