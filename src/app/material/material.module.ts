import { NgModule } from '@angular/core';
import { MatButtonModule} from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
// import {MatIconRegistry} from '@angular/material/icon';


const MaterialComponents = [
  MatButtonModule,
  MatButtonToggleModule
];


@NgModule({
  imports: [MaterialComponents],
  exports: [MaterialComponents]
})
export class MaterialModule { }
