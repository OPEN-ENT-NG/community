import { model, routes, ng, idiom } from 'entcore/entcore';
import { library } from './controllers/library';
import { main } from './controllers/main';
import { edit } from './controllers/edit';

ng.controllers.push(library);
ng.controllers.push(main);
ng.controllers.push(edit);

routes.define(function ($routeProvider) {
    $routeProvider
        .when('/list', {
            action: 'list'
        })
        .when('/edit/:id', {
            action: 'edit'
        })
        .when('/view/:id/:titleLink', {
            action: 'viewPage'
        })
        .when('/view/:id', {
            action: 'view'
        })
        .otherwise({
            redirectTo: '/list'
        });
});

model.build = () => {
    model.me.workflow.load(['blog', 'forum', 'wiki']);
    idiom.addBundle('blog/i18n');
    idiom.addBundle('forum/i18n');
    idiom.addBundle('wiki/i18n');
};