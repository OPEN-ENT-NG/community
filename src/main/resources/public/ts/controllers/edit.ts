﻿import { ng, template, idiom } from 'entcore';
import { Dictionary } from '../model/dictionary';
import { _ } from 'entcore/libs/underscore/underscore';
import { Community, Library } from '../model/community';

export let edit = ng.controller('EditController', [
    '$scope', 'model','$location', ($scope, model, $location) => {
        template.open('editor/services', 'editor/services');
        template.open('editor/properties', 'editor/properties');
        template.open('editor/members', 'editor/members');

        $scope.communities = Library.all;

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

        $scope.canEditCommunity  = (communityModified) => {
            if(communityModified.name === undefined || communityModified.name.trim() === ''){
                return communityModified.error = true;
            }
            let communitiesFound = _.where($scope.communities, {name: communityModified.name});
            if (communitiesFound !== undefined && communitiesFound.length > 1 ) {
                return communityModified.error = true;
            } else {
                return communityModified.error = false;
            }
        };
    }
])