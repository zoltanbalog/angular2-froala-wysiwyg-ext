import {Component, EventEmitter, Input, Output} from '@angular/core';
import { Pin } from '../../interfaces/pin';
import { PinAction } from '../../interfaces/pin-action';

@Component({
  selector: 'froala-bf-pin-icon',
  templateUrl: '../../themes/default/icon.component.html',
  styleUrls: ['../../themes/default/icon.component.css']
})
export class IconComponent {

    @Input() public pin: Pin;
    @Output() public sendPin: EventEmitter<PinAction> = new EventEmitter();

    constructor() {}

    public open() {
      this.sendPin.emit({
        action: 'open',
        pin: this.pin
      });
    }
}
