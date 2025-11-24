import { Component } from '@angular/core';
import { TicketsUser } from '../../components/tickets-user/tickets-user';

@Component({
  selector: 'app-user-dashboard',
  imports: [TicketsUser],
  templateUrl: './user-dashboard.html',
  styleUrl: './user-dashboard.scss',
})

export class UserDashboard {

}
