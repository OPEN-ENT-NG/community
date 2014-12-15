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

	$scope.cancelWizard = function(){
		console.log('wizard closed');
	};

	$scope.finishWizard = function(){
		console.log('wizard finished')
	};

	$scope.step2OnNext = function(){
		console.log('step 2 next clicked');
	};

	$scope.step3OnPrevious = function(){
		console.log('step 3 previous clicked');
	};
}