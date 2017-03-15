import { AbstractControl, Validators, ValidatorFn } from '@angular/forms';
import {isPresent} from '@angular/forms/src/facade/lang';

export const tagsValidator: ValidatorFn = (control: AbstractControl): {[key: string]: boolean} => {
    if (isPresent(Validators.required(control))) return null;
    const v: string = control.value;
    const tags: Array<string> = v.split(' ')
    let check: boolean = tags.length>10?false:true;
    tags.forEach(tag=>check=tag.length>45?false:check);
    return check ? null : {'tags': true};
};
