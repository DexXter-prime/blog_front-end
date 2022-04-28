import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { delay, of, Subscription, switchMap, tap } from 'rxjs';
import { urlPlaceholderLink, urlStaticLink } from 'src/environments/url';
import { ICurrentPost } from '../admin/shared/interfaces';
import { AuthService } from '../admin/shared/services/auth.service';
import { PostsService } from '../shared/posts.service';

@Component({
  selector: 'app-post-page',
  templateUrl: './post-page.component.html',
  styleUrls: ['./post-page.component.scss']
})
export class PostPageComponent implements OnInit, OnDestroy {

  staticPath =`${urlStaticLink}`;
  placeholderPath = `${urlPlaceholderLink}`;
  sub: any;
  sub1: any;
  isLiked!: any;


  constructor(public postsService: PostsService, private route: ActivatedRoute, private router: Router, private auth: AuthService) { }

  ngOnInit(): void {
    if(this.auth.isAuthenticated) {
      this.auth.getCurrentUser().subscribe(res => {
      });
      this.route.params.subscribe(params => {
        this.sub = this.postsService.getSinglePost(params.id).subscribe({
          next: () => {
            this.postsService.checkLike(this.postsService.currentPost.id, this.auth.currentUser.id).subscribe(res => {
              this.isLiked = res;
            });
          }
        });
      });
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.postsService.currentPost = null;
  }


  handleLike(id: number){
    this.postsService.likeHandler(id).subscribe(res => {
      console.log(res);
    });
  }

}
