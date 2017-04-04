import { NgModule }                from "@angular/core";
import { CommonModule }            from "@angular/common";
import { ReactiveFormsModule }     from "@angular/forms";

import { FroalaEditorModule }      from "angular2-froala-wysiwyg";

import { FroalaBfDirectives }      from "./froala-bf.directives";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FroalaEditorModule.forRoot()
  ],
  declarations: [
    FroalaBfDirectives
  ],
  exports: [
    FroalaBfDirectives
  ]
})
export class FroalaBfModule {
}
