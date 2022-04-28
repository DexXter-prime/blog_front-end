import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../admin/shared/services/auth.service';
import { PostsService } from '../shared/posts.service';
import { FormsModule } from '@angular/forms';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit, OnDestroy {

  constructor(public postsService: PostsService, public auth: AuthService, private router: Router) { }

  sub: any;
  searchText!: string;


  page: number = 1;
  count: number = 0;
  tableSize: number = 7;
  tableSizes: any = [3, 6, 9, 12];

  ngOnInit(): void {
    if(this.auth.isAuthenticated) {
      this.auth.getCurrentUser().subscribe();
    }
    this.sub = this.postsService.getAllPosts().subscribe();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    this.postsService.posts = null;
  }

  changeCurrentPage(event: number) {
    this.page = event;
  }

  logout(event: Event): void {
    event.preventDefault();
    this.auth.logout().subscribe();
    this.router.navigate(['/admin', 'login']);
  }

  onMain(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/posts'])
    this.postsService.getAllPosts().subscribe()
  }

  pageChange(event: number): void {
    console.log(event);
    console.log('works')
  }
}
