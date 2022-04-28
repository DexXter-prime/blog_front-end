import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(posts: any, searchInput: string): any {
    if(!searchInput) {
        return posts;
    }
   return posts.filter(
       (x:any) => x.title.includes(searchInput)
   )
 }

}
