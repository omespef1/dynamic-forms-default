export class Menu {
    id: number;
    name: string;
    text: string;
    groups: MenuGroup[];

    constructor() {
        this.groups = [];
    }
}
export class MenuGroup {
    id: number;
    name: string;
    text: string;
    items: MenuGroupItem[];

    constructor() {
        this.items = [];
    }
}

export class MenuGroupItem {
    id: number;
    name: 'save' | 'delete' | 'back' | 'new' | 'edit' | 'apply' | 'revert' | 'annul' | 'search' | 'report' | 'count' | 'sum' | 'audit' | 'funcs' | 'process' | 'mcont' | 'method' | 'translate' | 'attach' | 'defval';
    text: string;
    tooltip: string;
    icon: string;
    shortcut: string;
}

export class MenuItem {
    id: string;
    text: string
}
