import { Component, EventEmitter, Output, OnInit, ChangeDetectorRef } from '@angular/core';
import { UserService, User } from '../user';

@Component({
  selector: 'app-user-filter',
  standalone: false,
  templateUrl: './user-filter.html',
  styleUrls: ['./user-filter.css']
})
export class UserFilter implements OnInit {
  @Output() usersFiltered = new EventEmitter<User[]>();
  @Output() cleared = new EventEmitter<void>();

  selectedStatus: boolean | null = null;
  selectedType = '';
  selectedRoles: string[] = [];
  selectedNames: string[] = [];

  searchUser = '';
  searchRole = '';
  userdropdownOpen = false;
  roledropdownOpen = false;

  users: User[] = [];

  constructor(private userService: UserService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadAll();
  }

  // ✅ "Clear All" button calls this
  load() {
    this.loadAll();
    this.cleared.emit();
  }

  loadAll() {
    this.userService.getUsers().subscribe(data => {
      this.users = data;
      this.cdr.detectChanges();
    });
  }

  // ✅ Dropdown open/close logic
  UserDropdown(state: boolean) {
    this.userdropdownOpen = state;
    this.roledropdownOpen = false;
  }

  roleDropDown(state: boolean) {
    this.roledropdownOpen = state;
    this.userdropdownOpen = false;
  }

  // ✅ Filter display lists
  filteredUsers(): User[] {
    return this.users.filter(user =>
      user.firstName?.toLowerCase().includes(this.searchUser.toLowerCase())
    );
  }

  filterRoles(): User[] {
    const filtered = this.users.filter(user =>
      (user.role ?? '').toLowerCase().includes(this.searchRole.toLowerCase())
    );
    return filtered.filter((u, i, self) => i === self.findIndex(x => x.role === u.role));
  }

  // ✅ Filter actions
  onTypeChange(type: string) {
    this.selectedType = type;
    this.userService.getUsersType(type).subscribe(data => this.usersFiltered.emit(data));
  }

  onStatusChange(status: boolean) {
    this.selectedStatus = status;
    this.userService.getUsersByStatus(status).subscribe(data => this.usersFiltered.emit(data));
  }

  // ✅ User name filter
  onUserToggle(name: string, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) this.selectedNames.push(name);
    else this.selectedNames = this.selectedNames.filter(n => n !== name);
  }

  UserDropClose() {
    this.userdropdownOpen = false;
    if (this.selectedNames.length === 0) {
      this.cleared.emit();
      return;
    }
    this.userService.getUsersByName(this.selectedNames).subscribe(data => {
      this.usersFiltered.emit(data);
    });
  }

  removeName(name: string) {
    this.selectedNames = this.selectedNames.filter(n => n !== name);
    if (this.selectedNames.length === 0) this.cleared.emit();
    else this.UserDropClose();
  }

  // ✅ Role filter
  onRoleToggle(role: string, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) this.selectedRoles.push(role);
    else this.selectedRoles = this.selectedRoles.filter(r => r !== role);
  }

  RoleDropClose() {
    this.roledropdownOpen = false;
    if (this.selectedRoles.length === 0) {
      this.cleared.emit();
      return;
    }
    this.userService.getUsersByRoles(this.selectedRoles).subscribe(data => {
      this.usersFiltered.emit(data);
    });
  }

  removeRole(role: string) {
    this.selectedRoles = this.selectedRoles.filter(r => r !== role);
    if (this.selectedRoles.length === 0) this.cleared.emit();
    else this.RoleDropClose();
  }

  // ✅ Clear All
  clearAll() {
    this.selectedNames = [];
    this.selectedRoles = [];
    this.selectedType = '';
    this.selectedStatus = null;
    this.cleared.emit();
  }
}
