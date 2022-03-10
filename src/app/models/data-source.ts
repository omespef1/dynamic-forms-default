import { DataSourceType } from '../enums/data-source-type.enum';

export class DataSource {
    dataField: string;
    dataSourceType: DataSourceType;
    fixedList: any[];
    query: string;
    valueMember: string;
    valueShow: string;
    dataSourceObject: string;
    urlService: string;
    params: string;
    columns: string;
    connectionId: number;
    constructor() {
        this.fixedList = [];
        this.dataSourceType = DataSourceType.Fixed;
    }
}
