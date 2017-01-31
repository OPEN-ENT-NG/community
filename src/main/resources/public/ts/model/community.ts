import { Selection, Selectable, Mix, Provider } from 'toolkit';
import { Rights, Shareable, model } from 'entcore';
import { Page } from './page';
import { Website } from './website';
import { User, Group } from './dictionary';
import { _ } from 'entcore/libs/underscore/underscore';

import http from 'axios';

export interface Service {
    name: string;
    workflow: string;
    mandatory?: boolean;
    active?: boolean;
    created?: boolean;
    content?: string;
}

let services = () => [
    { name: 'home', mandatory: true, active: true, workflow: "community.create" },
    { name: 'blog', workflow: 'blog.create' },
    { name: 'documents', workflow: 'workspace.create' },
    { name: 'wiki', workflow: 'wiki.create' },
    { name: 'forum', workflow: 'forum.admin' }
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
    members: {
        read?: User[],
        contrib?: User[],
        manager?: User[],
        visibles?: { users: User[], groups: Group[] }
    };
    membersDiff: {
        read: string[],
        contrib: string[],
        manager: string[],
        delete: string[]
    };
    types: string[];
    pageId: string;
    membersList: User[]

    constructor() {
        this.website = new Website(this);
        this.rights = new Rights(this);
        this.services = services();
        this.membersDiff = {
            read: [],
            contrib: [],
            manager: [],
            delete: []
        };
        this.members = {};
    }

    async fromJSON(data: any) {
        this.website = Mix.castAs(Website, data.website, this);
        await this.website.open();
        this.services.forEach((s) => s.active =
            this.website.pages.find((p) => p.titleLink === s.name) !== undefined
        );
    }

    toJSON() {
        return {
            name: this.name || '',
            icon: this.icon || '',
            description: this.description || ''
        };
    }

    removeMember(id: string) {
        this.membersDiff.delete.push(id);
        let index = this.membersList.findIndex((u) => u.id === id);
        this.membersList.splice(index, 1);
    }

    private async loadVisibles() {
        let response = await http.get('/community/visibles');
        this.members = {
            read: [],
            contrib: [],
            manager: [],
            visibles: response.data
        };

        this.members.visibles.users.forEach((u) => u.displayName = u.username);
        this.members.visibles.groups.forEach((g) => g.isGroup = true);

        this.membersList = [];
        this.groups = {
            read: '',
            contrib: '',
            manager: ''
        };
    }

    async loadMembers() {
        if (!this.id) {
            await this.loadVisibles();
            return;
        }
	    let response = await http.get('/community/' + this.id + '/users');
        let members = response.data;
        for (let property in members) {
            if (members[property] instanceof Array) {
                this.members[property] = members[property].filter((u) => u.id !== model.me.userId);
                this.members[property].forEach((m) => m.role = property);
            }
            else {
                this.members[property] = members[property];
            }
        }

        this.members.visibles.users.forEach((u) => u.displayName = u.username);
        this.members.visibles.groups.forEach((g) => g.isGroup = true);

        this.membersList = this.members.manager.concat(this.members.contrib).concat(this.members.read);
        await this.loadGroupsInfos();
    }

    private async loadGroupsInfos(){
        let response = await http.get('/community/' + this.id + '/details');
        this.groups = {
            read: _.findWhere(response.data.groups, { type: 'read' }).id,
            contrib: _.findWhere(response.data.groups, { type: 'contrib' }).id,
            manager: _.findWhere(response.data.groups, { type: 'manager' }).id
        }
    }

    addUsersToRole(users: User[], role: string){
        if(!this.membersDiff.delete){
            this.membersDiff.delete = [];
        }
        if(!this.membersDiff[role]){
            this.membersDiff[role] = [];
        }

        this.membersDiff.delete = this.membersDiff.delete.concat(
            users.filter(
                (u) => this.membersDiff.delete.indexOf(u.id)
            )
            .map((u) => u.id)
        );
        this.membersDiff[role] = this.membersDiff[role].concat(
            users.filter(
                (u) => this.membersDiff[role].indexOf(u.id)
            )
            .map((u) => u.id)
        );
    }

    addMember(user: User, role: string) {
        this.membersList.push(user);
        this.addUsersToRole([user], role);
    }

    async addGroupMembers(group, role){
        let response = await http.get('/userbook/visible/users/' + group.id);
        let users = response.data;
        let addingUsers = [];
        users.forEach((user) => {
            if (model.me.userId === user.id || this.membersList.find((member) => member.id === user.id)) {
                return;
            }

            user.role = role;
            addingUsers.push(user.id);
            this.membersList.push(user);
        });
        await this.addUsersToRole(addingUsers, role);
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
        await this.website.applyServices();
        await this.saveMembers();
    }

    private async saveMembers(){
        let response = await http.put('/community/' + this.id + '/users', this.membersDiff);

	    await this.website.open();
		await this.website.synchronizeRights();
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

    get serviceHome(): Service{
        return _.find(this.services, (s) => { return s.name === 'home'; });
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
        this.selection.selected.forEach((community) => {
            community.delete();
            this.provider.remove(community);
        });
        this.selection.removeSelection();
    }

    static push(community: Community) {
        this.all.push(community);
        this.provider.push(community);
    }
}