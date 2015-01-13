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

function CommunityController($scope, template, model, date, route, lang){
	$scope.template = template;
	$scope.me = model.me;
	$scope.display = {};
	$scope.wizard = {};
	$scope.maxResults = 10;

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
		$scope.wizard = {};

		template.open('main', 'creation-wizard');
		template.open('step2', 'editor-properties');
		template.open('step3', 'editor-services');
		template.open('step4', 'editor-members');
	};

	$scope.saveCommunity = function(){
		if ($scope.community.id === undefined) {
			$scope.community.create(function(){
				$scope.setupServicesEditor();
			});
		}
		else {
			$scope.community.update();			
		}
		// TODO : Manage error
	};
	/*
	$scope.setupServicesWizard = function(){
		if ($scope.wizard.servicesLoaded) {
			return;
		}
		$scope.wizard.serviceLoaded = true;	
		$scope.setupServicesEditor();		
	};
	*/
	$scope.saveServices = function() {
		$scope.processServicePages();
		$scope.community.website.save(function(){
			$scope.setupMembersEditor();
		});
		// TODO : Manage error
	};
	/*
	$scope.setupMembersWizard = function(){
		if ($scope.wizard.membersLoaded) {
			return;
		}
		$scope.wizard.membersLoaded = true;
		$scope.setupMembersEditor();
	};
*/
	$scope.finishCreateWizard = function(){
		template.open('main', 'list');
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

	$scope.saveEditCommunity = function(){
		$scope.community.update(function(){
			template.open('main', 'list');	
		});
	};

	$scope.cancelToList = function(){
		template.open('main', 'list');
	};


	/* Services */
	$scope.setupServicesEditor = function(callback){
		$scope.community.website = new model.pagesModel.Website();
		$scope.community.website._id = $scope.community.pageId;
		$scope.community.website.sync(function(){
			// Ensure the Pages do exists
			_.each($scope.community.services, function(service){
				if (! $scope.community.website.pages.find(function(page) { return page._id === service.pageId; })) {
					delete service.pageId;
				}
			});
			if (typeof callback === 'function'){
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
		$scope.search = { term: '', found: [] };
		$scope.community.getMembers(function(visibles){
			$scope.members = _.union($scope.community.members.manager, $scope.community.members.contrib, $scope.community.members.read);
			$scope.visibles = visibles;
			$scope.edited = { delete: [], manage: [], contrib: [], read: [] };
			// DEBUG
			console.log($scope.members);
			console.log($scope.visibles);
		});
	};

	$scope.addMember = function(userOrGroup) {
		// Default rights : read
		userOrGroup.role = 'read';
		$scope.members.push(userOrGroup);
		$scope.community.addMember(userOrGroup.id, 'read');
		// TODO : Manage error
		$scope.search = { term: '', found: [] };
	};

	$scope.setMemberRole = function(member) {
		$scope.community.setMemberRole(member.id, member.role);
		// TODO : Manage error
	};
 
	$scope.removeMember = function(member) {
		$scope.members.splice($scope.members.indexOf(member));
		$scope.community.removeMember(member.id);
		delete member.role;
		// TODO : Manage error
	};

	$scope.findUserOrGroup = function(){
		var searchTerm = lang.removeAccents($scope.search.term).toLowerCase();
		/*DEBUG*/console.log('SEARCH: [' + searchTerm + ']'); 
		$scope.search.found = _.union(
			_.filter($scope.visibles.groups, function(group){
				var testName = lang.removeAccents(group.name).toLowerCase();
				return testName.indexOf(searchTerm) !== -1;
			}),
			_.filter($scope.visibles.users, function(user){
				var testName = lang.removeAccents(user.lastName + ' ' + user.firstName).toLowerCase();
				var testNameReversed = lang.removeAccents(user.firstName + ' ' + user.lastName).toLowerCase();
				return testName.indexOf(searchTerm) !== -1 || testNameReversed.indexOf(searchTerm) !== -1;
			})
		);
		/*DEBUG*/console.log('matches: ' + ($scope.search.found !== undefined ? $scope.search.found.length : 0));
		$scope.search.found = _.filter($scope.search.found, function(element){
			return _.find($scope.members, function(member){ return member.id === element.id }) === undefined;
		});
		/*DEBUG*/console.log('filtered: ' + ($scope.search.found !== undefined ? $scope.search.found.length : 0));
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