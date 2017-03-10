import { Component, Input } from '@angular/core';
import { Pin } from './pin';

@Component({
    selector: 'froala-bf-add-pin',
    templateUrl: './themes/default/froala-bf-add-pin.component.html',
    styleUrls: ['./themes/default/froala-bf-add-pin.component.css']
})
export class FroalaBfAddPinComponent {

    @Input() imageUniqueId: any;
    @Input() imageSrc: any;

    public pins: Array<Pin> = [];
    public lastOpenedPin: Pin;

    constructor() {
        console.log('Froala add pin component is ready');
    }

    /**
     * Insert new pin to the image
     *
     * @param event Click event in the image
     */
    public insertNewPinToImage(event) {
        let image = event.target;
        let position = this.calculateNewPinPosition(event);
        let newPin = this.createNewPin(position);

        this.pins.push(newPin);
        this.lastOpenedPin = newPin;
    }

    /**
     * Create a new pin
     *
     * @param position The new pin position
     * @returns {Pin} A new pin
     */
    createNewPin(position) {
        let pinId = this.generateNewPinId(position);

        let newPin = new Pin();
        newPin.uniqueId = pinId;
        newPin.imageId = this.imageUniqueId.split("-")[0];
        newPin.imageUniqueId = this.imageUniqueId;
        newPin.positionX = position.x;
        newPin.positionY = position.y;

        return newPin;
    }

    /**
     * Calculate new pin position in the image
     *
     * @param event Click event in the image
     * @returns {{x: number, y: number}} The new pin position (percent) in the image
     */
    calculateNewPinPosition(event) {
        let xCord = event.offsetX;
        let yCord = event.offsetY;
        let xPercent = xCord / event.target.width * 100;
        let yPercent = yCord / event.target.height * 100;

        return {
            'x': xPercent,
            'y': yPercent
        }
    }

    /**
     * Generate new pin Id by using position
     *
     * @param position The pin position
     * @returns {string} New pin id
     */
    generateNewPinId(position) {
          return this.imageUniqueId + '-SP-' + Math.floor(position.y) + '' + Math.floor(position.x)
    }
}
