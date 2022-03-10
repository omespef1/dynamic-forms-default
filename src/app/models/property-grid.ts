import { ColumnGrid } from './column';

export class PropertyGrid {
    alignment: string;
    allowEditing: boolean;
    allowGrouping: boolean;
    allowHeaderFiltering: boolean;
    allowHiding: boolean;
    allowReordering: boolean;
    allowResizing: boolean;
    allowSearch: boolean;
    allowSorting: boolean;
    caption: string;
    dataField: string;
    format: string;
    dataType: string;
    lookup: Lookup;
    visible: boolean;
    width: number;
    name: string;
    showInColumnChooser: boolean;
    iskey: boolean;
    columnGridGroup: ColumnGrid[];
    editorOptions: {
        type?: string;
        format?: string;
    };


    constructor() {
        this.alignment = 'undefined';
        this.visible = true;
        this.width = 250;
        this.lookup = new Lookup();
        this.allowEditing = false;
        this.allowGrouping = true;
        this.allowHeaderFiltering = true;
        this.allowHiding = true;
        this.allowReordering = true;
        this.allowResizing = true;
        this.allowSearch = true;
        this.allowSorting = true;
        this.showInColumnChooser = false;
        this.columnGridGroup = [];
        this.editorOptions = {
            type: ''
        };
    }
}

class Lookup {
    dataSource: any[];
    displayExpr: string;
    valueExpr: string;

    constructor() {
        this.dataSource = [];
        this.displayExpr = 'text';
        this.valueExpr = 'id';
    }

}
