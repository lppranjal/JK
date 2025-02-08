import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { RoleService } from '../../services/role.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit {
  userName: string = '';

  constructor(private auth: AuthService, private roleService: RoleService) {}

  ngOnInit() {
    const token = this.auth.getToken();
    if (token) {
      const decoded: { [key: string]: any } = this.roleService.getUserRoles(); 
      this.userName = decoded['name'] || 'User';  // ✅ Fix: TypeScript now understands this
    }
  }
}
