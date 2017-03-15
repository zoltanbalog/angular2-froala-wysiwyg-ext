import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { Pin } from '../../interfaces/pin';
import { PinAction } from '../../interfaces/pin-action';

@Component({
    selector: 'froala-bf-add-pin',
    templateUrl: '../../themes/default/action.component.html',
    styleUrls: ['../../themes/default/action.component.css']
})
export class ActionComponent implements OnInit{

    @Input() public imageUniqueId: any;
    @Input() public imageSrc: any;
    @Input() public pins: Pin[] = [];
    @Output() public pinList: EventEmitter<Array<Pin>> = new EventEmitter();

    public lastOpenedPin: Pin;
    public lastPinIsNew: boolean = true;

    constructor() {}
    public ngOnInit(){}

    /**
     * Insert new pin to the image
     *
     * @param event Click event in the image
     */
    public insertNewPinToImage(event) {
        let image = event.target;
        let position = this.calculateNewPinPosition(event);
        let newPin = this.createNewPin(position);
        this.lastPinIsNew = true;
        this.lastOpenedPin = newPin;
    }

    /**
     * Create a new pin
     *
     * @param position The new pin position
     * @returns {Pin} A new pin
     */
    public createNewPin(position):Pin {
        let pinId = this.generateNewPinId(position);

        let newPin: Pin = {
            uniqueId: pinId,
            imageId: this.imageUniqueId.split('-')[0],
            imageUniqueId: this.imageUniqueId,
            positionX: position.x,
            positionY: position.y,
            product: '',
            store: '',
            tags: '',
            link: ''
        };
        return newPin;
    }

    /**
     * Calculate new pin position in the image
     *
     * @param event Click event in the image
     * @returns {{x: number, y: number}} The new pin position (percent) in the image
     */
    public calculateNewPinPosition(event) {
        let xCord = event.offsetX;
        let yCord = event.offsetY;
        let xPercent = xCord / event.target.width * 100;
        let yPercent = yCord / event.target.height * 100;

        return {
            x: xPercent,
            y: yPercent
        };
    }

    /**
     * Generate new pin Id by using position
     *
     * @param position The pin position
     * @returns {string} New pin id
     */
    public generateNewPinId(position) {
          return this.imageUniqueId + '-SP-' + Math.floor(position.y) + '' + Math.floor(position.x);
    }

    public action(pinAction: PinAction) {
        switch (pinAction.action){
            case 'save':
                this.pins = this.pins.filter(pin=>pin.uniqueId!==pinAction.pin.uniqueId).concat([{...pinAction.pin}])
                this.pinList.emit(this.pins);
                this.lastOpenedPin = null;
                break;
            case 'delete':
                this.pins = this.pins.filter(pin=>pin.uniqueId!==pinAction.pin.uniqueId);
                this.lastOpenedPin = null;
                break;
            case 'open':
                this.lastPinIsNew = false;
                this.lastOpenedPin = pinAction.pin;
                break;
            default:
                this.lastOpenedPin = null;
        }
    }
}
