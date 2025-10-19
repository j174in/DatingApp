import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { NavComponent } from '../layout/nav/nav.component';
import { User } from '../types/user';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [NavComponent, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  // private accountService = inject(AccountService);
  protected router = inject(Router);
  // private http = inject(HttpClient); // new way of styling
  // title = 'DatingApp';
  // protected members = signal<User[]>([]);

  // ngOnInit(): void {
  //   this.http.get('https://localhost:5001/api/members').subscribe({
  //     next: response => this.members.set(response) ,
  //     error: error => console.log(error),
  //     complete: () => console.log('Completed http get call')
  //     //complete is optional
  //     //Happens on initialization
  //   })
  // }

  // async ngOnInit() {
  //   this.members.set(await this.getMember());
  //   // this.setCurrentUser();
  // }

  // setCurrentUser() {
  //   const userString = localStorage.getItem('user');
  //   if (!userString) return;
  //   const user = JSON.parse(userString);
  //   this.accountService.currentUser.set(user);
  // }

  // async getMember() {
  //   // this.http.get('https://localhost:5001/api/members').toPromise();
  //   try {
  //     return lastValueFrom(
  //       this.http.get<User[]>('https://localhost:5001/api/members')
  //     );
  //   } catch (error) {
  //     console.log(error);
  //     throw error;
  //   }
  // }

  // constructor( private http : HttpClient){}
  // Lifecyle
  // Clsss in constructed
  //When comes to fetching data, we don't get it to get data
  //while class is constructed
  // Class is initialized ( implement interface (oninit))
  //Data is fetched on initilalization phase
  //Observable - is an tool for managing async data streams.
  //Represents a stream of data that can emit multiple
  //values over time.
  //If we need to listen to the observable we need to subscirbe
  //to it.

  //we don't unsubscribe it does not get freed up.
  //in http request case it gets completed and after that
  //it gets unsubcribed automatically
  //In case of streams of data it does not

  //Unsubcribing might become an issue where an HTTP call gets
  //blocked or something. I
  //There are other ways of gettings data.
  //one such way is returning a promise.
}
