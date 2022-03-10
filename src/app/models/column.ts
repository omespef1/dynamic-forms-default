import { ForeignKey } from '.';

export class Column {
    IsKey: boolean;
    IsIdentity: boolean;
    Name: string;
    AllowNull: boolean;
    DataType: string;
    MaxLength: number;
    Scale: number;
    Precision: number;
    ForeignKeys: ForeignKey[];
    TableName: string;
    Id: number;
    ParentId: number;
}

export class ColumnGrid {
    DataField: string;
    Name: string;
    TableName: string;
    Id: number;
    ParentId: number;
    IsKey: boolean;
}
