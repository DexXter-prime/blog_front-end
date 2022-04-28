import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { delay, Observable, of, tap } from 'rxjs';
import { PostsService } from 'src/app/shared/posts.service';
import { urlPlaceholderLink, urlStaticLink } from 'src/environments/url';
import { ICurrentPost, IPost } from '../shared/interfaces';
import { MyValidators } from '../shared/my.validators';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-create-page',
  templateUrl: './create-page.component.html',
  styleUrls: ['./create-page.component.scss']
})
export class CreatePageComponent implements OnInit {

  submitted = false;
  postData!: any;
  form!: FormGroup;
  imagePath!: string | null;


  constructor(
    private postsService: PostsService,
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService
  ) { }

  ngOnInit(): void {

    this.form = new FormGroup({
      title: new FormControl(null, [Validators.required, Validators.maxLength(15)]), //add error to front
      content: new FormControl(null, [Validators.required, Validators.minLength(10)]),
      tags: new FormControl(null, [MyValidators.checkAmountOfTags()]), // fix zero tags
      file: new FormControl(null)
    })


    if(this.auth.isAuthenticated) {
      if(this.route.snapshot.queryParamMap.get('updatingPost')) {
        this.postsService.getSinglePost(Number(this.route.snapshot.queryParamMap.get('postId'))).subscribe({
          next: (res) => {
            console.log(res)
            const {title, content, tags, imageSource} = res as ICurrentPost ;
            this.imagePath = this.postsService.currentPost.imageSource ? urlStaticLink + this.postsService.currentPost.imageSource : urlPlaceholderLink;
            this.form.patchValue({title, content, file: imageSource, tags: tags?.join(', ')});
            this.form.get('file')?.updateValueAndValidity();
            console.log(this.form.value);
          },
          error: () =>  {
            of(this.form).pipe(delay(150), tap((form) => {
              console.log(form.value);
              const {title, content, tags, imageSource} = this.postsService.currentPost;
              this.imagePath = this.postsService.currentPost.imageSource ? urlStaticLink + this.postsService.currentPost.imageSource : urlPlaceholderLink;
              form.patchValue({title, content, file: imageSource, tags: tags?.join(', '), });
              form.get('file')?.updateValueAndValidity();
              console.log(form.value);

            })).subscribe();
          }
        })
      }
    }
  }


  uploadFile(event: Event) {

    if((event.target as HTMLInputElement).files?.length) {
      const file = (event.target as HTMLInputElement).files![0];
      this.form.patchValue({file});
      this.form.get('file')?.updateValueAndValidity();

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePath = reader.result as string;
      }
      reader.readAsDataURL(file);
    }

  }

  handleTags(tags: string): string[] | null {
    return  tags ? tags.replace(/\s/g, '').split(',') : null;
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }

    this.submitted = true;


    const formData: any = new FormData();
    formData.append('image', this.form.get('file')?.value);
    formData.append('title', this.form.get('title')?.value);
    formData.append('content',  this.form.get('content')?.value);
    formData.append('tags',  this.handleTags(this.form.get('tags')?.value));


    this.route.queryParams.subscribe({
      next: (params: Params) => {
        if(params.updatingPost) {
          this.postsService.updatePost(formData, params.postId).subscribe({
            next: () => {
              this.submitted = false;
              this.form.reset();
              this.router.navigate(['/posts']);
            },
            error: () => {
              console.log('UPdate create error');
            }
          })
        } else {
          this.postsService.createPost(formData).subscribe({
            next: () => {
              this.submitted = false;
              this.form.reset();
              this.router.navigate(['/posts']);
            },
            error: () => {
              console.log('Post error');
            }
          });
        }
      }
    })
  }

}
