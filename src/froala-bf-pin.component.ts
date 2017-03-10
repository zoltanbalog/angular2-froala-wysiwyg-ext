import { Component, Input, OnInit, ElementRef } from '@angular/core';
import { Pin } from './pin';

@Component({
  selector: 'froala-bf-pin',
  templateUrl: './themes/default/froala-bf-pin.component.html',
  styleUrls: ['./themes/default/froala-bf-pin.component.css']
})
export class FroalaBfPinComponent implements OnInit{

    @Input() pin: Pin;
    @Input()
    set togglePin(toggle) {
        if (toggle && !this.isOpened) {
            this.isOpened = true;
        } else if (!toggle && this.isOpened) {
            this.isOpened = false;
        }
    }

    public isOpened: boolean = true;

    public isProductValid: boolean = true;
    public isStoreValid: boolean = true;
    public isTagsValid: boolean = true;
    public isLinkValid: boolean = true;

    public tooltipDirection: string = 'top';

    constructor(private elementRef: ElementRef) {
    }

    ngOnInit() {
        this.calculatePinTooltipDirection();
    }

    productChanged() {
        this.isProductValid = true;
    }

    storeChanged() {
        this.isStoreValid = true;
    }

    tagsChanged() {
        this.isTagsValid = true;
    }

    linkChanged() {
        this.isLinkValid = true;
    }

    isPinValid() {
        if (this.isProductValid
            && this.isStoreValid
            && this.isTagsValid
            && this.isLinkValid
        ) {
           return true;
        }

        return false;
    }

    /**
     * Calculate pin tooltip window direction
     */
    calculatePinTooltipDirection() {
        // let targetElement = this.elementRef.nativeElement.querySelector('.cd-img-replace');
        // let targetElementXPosition = 0;
        // let targetElementYPosition = 0;
        // while(targetElement) {
        //     targetElementXPosition += (targetElement.offsetLeft - targetElement.scrollLeft + targetElement.clientLeft);
        //     targetElementYPosition += (targetElement.offsetTop - targetElement.scrollTop + targetElement.clientTop);
        //     targetElement = targetElement.offsetParent;
        // }
        // console.log('tX: ' + targetElementXPosition + ' tY:' + targetElementYPosition);
        // let modalElementXPosition = 0;
        // let modalElementYPosition = 0;
        // let modalElement = <HTMLElement> document.querySelector('.main-content');
        // while (modalElement) {
        //   modalElementXPosition += (modalElement.offsetLeft - modalElement.scrollLeft + modalElement.clientLeft);
        //   modalElementYPosition += (modalElement.offsetTop - modalElement.scrollTop + modalElement.clientTop);
        //   modalElement = <HTMLElement> modalElement.offsetParent;
        // }
        // console.log('mX: ' + modalElementXPosition + ' mY:' + modalElementYPosition);
        // let X = targetElementXPosition - modalElementXPosition;
        // let Y = targetElementYPosition - modalElementYPosition;
        // console.log('X: ' + X + ' Y:' + Y);
        // if (X < 108) {
        //     this.tooltipDirection = 'right';
        //     return;
        // }
        //
        // if (Y < 220) {
        //     this.tooltipDirection = 'bottom';
        //     return;
        // }
        //
        // //Default:
        // this.tooltipDirection = 'top';
        // return;
    }
}
