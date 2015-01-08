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
		//template.open('step2', 'editor-properties');
		template.open('step3', 'editor-members');
		template.open('step4', 'editor-services');

		console.log($scope);
	};

	$scope.setupPropertiesEditor = function(){
		//$scope.properties = {};
		console.log($scope);
	};

	$scope.setupMembersEditor = function(){
		
	};

	$scope.setupServicesEditor = function(){
		
	};

	$scope.cancelCreateWizard = function(){
		template.open('main', 'list');
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
	};


	/* Members */


	/* Services */


	/* Delete */
	$scope.removeCommunity = function(community) {
		// TODO : open delete lightbox
	};


	/* DEBUG */
	$scope.dump = function() {
		console.log($scope);
	}
}