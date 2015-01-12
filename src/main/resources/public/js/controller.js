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
	$scope.display = {};

	route({
		viewCommunity: function(params){
		},
		list: function(params){
		}
	});

	$scope.communities = model.communities;
	template.open('main', 'list');

	Behaviours.loadBehaviours('pages', function(){
		Behaviours.applicationsBehaviours.pages.model.register();
		model.pagesModel = Behaviours.applicationsBehaviours.pages.model;
		sniplets.load();
	});

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
			$scope.getCommunityWebsite(function(){
				$scope.processServicePages();
				$scope.community.website.save(function(){
					// Success
					template.open('main', 'list');
					// TODO : Manage error
				});
			});
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
			return;
		}
		$scope.getCommunityWebsite(function(){
			$scope.community.serviceLoaded = true;	
		});		
	};

	$scope.getCommunityWebsite = function(callback){
		$scope.community.website = new model.pagesModel.Website();
		$scope.community.website._id = $scope.community.pageId;
		$scope.community.website.sync(function(){
			// Ensure the Pages do exists
			_.each($scope.community.services, function(service){
				if (! $scope.community.website.pages.find(function(page) { return page._id === service.pageId; })) {
					delete service.pageId;
				}
			});
				if(typeof callback === 'function'){
				callback();
			}
		});
	};

	$scope.processServicePages = function() {
		_.each($scope.community.services, function(service){
			if (service.active === true && service.pageId === undefined) {
				// Create the Page
				if ($scope['createPage_' + service.name] !== undefined) {
					$scope['createPage_' + service.name]();
				}
				else {
					// Nothing to do - cannot create the page
					// TODO : manage error ?
					service.active = false;
				}
			}
			else if (service.active !== true && service.pageId !== undefined) {
				// Delete the Page
				$scope.deletePage(service);
			}
		});
	}

	$scope.createPage_home = function() {
		var page = new model.pagesModel.Page();
		page.title = 'Accueil';

		var row0 = page.addRow();
		var row1 = page.addRow();

		var cellTitle = new model.pagesModel.Cell();
		cellTitle.width = 12;
		cellTitle.media = { type: 'text', source: '<h1>' + $scope.community.name + '</h1>' }; // TODO : escape HTML ?
		row0.cells.push(cellTitle);

		var cellNavigation = new model.pagesModel.Cell();
		cellNavigation.index = 0;
		cellNavigation.width = 3;
		cellNavigation.media = { type: 'sniplet', source: { application: 'pages', template: 'navigation', source: { _id: $scope.community.website._id } } };
		row1.cells.push(cellNavigation);		

		var cellText = new model.pagesModel.Cell();
		cellText.index = 1;
		cellText.width = 9;
		cellText.media = { type: 'text', source: '<p>Bienvenue dans la communauté</p>' };
		row1.cells.push(cellText);

		$scope.community.website.pages.push(page);
	};

	$scope.createPage_blog = function() {
		var page = new model.pagesModel.Page();
		page.title = 'Blog';

	};

	$scope.createPage_documents = function() {
		var page = new model.pagesModel.Page();
		page.title = 'Documents';

	};

	$scope.createPage_forum = function() {
		var page = new model.pagesModel.Page();
		page.title = 'Forum';

	};

	$scope.createPage_wiki = function() {
		var page = new model.pagesModel.Page();
		page.title = 'Wiki';

	};

	$scope.createPage_userbook = function() {
		var page = new model.pagesModel.Page();
		page.title = 'Trombinoscope';

	};

	$scope.createPage_timeline = function() {
		var page = new model.pagesModel.Page();
		page.title = 'Evenements';

	};

	$scope.createPage_poll = function() {
		var page = new model.pagesModel.Page();
		page.title = 'Sondage';

	};

	$scope.deletePage = function(service) {
		$scope.community.website.pages.all = $scope.community.website.pages.reject(function(page){ return page._id === service.pageId });
		delete service.pageId;
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
		$scope.display.confirmDelete = true;
		$scope.community = community;
	};

	$scope.cancelRemoveCommunity = function() {
		$scope.display.confirmDelete = undefined;
	};

	$scope.doRemoveCommunity = function() {
		$scope.community.delete(function(){
			model.communities.remove($scope.community);
			$scope.display.confirmDelete = undefined;
			$scope.community = undefined;
		});
	};
}