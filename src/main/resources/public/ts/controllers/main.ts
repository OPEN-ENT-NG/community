import { ng, template } from 'entcore';
import { Library } from '../model/community';

export let main = ng.controller('MainController', ['$scope', '$location', 'model', 'route',
    function ($scope, $location, model, route) {
        $scope.display = {};
        $scope.filters = { search: '' };
        $scope.membersEditor = {
            search: '',
            found: [],
            limit: 10,
            init: 10
        };

        let openCommunity = async (id: string, titleLink: string = 'home') => {
            template.open('main', 'viewer');
            let communities = await Library.communities();
            $scope.communities = communities;
            $scope.community = communities.find((c) => c.id === id);
            await $scope.community.website.open();
            $scope.snipletResource = $scope.community.website;
            $scope.page = $scope.community.website.pages.find((p) => p.titleLink === titleLink);
        };

        route({
            edit: async (params) => {
                template.open('main', 'editor');
                let communities = await Library.communities();
                $scope.community = communities.find((c) => c.id === params.id);
                await $scope.community.loadMembers();
                $scope.$apply();
            },
            view: async (params) => {
                await openCommunity(params.id);
                $scope.$apply();
            },
            viewPage: async (params) => {
                await openCommunity(params.id, params.titleLink);
                $scope.$apply();
            },
            list: (params) => {
                Library.selection.deselectAll();
                template.open('main', 'library');
            }
        });

        $scope.redirectTo = (path) => {
            $location.path(path);
        };
    }
])