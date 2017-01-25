import { Selectable } from 'toolkit';
import { Source } from './apps';

export class Page implements Selectable {
    application: string;
    source: Source;
    selected: boolean;
}