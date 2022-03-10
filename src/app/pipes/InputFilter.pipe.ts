import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'InputFilter'
})

export class InputFilter implements PipeTransform {
    public transform(value, keys: string, term: string) {
        if (!term) {
            return value;
        }
        const array = (value || []).filter((item: any) => keys.split(',').some(key => item.hasOwnProperty(key)
            && new RegExp(term, 'gi').test(item[key])));
        return array;

    }
}
