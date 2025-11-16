import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UserService, User } from '../user';

@Component({
  selector: 'app-users-list',
  standalone: false,
  templateUrl: './users-list.html',
  styleUrls: ['./users-list.css']
})
export class UsersList implements OnInit {
  users: User[] = [];
  selectedUser: User | null = null;
  modalMode: 'create' | 'edit' | 'view' = 'create';
  showModal = false;

  // success message
  successMessage = '';
  showSuccessAlert = false;

  // delete confirmation modal
  showDeleteModal = false;

  constructor(private userService: UserService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.load();
  }

  
  load() {
    this.userService.getUsers().subscribe((data) => {
      this.users = [...data];
      this.cdr.detectChanges();
    });
  }

 //Filter component
  onUsersFiltered(filteredUsers: User[]) {
    this.users = filteredUsers;
    this.cdr.detectChanges();
  }

  //Count display
  getCount(): number {
    return this.users.length;
  }

  // ------------------- User Modal Methods -------------------

  openCreate() {
    this.selectedUser = null;
    this.modalMode = 'create';
    this.showModal = true;
  }

  openEdit(user: User) {
    this.selectedUser = user;
    this.modalMode = 'edit';
    this.showModal = true;
  }

  openView(user: User) {
    this.selectedUser = user;
    this.modalMode = 'view';
    this.showModal = true;
  }
  //parent calss 
  onModalClose(event: { refresh: boolean; user?: User }) {
    this.showModal = false;

    if (!event.refresh) return;

    if (this.modalMode === 'create') {
      this.showAlert('User created successfully!');
    } else if (this.modalMode === 'edit') {
      this.showAlert('User details updated!');
    }

    this.load();
    this.cdr.detectChanges();
  }

  // ------------------- Success Message Helpers -------------------

  showAlert(message: string) {
    this.successMessage = message;
    this.showSuccessAlert = true;

    setTimeout(() => {
      this.showSuccessAlert = false;
      this.cdr.detectChanges();
    }, 3000);
  }

  closeAlert() {
    this.showSuccessAlert = false;
    this.cdr.detectChanges();
  }

  // ------------------- Delete Confirmation -------------------

  openDeleteModal(user: User) {
    this.selectedUser = user;
    this.showDeleteModal = true;
  }

  cancelDelete() {
    this.showDeleteModal = false;
    this.selectedUser = null;
  }

  confirmDelete() {
    if (!this.selectedUser || !this.selectedUser.id) return;

    this.userService.deleteUser(this.selectedUser.id).subscribe(() => {
      this.showDeleteModal = false;
      this.selectedUser = null;
      this.showAlert('User deleted successfully!');
      this.load();
      this.cdr.detectChanges();
    });
  }
}
