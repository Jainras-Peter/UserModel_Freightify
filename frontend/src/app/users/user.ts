import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface User{
  id?:string;
  firstName:string;
  lastName?: string;
  email: string;
  phone: string;
  type: string;
  role?: string;
  createdAt?: string;
  selected?: boolean;
  password: string;
  confirmPassword?: string;
  userCurrency: string;
  measurementSystem: string;
  userStatus: boolean; 
}

@Injectable({
  providedIn: 'root'
})

export class UserService {
  private API = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) { }


  getUsers(): Observable<User[]> {  
    return this.http.get<User[]>(this.API);
  }
  getUser(id: string) {
    return this.http.get<User>(`${this.API}/${id}`);
  }
  createUser(user: User) {
    return this.http.post<User>(this.API, user);
  }
  updateUser(id: string, user: User) {
    return this.http.put<User>(`${this.API}/${id}`, user);

  }
  deleteUser(id: string) {
    return this.http.delete(`${this.API}/${id}`);
  }

  //filters
  getUsersByRoles(roles: string[]): Observable<User[]> {
  const params = roles.map(r => `roles=${encodeURIComponent(r)}`).join('&');
  return this.http.get<User[]>(`${this.API}/filter?${params}`);
  }

  getUsersByName(names: string[]):Observable<User[]>{
    const params = names.map(n=>`names=${encodeURIComponent(n)}`).join('&');
      return this.http.get<User[]>(`${this.API}/filter?${params}`)
  }

  getUsersType(type:string):Observable<User[]>{
    return this.http.get<User[]>(`${this.API}/filter?type=${type}`)
  }
  getUsersByStatus(status: boolean) {
  return this.http.get<User[]>(`${this.API}/filter?status=${status}`);
}

  
}
