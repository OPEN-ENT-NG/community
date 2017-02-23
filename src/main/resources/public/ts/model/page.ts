import { Selectable } from 'toolkit';
import { Source } from './apps';
import http from 'axios';
import { Mix } from 'toolkit';
import { services } from './community';

interface Cell {
    media: {
        type: string,
        source: {
            template: string,
            source: any,
            application: string
        }
    };
}

interface Row {
    cells: Cell[];
}

export class Page implements Selectable {
    application: string;
    source: Source;
    selected: boolean;
    titleLink: string;
    rows: Row[];
    title: string;

    fromJSON(data: any){
        if(data.source){
            this.source = data.source;
        }
        else {
            this.rows.forEach((r) => {
                r.cells.forEach((c) => {
                    let service = services().find((s) => s.template === c.media.source.template);
                    if (c.media.type === 'sniplet' && service && service.name === this.titleLink) {
                        this.source = c.media.source;
                    }
                });
            });
        }
    }
}