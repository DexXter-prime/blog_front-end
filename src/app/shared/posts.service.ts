import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { switchMap, tap } from "rxjs";
import { urlPostLink } from "src/environments/url";
import { IPost } from "../admin/shared/interfaces";
import { AuthService } from "../admin/shared/services/auth.service";

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  currentPost!: any;
  posts!: any;

  constructor(private http: HttpClient, private router: Router, private auth: AuthService) {}

  createPost(post: IPost) {
    return this.http.post(`${urlPostLink}/create`, post, {withCredentials: true})
  }

  deletePost(id: number) {
    return this.http.delete(`${urlPostLink}/delete/${id}`, {withCredentials: true}).pipe(switchMap(posts => this.getAllPosts()));
  }


  updatePost(post: IPost, id: number) {
    return this.http.put(`${urlPostLink}/update/${id}`, post, {withCredentials: true})
  }

  getAllPosts(tagName?: string) {
    if(tagName){
      return this.http.get(`${urlPostLink}/all/${tagName}`, {withCredentials: true}).pipe(tap((posts) => {
        this.posts = posts;
      }));
    } else {
      return this.http.get(`${urlPostLink}/all`, {withCredentials: true}).pipe(tap((posts) => {
        this.posts = posts;
      }));
    }
  }

  getSinglePost(id: number) {
    return this.http.get(`${urlPostLink}/${id}`, {withCredentials: true}).pipe(tap((post) => {
      this.currentPost = post;
    }));
  }

  likeHandler(id: number){
    return this.http.put(`${urlPostLink}/update/${id}`, {incrementMsg: '++'}, {withCredentials: true}).pipe(switchMap(posts => this.getSinglePost(id)));
  }

  checkLike(id: number, userId?: number) {
    return this.http.post(`${urlPostLink}/post/${id}`, {postId: id, userId}, {withCredentials: true})
  }
}
