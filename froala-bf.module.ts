import { NgModule }           from "@angular/core";

import { FroalaEditorModule } from "angular2-froala-wysiwyg";

import { FroalaBfDirectives } from "./froala-bf.directives";

@NgModule({
    imports: [
        FroalaEditorModule.forRoot()
    ],
    declarations: [
        FroalaBfDirectives
    ],
    exports: [
        FroalaBfDirectives
    ]
})
export class FroalaBfModule {}
