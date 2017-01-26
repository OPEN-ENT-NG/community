import { Behaviours, idiom } from 'entcore';
import { Community } from './community';

export interface Source {
    template: string;
    application: string;
    source: any;
}

export interface App {
    prefix: string;
    generator: (community: Community) => Promise<Source>;
}

export class AppGenerator {
    static generators: (App)[] = [];

    static register(app: App) {
        this.generators.push(app);
    }
}

AppGenerator.register({
    prefix: 'blog',
    generator: async(community: Community): Promise<Source> => {
        Behaviours.applicationsBehaviours.blog.model.register();
        var blog = new Behaviours.applicationsBehaviours.blog.model.Blog();
        blog.title = idiom.translate('community.services.blog.pretitle') + community.name;
        blog.thumbnail = community.icon || '';
        blog['comment-type'] = 'IMMEDIATE';
        blog.description = community.description || '';

        return new Promise<Source>((resolve, reject) => {
            try {
                blog.save(() => {
                    let post = {
                        state: 'SUBMITTED',
                        title: idiom.translate('community.services.blog.firstpost.title'),
                        content: idiom.translate('community.services.blog.firstpost.content')
                    };
                    blog.posts.addDraft(post, (post) => {
                        post.publish(() => {
                            resolve({
                                template: 'articles',
                                application: 'blog',
                                source: { _id: blog._id }
                            });
						    console.log("Community: successfuly created blog");
                        });
                    });
                });
            }
            catch (e) {
                console.log("Failed to create Blog for service blog");
                reject(undefined);
            }
        });
    }
});

AppGenerator.register({
    prefix: 'wiki',
    generator: async (community: Community): Promise<Source> => {
        var wiki = new Behaviours.applicationsBehaviours.wiki.namespace.Wiki();
        var data = { title: idiom.translate('community.services.wiki.pretitle') + community.name };

        return new Promise<Source>((resolve, reject) => {
            try {
                wiki.createWiki(data, (createdWiki) => {
                    var wikiPage = {
                        isIndex: true,
                        title: idiom.translate('community.services.wiki.homepage.title'),
                        content: idiom.translate('community.services.wiki.homepage.content')
                    };

                    wiki.createPage(wikiPage, function (createdPage) {
                        resolve({
                            template: 'wiki',
                            application: 'wiki',
                            source: { _id: createdWiki._id }
                        });
                        console.log("Community: successfuly created wiki");
                    });
                });
            }
            catch (e) {
                console.log("Failed to create Wiki for service wiki");
                console.log(e);
                reject();
            }
        });
    }
});

AppGenerator.register({
    prefix: 'forum',
    generator: async (community: Community): Promise<Source> => {
        var category = new Behaviours.applicationsBehaviours.forum.namespace.Category();
        var templateData = {
            categoryName: idiom.translate("community.services.forum.category.title").replace(/\{0\}/g, community.name),
            firstSubject: idiom.translate("community.services.forum.subject.title"),
            firstMessage: idiom.translate("community.services.forum.first.message").replace(/\{0\}/g, community.name)
        };

        return new Promise<Source>((resolve, reject) => {
            try {
                category.createTemplatedCategory(templateData, function () {
                    console.log("Community: successfuly created forum");
                    resolve({
                        template: 'forum',
                        application: 'forum',
                        source: { _id: category._id }
                    });
                });
            }
            catch (e) {
                console.log("Failed to create Forum for service forum");
                console.log(e);
                reject();
            }
        });
    }
});

AppGenerator.register({
    prefix: 'documents',
    generator: async (community: Community): Promise<Source> => {
        return {
            application: 'workspace',
            template: 'documents',
            source: { documents: [] }
        };
    }
});

AppGenerator.register({
    prefix: 'home',
    generator: async (community: Community): Promise<Source> => {
        return {
            application: 'community',
            template: 'message',
            source: {
                content: community.serviceHome.content
            }
        }
    }
});