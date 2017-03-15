import { NgModule }                from "@angular/core";
import { CommonModule }            from "@angular/common";
import {ReactiveFormsModule}             from "@angular/forms";

import { FroalaEditorModule }      from "angular2-froala-wysiwyg";

import { FroalaBfDirectives }      from "./src/directives/froala-bf.directives";
import { ActionComponent } from "./src/components/pin/action.component";
import { TooltipComponent }    from "./src/components/pin/tooltip.component";
import { IconComponent }    from "./src/components/pin/icon.component";


@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FroalaEditorModule.forRoot()
    ],
    declarations: [
        FroalaBfDirectives,
        ActionComponent,
        TooltipComponent,
        IconComponent
    ],
    exports: [
        FroalaBfDirectives,
        ActionComponent
    ]
})
export class FroalaBfModule {}
