import { ng, template, idiom, notify } from 'entcore';
import { _ } from 'entcore/libs/underscore/underscore';
import { Community, Library } from '../model/community';

export let library = ng.controller('LibraryController', [
    '$scope', 'model', 'route', '$location', ($scope, model, route, $location) => {
        $scope.template = template;
        $scope.me = model.me;
        $scope.display = {};
        $scope.filters = { search: '' };
        $scope.wizard = {};
        $scope.resultsLimit = {
            init: 10,
            limit: 10
        }

        template.open('main', 'list');
        template.open('editor/services', 'editor/services');
        template.open('editor/properties', 'editor/properties');
        template.open('editor/members', 'editor/members');

        route({
            editCommunity: function (params) {
                if ($scope.routed) {
                    return;
                }
                $scope.routed = true;
                if (model.communities.synced) {
                    $scope.routeEditCommunity(params);
                    return;
                }
                model.communities.one('sync', function () {
                    $scope.routeEditCommunity(params);
                });
            },
            list: function (params) {
                $scope.cancelToList();
            }
        });

        $scope.communities = model.communities;
        

        $scope.roleMatch = function (element) {
            return (!$scope.filters.manager || element.myRights.manager);
        };

        $scope.searchMatch = function (element) {
            return idiom.removeAccents((element.name || '').toLowerCase()).indexOf(idiom.removeAccents($scope.filters.search.toLowerCase())) !== -1;
        };

        $scope.openCommunity = function (community) {
            window.location.href = community.url();
        };

        /* Routing */
        $scope.routeEditCommunity = function (params) {
            var community = model.communities.find(function (c) { return c.pageId === params.communityId; });
            if (community !== undefined) {
                if (community.myRights.manager) {
                    $scope.editCommunity(community);
                }
                else {
                    notify.error('community.norights');
                    $scope.cancelToList();
                }
            }
            else {
                notify.error('community.notfound');
                $scope.cancelToList();
            }
        };

        /* Creation */
        $scope.createCommunity = function () {
            $scope.community = new Community();
            $scope.community.serviceHome = {};
            $scope.wizard = {};
            $scope.members = [];

            template.open('main', 'creation-wizard');
            template.open('properties', 'editor-properties');
            template.open('services', 'editor-services');
            template.open('members', 'editor-members');
        };

        $scope.saveCommunity = function () {
            $scope.community.update();
        };

        $scope.saveServices = function () {
            $scope.processServicePages(function () {
                $scope.community.website.save(function () {
                    try {
                        $scope.community.website.synchronizeRights();
                    }
                    catch (e) {
                        notify.error(idiom.translate('community.rights.notsynced'));
                        console.log("Failed to synchronize rights with services");
                        console.log(e);
                    }
                    $scope.setupMembersEditor();
                });
            });
            // TODO : Manage error
        };

        $scope.finishCreateWizard = function () {
            $scope.saveServices();
            template.open('main', 'list');
        };

        /* Edition */
        $scope.editCommunity = function (community) {
            $scope.community = community;
            $scope.community.oldname = $scope.community.name;
            $scope.setupServicesEditor(function () {
                $scope.$apply('commmunity.serviceHome');
            });
            $scope.community.getDetails(function () {
                $scope.setupMembersEditor();
            });

            template.open('main', 'editor');
        };

        $scope.saveEditCommunity = function () {
            $scope.processServicePages(function () {
			/*DEBUG*/console.log("Community: saving website");
			/*DEBUG*/console.log($scope.community.website);
                $scope.community.website.save(function () {
				/*DEBUG*/console.log("Community: saved website");
                    try {
                        $scope.community.website.synchronizeRights();
                    }
                    catch (e) {
                        notify.error(idiom.translate('community.rights.notsynced'));
                        console.log("Failed to synchronize rights with services");
                        console.log(e);
                    }
                });
            });

            $scope.community.update(function () {
                $scope.community.oldname = $scope.community.name;
            });

            $scope.communities.deselectAll();
            template.open('main', 'list');
        };

        $scope.cancelToList = function () {
            if ($scope.community && $scope.community.oldname) {
                $scope.community.name = $scope.community.oldname;
            }
            $scope.communities.deselectAll();
            template.open('main', 'list');
        };

        $scope.cancelCreation = function () {
            $scope.community.delete(function () {
                $scope.communities.sync();
            });
            $scope.cancelToList();
        };

        /*$scope.processServicePages = function (callback) {
            $scope.processor.setCallback(callback);

            _.each($scope.community.services, function (service) {
                if (service.active === true && service.created !== true) {
                    // Create the Page
                    if ($scope['createPage_' + service.name] !== undefined) {
                        try {
                            $scope['createPage_' + service.name](service);
                        }
                        catch (e) {
                            console.log("Could not created page for " + service.name);
                            console.log(e);
                            notify.error(idiom.translate('community.service.notcreated') + service.title);
                            service.active = false;
                        }
                    }
                    else {
                        // Nothing to do - cannot create the page
                        notify.error(idiom.translate('community.service.notcreated') + service.title);
                        service.active = false;
                    }
                }
                else if (service.active === true && service.created === true) {
                    // Update the page title
                    try {
                        if ($scope['updatePage_' + service.name] !== undefined) {
                            $scope['updatePage_' + service.name](service);
                        }
                        else {
                            // default : only update title
                            $scope.updatePageTitle(service);
                        }
                    }
                    catch (e) {
                        console.log("Could not update page title for " + service.name);
                        console.log(e);
                        notify.error(idiom.translate('community.service.notupdated') + service.title);
                    }
                }
                else if (service.active !== true && service.created === true) {
                    // Delete the Page
                    try {
                        $scope.deletePage(service);
                    }
                    catch (e) {
                        console.log("Could not delete page for " + service.name);
                        console.log(e);
                        notify.error(idiom.translate('community.service.notdeleted') + service.title);
                        service.active = true;
                    }
                }
            });

            $scope.processor.end();
        };*/

        $scope.deletePage = function (service) {
            // Ensure the Page is deleted - The Page must contain a 'titleLink' attr referencing the community Service 'name'
            $scope.community.website.pages.all = $scope.community.website.pages.reject(function (page) { return page.titleLink === service.name; });
            delete service.created;
        };

        /* Members */
        $scope.setupMembersEditor = async () => {
            await $scope.community.loadMembers();
            $scope.$apply();
        };

        $scope.addMember = function (user, right) {
            // Default rights : read
            user.role = right ? right : 'read';
            $scope.members.push(user);
            $scope.community.addMember(user.id, user.role);
            // TODO : Manage error
            $scope.search = { term: '', found: [] };
        };

        $scope.addAllGroupMembers = async (group, role)  =>{
            await $scope.community.addGroupMembers(group, role);
            $scope.$apply();
        };

        $scope.setMemberRole = function (member) {
            $scope.community.setMemberRole(member.id, member.role);
            // TODO : Manage error
        };

        $scope.removeMember = function (member) {
            $scope.members = _.reject($scope.members, function (m) { return m.id === member.id });
            $scope.community.removeMember(member.id);
            delete member.role;
            // TODO : Manage error
        };

        $scope.findUserOrGroup = function () {
            $scope.resultsLimit.limit = $scope.resultsLimit.init;
            var searchTerm = idiom.removeAccents($scope.search.term).toLowerCase();
            $scope.search.found = _.union(
                _.filter($scope.visibles.groups, function (group) {
                    if ($scope.community.groups.read === group.id || $scope.community.groups.contrib === group.id || $scope.community.groups.manager === group.id) {
                        return false;
                    }
                    var testName = idiom.removeAccents(group.name).toLowerCase();
                    return testName.indexOf(searchTerm) !== -1;
                }),
                _.filter($scope.visibles.users, function (user) {
                    var testName = idiom.removeAccents(user.lastName + ' ' + user.firstName).toLowerCase();
                    var testNameReversed = idiom.removeAccents(user.firstName + ' ' + user.lastName).toLowerCase();
                    return testName.indexOf(searchTerm) !== -1 || testNameReversed.indexOf(searchTerm) !== -1;
                })
            );
            $scope.search.found = _.filter($scope.search.found, function (element) {
                return _.find($scope.members, function (member) { return member.id === element.id; }) === undefined;
            });
        };


        $scope.removeCommunities = function () {
            $scope.display.confirmDelete = true;
        }

        $scope.cancelRemoveCommunity = function () {
            $scope.display.confirmDelete = undefined;
        };

        $scope.doRemoveCommunities = async () => {
            await Library.deleteSelection();
            $scope.$apply();
        }
    }]);
