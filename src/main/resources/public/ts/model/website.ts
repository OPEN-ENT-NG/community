import { Page } from './page';
import { Community } from './community';
import { Mix } from 'toolkit';
import { Behaviours, sniplets, Rights, Shareable } from 'entcore';
import { _ } from 'entcore/libs/underscore/underscore';

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

    constructor(community: Community){
        this.community = community;
        this._id = community.pageId;
    }

    get myRights(){
        return {
            manager: this.community.types.indexOf('manager') !== -1,
            contrib: this.community.types.indexOf('contrib') !== -1,
            read: true,
        }
    }

    async save() {
        let response = await http.put('/community/pages/' + this._id, this);
    }

    toJSON() {
        return {
            pages: this.pages
        }
    }

    async open(): Promise<void>{
        let response = await http.get('/community/pages/' + this._id);
        Mix.extend(this, response.data);
    }

    async synchronizeRights(){
        await sniplets.load();

        let referencedResources: any;
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
            Behaviours.copyRights({
                provider: {
                    application: 'community/pages',
                    resource: this
                },
                target: {
                    application: application,
                    resources: referencedResources[application]
                }
            });
        }
    }
}