import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/admin/shared/services/auth.service';
import { PostsService } from '../../posts.service';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit {

  constructor(public auth: AuthService, private postsService: PostsService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
  }


}
