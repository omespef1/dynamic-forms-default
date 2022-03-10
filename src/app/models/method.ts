export class Method {
    public Id: number;
    public MethodCode: string;
    public MethodDesc: string;
    public MethodBody: string;
}

export class MethodDef {
    code: string;
    description: string;
    program: string;
    method:string;
    paramsIn: any[];
    paramsOut: any[];
    constructor() {
        this.paramsIn = [];
        this.paramsOut = [];
    }
}