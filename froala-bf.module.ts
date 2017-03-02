import { NgModule }           from "@angular/core";

import { SharedModule }       from "../shared_modules/shared.module";
import { FroalaEditorModule } from "angular2-froala-wysiwyg";

import { FroalaBfDirectives } from "./froala-bf.directives";

@NgModule({
    imports: [
        SharedModule,
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
