import { NgModule }                from "@angular/core";
import { CommonModule }            from "@angular/common";
import { FormsModule }             from "@angular/forms";

import { FroalaEditorModule }      from "angular2-froala-wysiwyg";

import { FroalaBfDirectives }      from "./src/froala-bf.directives";
import { FroalaBfAddPinComponent } from "./src/froala-bf-add-pin.component";
import { FroalaBfPinComponent }    from "./src/froala-bf-pin.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        FroalaEditorModule.forRoot()
    ],
    declarations: [
        FroalaBfDirectives,
        FroalaBfAddPinComponent,
        FroalaBfPinComponent
    ],
    exports: [
        FroalaBfDirectives,
        FroalaBfAddPinComponent
    ]
})
export class FroalaBfModule {}
