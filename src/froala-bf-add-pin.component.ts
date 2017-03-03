import { Component, Input } from '@angular/core';

@Component({
    selector: 'froala-bf-add-pin',
    templateUrl: './themes/default/froala-bf-add-pin.component.html',
    styleUrls: ['./themes/default/froala-bf-add-pin.component.css']
})
export class FroalaBfAddPinComponent {

    @Input() imageId: any;
    @Input() imageSrc: any;

    constructor() {
        console.log('Froala add pin component is ready');
    }
}