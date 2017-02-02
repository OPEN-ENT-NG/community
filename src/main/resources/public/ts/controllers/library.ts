import { ng, template, idiom, notify } from 'entcore';
import { _ } from 'entcore/libs/underscore/underscore';
import { Community, Library } from '../model/community';
import { Dictionary } from '../model/dictionary';

export let library = ng.controller('LibraryController', [
    '$scope', 'model', '$location', ($scope, model, $location) => {
        $scope.template = template;
        $scope.me = model.me;

        template.open('library/list', 'library/list');
        template.open('library/wizard', 'library/wizard');
        template.open('library/toaster', 'library/toaster');
        
        $scope.communities = Library.all;
        $scope.selection = Library.selection;
        Library.communities().then(() => {
            $scope.$apply();
        });
        

        $scope.roleMatch = (element) => {
            return (!$scope.filters.manager || element.myRights.manager);
        };

        $scope.searchMatch = (element) => {
            return idiom.removeAccents((element.name || '').toLowerCase()).indexOf(idiom.removeAccents($scope.filters.search.toLowerCase())) !== -1;
        };
        
        $scope.createCommunity = () => {
            $scope.community = new Community();
            $scope.community.loadMembers();
            $scope.display.wizard = true;
        };

        $scope.finishCreateWizard = async () => {
            $scope.display.wizard = false;
            await $scope.community.save();
            $location.path('/view/' + $scope.community.id);
            $scope.membersEditor.found = [];
            $scope.$apply();
        };

        $scope.removeCommunities = async () => {
            $scope.display.confirmDelete = false;
            await Library.deleteSelection();
            $scope.$apply();
        }
    }]);
