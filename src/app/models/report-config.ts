export class ReportParams {
    Name: string;
    Datatype: string;
    Value: string;
}

export class ReportFilters {
    Id: number;
    Field: string;
    Datatype: string;
    Operator: string;
    Value: string;
    Range: number;
    Type: string;

    constructor() {
        this.Range = 0;        
    }
}

export class ReportTemptable {
    program : string;
    method: string;
    consec: string;
    fields: any[];
    
    constructor() {
        this.fields = [];
        this.consec = 'PRC_CONT';
    }
}    

export class MultiReport {
    id : number;
    report : string;
    field : string;
    value : string;
    operator : string;
}