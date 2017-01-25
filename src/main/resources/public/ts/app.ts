import { model, routes, ng } from 'entcore/entcore';
import { library } from './controllers/library';

ng.controllers.push(library);

routes.define(function ($routeProvider) {
    $routeProvider
        .when('/list', {
            action: 'list'
        })
        .when('/edit/:communityId', {
            action: 'editCommunity'
        })
        .otherwise({
            redirectTo: '/list'
        });
});