routes.define(function($routeProvider){
    $routeProvider
		.when('/list', {
			action: 'list'
		})
      .when('/view/:communityId', {
        action: 'viewCommunity'
      })
	  .otherwise({
        redirectTo: '/list'
      });
});

function CommunityController($scope, template, model, date, route){
	$scope.template = template;
	$scope.me = model.me;

	route({
		viewCommunity: function(params){
		},
		list: function(params){
		}
	});

	$scope.communities = model.communities;
	template.open('main', 'list');

	/* Navigation */
	$scope.viewSite = function(community) {
		// TODO : redirect to site
	};


	/* Creation */
	$scope.createCommunity = function(){
		$scope.community = new Community();

		template.open('main', 'creation-wizard');
		template.open('step2', 'editor-properties');
		template.open('step3', 'editor-services');
		template.open('step4', 'editor-members');
	};

	$scope.finishCreateWizard = function(){
		$scope.community.create(function(){
			template.open('main', 'list');	
		});
	};

	/* Edition */
	$scope.editCommunity = function(community) {
		$scope.community = community;
		template.open('main', 'editor');
		template.open('editor1', 'editor-properties');
		template.open('editor2', 'editor-services');
		template.open('editor3', 'editor-members');

		$scope.setupServicesEditor();
		$scope.setupMembersEditor();
	};

	$scope.saveCommunity = function(){
		$scope.community.update(function(){
			template.open('main', 'list');	
		});
	};

	$scope.cancelToList = function(){
		template.open('main', 'list');
	};


	/* Services */
	$scope.setupServicesEditor = function(){
		if ($scope.community.servicesLoaded) {
			return
		}

		Behaviours.loadBehaviours('pages', function(){
			Behaviours.applicationsBehaviours.pages.model.register();
			var pagesModel = Behaviours.applicationsBehaviours.pages.model;
			$scope.community.website = new pagesModel.Website();
			$scope.community.website._id = $scope.community.pageId;
			$scope.community.website.sync(function(){
				// Ensure the Pages do exists
				_.each($scope.community.services, function(service){
					if (! $scope.community.website.pages.find(function(page) { return page._id === service.pageId; })) {
						delete service.pageId;
					}
				});
				$scope.community.serviceLoaded = true;	
			});
		});
	};

	$scope.createPage_home = function() {
		var pagesModel = Behaviours.applicationsBehaviours.pages.model;
		var page = new pagesModel.Page();
	};

	/* Members */
	$scope.setupMembersEditor = function(){
		if ($scope.community.membersLoaded) {
			return;
		}

		$scope.community.getMembers(function(){
			$scope.members = _.union(
				_.each($scope.community.members.manager, function(member) { member.role = 'manager'; }),
				_.each($scope.community.members.contrib, function(member) { member.role = 'contrib'; }),
				_.each($scope.community.members.read, function(member) { member.role = 'read'; })
			);
			$scope.community.membersLoaded = true;
			// DEBUG
			console.log($scope.members);
		});
	};


	/* Delete */
	$scope.removeCommunity = function(community) {
		// TODO : open delete lightbox
	};
}