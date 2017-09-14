import { ng, template, idiom } from 'entcore';
import { Dictionary } from '../model/dictionary';

export let edit = ng.controller('EditController', [
    '$scope', 'model','$location', ($scope, model, $location) => {
        template.open('editor/services', 'editor/services');
        template.open('editor/properties', 'editor/properties');
        template.open('editor/members', 'editor/members');

        $scope.addMember = function (user, right) {
            user.role = right || 'read';
            $scope.community.addMember(user, user.role);
            $scope.membersEditor.search = '';
            $scope.membersEditor.found = [];
        };

        $scope.addAllGroupMembers = async (group, role) => {
            $scope.membersEditor.search = '';
            $scope.membersEditor.found = [];
            await $scope.community.addGroupMembers(group, role);
            $scope.$apply();
        };

        $scope.setMemberRole = (member) => {
            $scope.community.addUsersToRole([member], member.role);
        };

        $scope.removeMember = function (member) {
            $scope.community.removeMember(member.id);
        };

        $scope.findUserOrGroup = function () {
            $scope.membersEditor.limit = $scope.membersEditor.init;
            var searchTerm = idiom.removeAccents(
                $scope.membersEditor.search
            ).toLowerCase();
            $scope.membersEditor.found = Dictionary.find(searchTerm, $scope.community);
        };

        $scope.save = async () => {
            await $scope.community.save();
            $location.path('/view/' + $scope.community.id);
            $scope.$apply();
        };

    }
])