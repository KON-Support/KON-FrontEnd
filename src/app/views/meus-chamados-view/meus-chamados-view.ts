import { Component } from '@angular/core';
import { ChamadosUser } from "../../components/chamados-user/chamados-user";
import { Navbar } from '../../components/navbar/navbar';

@Component({
  selector: 'app-meus-chamados-view',
  imports: [ChamadosUser, Navbar],
  templateUrl: './meus-chamados-view.html',
  styleUrl: './meus-chamados-view.scss',
})

export class MeusChamadosView {

}
