import { Component, OnInit, ChangeDetectorRef ,HostListener} from '@angular/core';
import { UserService, User } from '../user';
declare var bootstrap: any; 

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
  selectedStatus :any ;
  selectedType :string =""
  showModal = false;

  //search role
  selectedRoles :string[]=[];
  searchRole ='';
  roledropdownOpen=false;
  //search user name
  userdropdownOpen = false;
  searchUser = '';
  selectedNames:string[]=[];
  //success msg
  successMessage = '';
  showSuccessAlert = false;
  //Delete modal
  showDeleteModal = false;
  
  constructor(private userService: UserService, private cdr: ChangeDetectorRef) {}

  //Name search
  UserDropdown(state: boolean) {
    this.userdropdownOpen = state;
    this.roledropdownOpen=false;
    
  }

  filteredUsers(): User[] {
  return this.users.filter(user =>
    user.firstName.toLowerCase().includes(this.searchUser.toLowerCase())
    
  );

   }

 onUserToggle(name: string, event: Event) {
  const checked = (event.target as HTMLInputElement).checked;
  if (checked) {
    if (!this.selectedNames.includes(name)) this.selectedNames.push(name);
  } else {
    this.selectedNames = this.selectedNames.filter(n=> n !== name);
  }
}

  
 UserDropClose(){
  this.userdropdownOpen=false;
  if (this.selectedNames.length === 0) {
    this.load(); 
    return;
  }

   this.userService.getUsersByName(this.selectedNames).subscribe((data) => {
    this.users = data;
    this.cdr.detectChanges();
  }
);
 }

 removeName(name : string){
  this.selectedNames =this.selectedNames.filter(n=>n!==name)
  this.cdr.detectChanges()

  if (this.selectedNames.length===0){
    this.load();
  }else{
    this.userService.getUsersByName(this.selectedNames).subscribe(data=>{
      this.users=data;
      this.cdr.detectChanges()
    })
  }
 }

 //Role search

 roleDropDown(state:boolean){
  this.roledropdownOpen=state
  
 }



filterRoles(): User[] {
  const filteredUsers = this.users.filter(user =>
    (user.role ?? '').toLowerCase().includes(this.searchRole.toLowerCase())
  );


  const uniqueUsers = filteredUsers.filter(
    (user, index, self) =>
      index === self.findIndex(u => u.role === user.role)
  );

  return uniqueUsers;
}


 RoleDropClose(){
  this.roledropdownOpen=false;
  if (this.selectedRoles.length === 0) {
    this.load(); 
    return;
  }

  this.userService.getUsersByRoles(this.selectedRoles).subscribe((data) => {
    this.users = data;
    this.cdr.detectChanges();
  });

 }

 onRoleToggle(role: string, event: Event) {
  const checked = (event.target as HTMLInputElement).checked;
  if (checked) {
    if (!this.selectedRoles.includes(role)) this.selectedRoles.push(role);
  } else {
    this.selectedRoles = this.selectedRoles.filter(r => r !== role);
  }
  }

  removeRole(role: string) {
  this.selectedRoles = this.selectedRoles.filter(r => r !== role);
  this.cdr.detectChanges();

  // refresh the user list when role is removed
  if (this.selectedRoles.length === 0) {
    this.load();
  } else {
    this.userService.getUsersByRoles(this.selectedRoles).subscribe(data => {
      this.users = data;
      this.cdr.detectChanges();
    });
  }
 }


 //---- 
  getCount():number{
    return this.users.length;
  }
  
  ngOnInit(): void {
    this.load();
  }

  load() {
    this.userService.getUsers().subscribe((data) => {
      this.users = [...data];
      this.cdr.detectChanges();
    });
  }
  //Raido Type- filter
  onTypeChange(type: string) {
    this.selectedType = type;
    this.userService.getUsersType(this.selectedType).subscribe((data)=>{
      this.users=data;
      this.cdr.detectChanges();
    }) 
  }

  //Radio Status-filter
  onStatusChange(status :boolean){
    this.selectedStatus=status

    this.userService.getUsersByStatus(this.selectedStatus).subscribe((data)=>{
      this.users=data;
      this.cdr.detectChanges();
    })

  }
 //User-modal 
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

  //success-Msg helpers
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

  
  //Event from child class while close the form
  onModalClose(event: { refresh: boolean; user?: User }) {
    this.showModal = false;

    if (!event.refresh) return;

    if(this.modalMode==='create'){
      this.showAlert('User created Successfully!')
    }else if(this.modalMode==='edit'){
      this.showAlert('User details updated!')
    }
    this.load()
    this.cdr.detectChanges();
  }

  //delete-confirm modal
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
