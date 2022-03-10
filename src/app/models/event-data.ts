import { EventActionType } from '../enums/event-action-type.enum';
import { Connection } from './connection';

export class EventProperty {
    dataField: string;
    eventName: string;
    actions: EventAction[];
    /**
     *
     */
    constructor() {
        this.actions = [];
    }
}

export class EventAction {
    type: EventActionType;
    sequence: number;
    config: any;
}

export class HideField {
    description: string;
    hideFields: string[];
    operator: string;
    value: string;
    visible: boolean;
    /**
     *
     */
    constructor() {
        this.visible = true;
    }
}

export class RuleAction {
    ruleCode: string;
    description: string;
    setValueField: string;
    parameters: any[];
}

export class RestForm {
    description: string;
    method: number;
    url: string;
    params: any[];
    messages: any[];
    responseMessage: string;
    redirect: number;

    constructor() {
        this.method = 1;
        this.params = [];
        this.messages = [];
        this.redirect = 1;
    }
}

export class OtherField {
    description: string;
    field: string;
    type: number;
    valuefunc: string;
    varsfunc: any[];
    parInmethod: any[];
    parOutmethod: any[];
    constructor() {
        this.valuefunc = '';
        this.varsfunc = [];
        this.parInmethod = [];
        this.parOutmethod = [];
    }
}

export class QueryForm {
    description: string;
    connection: Connection;
    script: string;
    params: any[];

    constructor() {
        this.params = [];
    }
}