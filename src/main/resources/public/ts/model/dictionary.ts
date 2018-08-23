import { Community } from './community';
import { idiom } from 'entcore';
import { _ } from 'entcore';

export interface User {
    id: string;
    displayName: string;
    username: string;
    lastName: string;
    firstName: string;
    roles: {};
    isUser: boolean;
}

export interface Group {
    id: string;
    isGroup: boolean;
    name: string;
}

export interface Bookmark {
    id: string;
    isBookmark: boolean;
    name: string;
}

export class Dictionary {
    static find(word: string, community: Community) {
        let found = _.union(
            community.members.visibles.groups.filter((group) => {
                if (community.groups.read === group.id ||
                    community.groups.contrib === group.id ||
                    community.groups.manager === group.id
                ) {
                    return false;
                }
                let testName = idiom.removeAccents(group.name).toLowerCase();
                return testName.indexOf(word) !== -1;
            }),
            community.members.visibles.users.filter((user) => {
                let testName = idiom.removeAccents(user.lastName + ' ' + user.firstName).toLowerCase();
                let testNameReversed = idiom.removeAccents(user.firstName + ' ' + user.lastName).toLowerCase();
                return testName.indexOf(word) !== -1 || testNameReversed.indexOf(word) !== -1;
            }),
            community.members.visibles.bookmarks.filter((bookmark) => {
                let testName = idiom.removeAccents(bookmark.name).toLowerCase();
                return testName.indexOf(word) !== -1;
            })
        );

        return found.filter((element) => {
            return community.membersList.find(
                (member) => member.id === element.id
            ) === undefined;
        });
    }
}