export class BaseDocConfg {
    program : string;
    field : string;
    basefield : string;
    projectBaseId : number;
    projectDetailId : number;
    origins : any[];
    
    constructor() {
        this.origins = [];
        this.projectBaseId = 0;
        this.projectDetailId = 0;
        this.basefield = '0';
        
    }    
}