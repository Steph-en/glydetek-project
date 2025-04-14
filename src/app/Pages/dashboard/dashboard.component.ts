import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../../Service/auth.service';
import { AsyncPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [AsyncPipe, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  currentUser$ = this.authService.currentUser$;

  ngOnInit(): void { }

  async logout(): Promise<void> {
    await this.authService.logout();
  }
}