import { Page } from './page';
import { Community, Service } from './community';
import { Mix } from 'entcore-toolkit';
import { Behaviours, sniplets, Rights, Shareable, idiom, cleanJSON } from 'entcore';
import { _ } from 'entcore';
import { AppGenerator } from './apps';

import http from 'axios';

export class Website implements Shareable {
    _id: string;
    pages: Page[];
    community: Community;
    shared: any[];
    owner: {
        userId: string;
        displayName: string;
    };
    rights: Rights<Website>;

    constructor(community: Community){
        this.community = community;
        this._id = community.pageId;
        this.pages = [];
        this.rights = new Rights<Website>(this);
    }

    get myRights(){
        return this.rights.myRights;
    }

    async save() {
        let response = await http.put('/community/pages/' + this._id, this);
    }

    toJSON() {
        return {
            pages: cleanJSON(this.pages)
        }
    }

    fromJSON(data: any) {
        this.rights.fromBehaviours();
    }

    async open(): Promise<void>{
        if(this.pages.length){
            return;
        }
        let response = await http.get('/community/pages/' + this._id);
        Mix.extend(this, response.data);
        this.pages = Mix.castArrayAs(Page, _.map(response.data.pages, el => el));
    }

    async synchronizeRights(){
        await sniplets.load();

        let referencedResources: any = {};
        for(let page of this.pages){
            let source = page.source;
            if (!referencedResources[source.application]) {
                referencedResources[source.application] = [];
            }
            var sniplet = _.findWhere(sniplets.sniplets, { application: source.application, template: source.template });
            if (sniplet && typeof sniplet.sniplet.controller.getReferencedResources === 'function' && source.source) {
                referencedResources[source.application] = referencedResources[source.application].concat(
                    sniplet.sniplet.controller.getReferencedResources(source.source)
                );
            }
        }

        for (let application in referencedResources) {
            await Behaviours.copyRights({
                provider: {
                    application: 'community',
                    resource: this
                },
                target: {
                    application: application,
                    resources: referencedResources[application]
                }
            });
        }
    }

    async applyServices() {
        for (let service of this.community.services) {
            if (service.active) {
                let index = this.pages.findIndex((p) => p.titleLink === service.name);
                if (index === -1) {
                    let page = new Page();
                    page.source = await AppGenerator.generate(service, this.community);
                    page.titleLink = service.name;
                    page.title = idiom.translate(service.name);
                    this.pages.push(page);
                }
            }
            else {
                let index = this.pages.findIndex((p) => p.titleLink === service.name);
                if (index !== -1) {
                    this.pages.splice(index, 1);
                }
            }
        }
        await this.save();
    }
}