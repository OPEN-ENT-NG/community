import { Behaviours, idiom } from 'entcore';
import { Community } from './community';

export interface Source {

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
};

AppGenerator.register({
    prefix: 'blog',
    generator: async(community: Community): Promise<Source> => {
        Behaviours.applicationsBehaviours.blog.model.register();
        var blog = new Behaviours.applicationsBehaviours.blog.model.Blog();
        blog.title = idiom.translate('community.services.blog.pretitle') + community.name;
        blog.thumbnail = community.icon || '';
        blog['comment-type'] = 'IMMEDIATE';
        blog.description = community.description || '';

        return new Promise((resolve, reject) => {
            try {
                blog.save(function () {
                    var post = {
                        state: 'SUBMITTED',
                        title: idiom.translate('community.services.blog.firstpost.title'),
                        content: idiom.translate('community.services.blog.firstpost.content')
                    };
                    blog.posts.addDraft(post, function (post) {
                        post.publish(function () {
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
                reject();
            }
        });
    }
});

AppGenerator.register({
    prefix: 'wiki',
    generator: async (community: Community): Promise<Source> => {
        var wiki = new Behaviours.applicationsBehaviours.wiki.namespace.Wiki();
        var data = { title: idiomService.translate('community.services.wiki.pretitle') + $scope.community.name };

        try {
            wiki.createWiki(data, function (createdWiki) {
                // Create a default homepage
                var wikiPage = {
                    isIndex: true,
                    title: idiomService.translate('community.services.wiki.homepage.title'),
                    content: idiomService.translate('community.services.wiki.homepage.content')
                };

                wiki.createPage(wikiPage, function (createdPage) {
                    wikiCell.media.source = {
                        template: 'wiki',
                        application: 'wiki',
                        source: { _id: createdWiki._id }
                    };
                    row1.addCell(wikiCell);
					/*DEBUG*/console.log("Community: successfuly created wiki");
                    website.pages.push(page);
                    processor.done(); // create wiki
                });
            });
        }
        catch (e) {
            console.log("Failed to create Wiki for service wiki");
            console.log(e);
            service.active = false;
            processor.done();
        }
});

AppGenerator.register({
    prefix: 'forum',
    generator: async (community: Community): Promise<Source> => {
        var category = new Behaviours.applicationsBehaviours.forum.namespace.Category();
        var templateData = {
            categoryName: idiom.translate("community.services.forum.category.title").replace(/\{0\}/g, $scope.community.name),
            firstSubject: idiom.translate("community.services.forum.subject.title"),
            firstMessage: idiom.translate("community.services.forum.first.message").replace(/\{0\}/g, $scope.community.name)
        };

        try {
            category.createTemplatedCategory(templateData, function () {
                forumCell.media.source = {
                    template: 'forum',
                    application: 'forum',
                    source: { _id: category._id }
                };
                row1.addCell(forumCell);
				/*DEBUG*/console.log("Community: successfuly created forum");
                website.pages.push(page);
                processor.done(); // create forum
            });
        }
        catch (e) {
            console.log("Failed to create Forum for service forum");
            console.log(e);
            service.active = false;
            processor.done();
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