import { Selection, Selectable, Mix, Provider } from 'toolkit';
import { Rights, Shareable, model } from 'entcore';
import { Page } from './page';

import http from 'axios';

export class Website {
    _id: string;
    pages: Page[];

    async save() {
        let response = await http.put('/community/pages/' + this._id, this);
    }

    toJSON() {
        return {
            pages: this.pages
        }
    }
}

interface Service {
    name: string;
    title: string;
    workflow: string;
    mandatory: boolean;
    active: boolean;
    created: boolean;
}

let services = [
    { name: 'home', title: 'Accueil', mandatory: true, active: true, workflow: "community.create" },
    { name: 'blog', title: 'Blog', workflow: 'blog.create' },
    { name: 'documents', title: 'Documents', workflow: 'workspace.create' },
    { name: 'wiki', title: 'Wiki', workflow: 'wiki.create' },
    { name: 'forum', title: 'Forum', workflow: 'forum.admin' }
];

export class Community implements Shareable, Selectable {
    website: Website;
    icon: string;
    description: string;
    name: string;
    services: Service[];
    id: string;
    rights: Rights<Community>;
    shared: any[];
    role: string;
    selected: boolean;
    owner: {
        userId: string,
        displayName: string
    };
    groups: {
        read: string,
        contrib: string,
        manager: string
    };
    types: string[];

    constructor() {
        this.website = new Website();
        this.rights = new Rights(this);
    }

    toJSON() {
        return {
            name: this.name,
            icon: this.icon,
            description: this.description
        };
    }

    setRights() {
        this.rights.myRights = {
            manager: this.types.indexOf('manager') !== -1,
            contrib: this.types.indexOf('contrib') !== -1,
            read: true
        };

        if (this.myRights.manager) {
            this.role = 'manager';
            return;
        }
        if (this.myRights.contrib) {
            this.role = 'contrib';
            return;
        }
        this.role = 'read';
    }

    get myRights() {
        return this.rights.myRights;
    }

    async delete() {
        await http.delete('/community/' + this.id);
    }

    async save() {
        if (this.id) {
            await this.saveModifications();
        }
        else {
            await this.create();
        }
    }

    async saveModifications() {
        await http.put('/community/' + this.id, this);
    }

    async create() {
        let response = await http.post('/community', this);

        this.groups = {
            read: response.data.read,
            contrib: response.data.contrib,
            manager: response.data.manager
        };
        this.website._id = response.data.pageId;
        response.data.owner = {
            displayName: model.me.username,
            userId: model.me.userId
        };
        Mix.extend(this, response.data);
        this.types = ['manager'];
        this.setRights();
        Library.push(this);
    }
}

export class Library {
    static all: Community[] = [];
    static provider: Provider<Community> = new Provider<Community>('/community/list', Community);
    static selection: Selection<Community> = new Selection<Community>(Library.all);

    static async communities(): Promise<Community[]> {
        let all = await this.provider.data();
        this.all.splice(0, this.all.length);
        all.forEach((c) => {
            c.setRights();
            this.all.push(c)
        });
        return this.all;
    }

    static deleteSelection() {
        this.selection.forEach((community) => {
            community.delete();
        });
        this.selection.removeSelection();
    }

    static push(community: Community) {
        this.all.push(community);
        this.provider.push(community);
    }
}