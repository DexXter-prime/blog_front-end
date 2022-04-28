import { HttpParams } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, forkJoin, Subject, switchMap, tap } from 'rxjs';
import { AuthService } from 'src/app/admin/shared/services/auth.service';
import { urlPlaceholderLink, urlStaticLink } from 'src/environments/url';
import { PostsService } from '../../posts.service';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

  @Input() title = '';
  @Input() content = '';
  @Input() author = '';
  @Input() date = '';
  @Input() postId!: number;
  @Input() imageTitle = ''
  @Input() likeCounter = 0;
  @Input() tags = [];
  @Output() onTagClick = new EventEmitter<number>();

  staticPath =`${urlStaticLink}`;
  placeholderPath = `${urlPlaceholderLink}`;
  endTagIndex = 8;
  endContentIndex = 48;


  constructor(private postsService: PostsService, private router: Router, public auth: AuthService) { }

  ngOnInit(): void {

  }

  onDelete(id: number): void {
    this.postsService.deletePost(id).subscribe(res => {
      this.router.navigate(['/posts'])
    });
  }

  onEdit(id: number): void {
    this.router.navigate(['/admin', 'create'], {queryParams: {
      updatingPost: true,
      postId: id
    }});
  }

  switchToDefaultPage(): void {
    this.onTagClick.emit(1);
  }

  onTagName(tagName: string): void {
    this.router.navigate(['/posts'], {
      queryParams: {
        tagName,
      }
    })

    this.postsService.getAllPosts(tagName).subscribe(res => {
      console.log(res);
      this.switchToDefaultPage();
    });
  }

}
