export class Translator {
    public Id: number;
    public TranslatorCode: string;
    public TranslatorDesc: string;
    public TranslatorBase: string;
    public TranslatorBody: string;
    constructor(){
        this.TranslatorBase = 'N';
    }
}

export class TranslatorDef {
    original: string;
    translated: string;
}