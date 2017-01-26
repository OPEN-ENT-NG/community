import { Selectable } from 'toolkit';
import { Source } from './apps';
import http from 'axios';
import { Mix } from 'toolkit';

export class Page implements Selectable {
    application: string;
    source: Source;
    selected: boolean;

    fromJSON(data: any){
        if(data.source){
            this.source = data.source;
        }
    }
}