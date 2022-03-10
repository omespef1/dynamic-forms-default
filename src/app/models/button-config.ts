export class Buttoncnfg {
    sequence: number;
    icon: string;
    alignment: string;
    hint: string;
    text: string;
    elementAttr:{
      class : string;
    }
    constructor() {
      this.elementAttr = {
        class : 'primary-button-color'
      }
    }
}