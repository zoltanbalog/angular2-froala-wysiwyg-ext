import {Component, Input, OnInit, EventEmitter, Output, OnChanges, SimpleChanges, ElementRef} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { urlValidator } from '../../validators/ulr';
import { tagsValidator } from '../../validators/tags';
import { Pin } from '../../interfaces/pin';
import { PinAction } from '../../interfaces/pin-action';

@Component({
  selector: 'froala-bf-pin',
  templateUrl: '../../themes/default/tooltip.component.html',
  styleUrls: ['../../themes/default/tooltip.component.css']
})
export class TooltipComponent implements OnInit, OnChanges{

    public tooltipDirection: string = 'top';
    public form: FormGroup;

    @Input() public pin: Pin;
    @Input() public isNew: boolean;
    @Output() public sendPin: EventEmitter<PinAction> = new EventEmitter();

    constructor(private formBuilder: FormBuilder, private elementRef: ElementRef) {
        this.form = this.formBuilder.group({
            'product': ['', Validators.compose([Validators.required,Validators.maxLength(30)])],
            'store': ['', Validators.maxLength(25)],
            'tags': ['', tagsValidator],
            'link': ['', urlValidator]
        });
        this.form.controls['tags'].valueChanges.subscribe(tags=>{
            const newTags = tags.split(' ').filter(tag=>!!tag).map(tag=>tag[0]!='#'?'#'+tag:tag).join(' ');
            if(newTags.trim()!==tags.trim()){
                this.form.controls['tags'].setValue(newTags);
            }
        }

        );
    }

    public ngOnInit() {
    }

    public ngOnChanges(changes: SimpleChanges){
        if(changes.pin) {
            let {product, store, tags, link} = changes.pin.currentValue;
            this.form.markAsUntouched();
            this.form.setValue({product, store, tags, link});
            setTimeout( ()=> this.calculatePinTooltipDirection(changes.pin.currentValue), 10)
        }
    }

    public send(action: string) {
        this.sendPin.emit({
            action,
            pin: {...this.pin, ...this.form.value}
        });
    }

    public save() {
        this.send('save');
    }

    public delete() {
        this.send('delete');
    }

    public close() {
        this.send('close');
    }

    /**
     * Calculate pin tooltip window direction
     */
    calculatePinTooltipDirection(pin: Pin) {
        let targetElement = this.elementRef.nativeElement.querySelector('.cd-more-info');
        let imageElement = targetElement;
        while(imageElement.className.indexOf('pin-list')) {
            imageElement = imageElement.offsetParent;
        }
        imageElement = imageElement.querySelector('img')
        this.tooltipDirection = 'top';
        if((pin.positionY*imageElement.offsetHeight/100)<targetElement.offsetHeight){
            this.tooltipDirection = 'bottom';
        }
        if((pin.positionX*imageElement.offsetWidth/100)<targetElement.offsetWidth){
            this.tooltipDirection = 'right';
        }
        if((imageElement.offsetWidth-pin.positionX*imageElement.offsetWidth/100)<targetElement.offsetWidth){
            this.tooltipDirection = 'left';
        }
    }
}
