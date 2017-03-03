import { NgModule }                from "@angular/core";

import { FroalaEditorModule }      from "angular2-froala-wysiwyg";

import { FroalaBfDirectives }      from "./src/froala-bf.directives";
import { FroalaBfAddPinComponent } from "./src/froala-bf-add-pin.component";

@NgModule({
    imports: [
        FroalaEditorModule.forRoot()
    ],
    declarations: [
        FroalaBfDirectives,
        FroalaBfAddPinComponent
    ],
    exports: [
        FroalaBfDirectives,
        FroalaBfAddPinComponent
    ]
})
export class FroalaBfModule {}
