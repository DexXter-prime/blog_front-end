import { NgModule, Provider } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainLayoutComponent } from './shared/components/main-layout/main-layout.component';
import { HomePageComponent } from './home-page/home-page.component';
import { PostPageComponent } from './post-page/post-page.component';
import { PostComponent } from './shared/components/post/post.component';
import { SharedModule } from './shared/shared.module'
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './admin/shared/auth.interceptor';
import { AuthGuard } from './admin/shared/services/auth.guard';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { FormsModule } from '@angular/forms';
import { FilterPipe } from './filter.pipe';
import { ShortContentPipe } from './shortcontent.pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const INTERCEPTOR_PROVIDER: Provider = {
  provide: HTTP_INTERCEPTORS,
  multi: true,
  useClass: AuthInterceptor
}

@NgModule({
  declarations: [
    AppComponent,
    MainLayoutComponent,
    HomePageComponent,
    PostPageComponent,
    PostComponent,
    FilterPipe,
    ShortContentPipe,
    PageNotFoundComponent,
  ],
  imports: [
    NgxPaginationModule,
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
  ],
  providers: [INTERCEPTOR_PROVIDER, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
