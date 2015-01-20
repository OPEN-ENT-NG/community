routes.define(function($routeProvider){
    $routeProvider
		.when('/list', {
			action: 'list'
		})
      .when('/edit/:communityId', {
        action: 'editCommunity'
      })
	  .otherwise({
        redirectTo: '/list'
      });
});

function CommunityController($scope, template, model, date, route, lang){
	$scope.template = template;
	$scope.me = model.me;
	$scope.display = {};
	$scope.filters = { search: '' };
	$scope.wizard = {};
	$scope.maxResults = 10;

	route({
		editCommunity: function(params){
			model.communities.one('sync', function(){
				var community = model.communities.find(function(c){ return c.pageId === params.communityId });
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
			});
		},
		list: function(params){
			$scope.cancelToList();
		}
	});

	$scope.communities = model.communities;
	template.open('main', 'list');

	Behaviours.loadBehaviours('pages', function(){
		Behaviours.applicationsBehaviours.pages.model.register();
		model.pagesModel = Behaviours.applicationsBehaviours.pages.model;
		sniplets.load();
	});

	$scope.roleMatch = function(element){
		return (!$scope.filters.manager || element.myRights.manager);
	};

	$scope.searchMatch = function(element){
		return lang.removeAccents((element.name || '').toLowerCase()).indexOf(lang.removeAccents($scope.filters.search.toLowerCase())) !== -1;
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

	$scope.saveServices = function() {
		$scope.processServicePages(function(){
			$scope.community.website.save(function(){
				$scope.community.website.synchronizeRights();
				$scope.setupMembersEditor();
			});	
		});		
		// TODO : Manage error
	};

	$scope.finishCreateWizard = function(){
		template.open('main', 'list');
	};


	/* Edition */
	$scope.editCommunity = function(community) {
		$scope.community = community;
		$scope.community.oldname = $scope.community.name;
		$scope.setupServicesEditor();
		template.open('main', 'editor');
		template.open('editor2', 'editor-services');
		template.open('editor1', 'editor-properties');
		template.open('editor3', 'editor-members');
		$scope.setupMembersEditor();
	};

	$scope.saveEditCommunity = function(){
		$scope.processServicePages(function(){
			/*DEBUG*/console.log("Community: saving website");
			/*DEBUG*/console.log($scope.community.website);
			$scope.community.website.save(function(){
				/*DEBUG*/console.log("Community: saved website");
				$scope.community.website.synchronizeRights();
			});	
		});

		$scope.community.update(function(){
			$scope.community.oldname = $scope.community.name;
		});

		template.open('main', 'list');
	};

	$scope.cancelToList = function(){
		if ($scope.community && $scope.community.oldname) {
			$scope.community.name = $scope.community.oldname;
		}
		template.open('main', 'list');
	};


	/* Services */
	$scope.setupServicesEditor = function(callback){
		$scope.serviceHome = _.find($scope.community.services, function(s){ return s.name === 'home'; });
		$scope.community.website = new model.pagesModel.Website();
		$scope.community.website._id = $scope.community.pageId;
		$scope.community.website.sync(function(){
			// Ensure the Pages do exists - The Page must contain a 'titleLink' attr referencing the community Service 'name'
			_.each($scope.community.services, function(service){
				var page = $scope.community.website.pages.find(function(p) { return p.titleLink === service.name; })
				if (page) {
					service.created = true;
					service.active = true;
					try {
						if ($scope['getPage_' + service.name] !== undefined) {
							$scope['getPage_' + service.name](page, service);
						}
					}
					catch (e) {
						console.log("Could not get page contents for " + service.name);
						console.log(e);
					}
				}
			});
			if (typeof callback === 'function'){
				callback();
			}
		});
	};

	$scope.processServicePages = function(callback) {
		$scope.processor = new AsyncProcessor();
		$scope.processor.setCallback(callback);

		_.each($scope.community.services, function(service){
			if (service.active === true && service.created !== true) {
				// Create the Page
				if ($scope['createPage_' + service.name] !== undefined) {
					try {
						$scope['createPage_' + service.name](service);
					}
					catch (e) {
						console.log("Could not created page for " + service.name);
						console.log(e);
						notify.error(lang.translate('community.service.notcreated') + service.title);
						service.active = false;
					}
				}
				else {
					// Nothing to do - cannot create the page
					notify.error(lang.translate('community.service.notcreated') + service.title);
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
					notify.error(lang.translate('community.service.notupdated') + service.title);
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
					notify.error(lang.translate('community.service.notdeleted') + service.title);
					service.active = true;
				}
			}
		});
		
		$scope.processor.end();
	}

	$scope.createBasePage = function(service) {
		var page = new model.pagesModel.Page();
		page.title = service.title;
		page.titleLink = service.name;

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

		return page;
	};

	$scope.createPage_home = function(service) {
		var page = $scope.createBasePage(service);
		var row1 = page.rows.last();

		var cellText = new model.pagesModel.Cell();
		cellText.index = 1;
		cellText.width = 9;
		cellText.media = { type: 'text', source: $scope.serviceHome.content };
		row1.cells.push(cellText);

		$scope.community.website.pages.push(page);
		$scope.community.website.landingPage = service.name;
	};

	$scope.createPage_blog = function(service) {
		var page = $scope.createBasePage(service);
		var row1 = page.rows.last();

		var blogCell = new model.pagesModel.Cell();
		blogCell.index = 1;
		blogCell.width = 9;
		blogCell.media = { type: 'sniplet' };

		var processor = $scope.processor;
		processor.stack(); // async: create blog

		Behaviours.applicationsBehaviours.blog.model.register();
		var blogCaller = {
			blog: new Behaviours.applicationsBehaviours.blog.model.Blog(),
			snipletResource: $scope.community.website,
			setSnipletSource: function(newBlog){
				blogCell.media.source = {
					template: 'articles',
					application: 'blog',
					source: newBlog
				};
				row1.addCell(blogCell);
				/*DEBUG*/console.log("Community: created blog");
				/*DEBUG*/console.log(newBlog);
				/*DEBUG*/console.log(row1);
				processor.done(); // create blog
			}
		};
		var blogSniplet = _.findWhere(sniplets.sniplets, { application: 'blog', template: 'articles' });
		$scope.community.website.pages.push(page);

		try {
			// Create the blog
			/*DEBUG*/console.log("Community: creating blog");
			blogSniplet.sniplet.controller.createBlog.call(blogCaller);
		}
		catch (e) {
			console.log("Failed to create Blog for service blog");
			console.log(e);
			processor.done();
		}
	};

	$scope.createPage_documents = function(service) {
		var page = $scope.createBasePage(service);
		var row1 = page.rows.last();

		var cellDocuments = new model.pagesModel.Cell();
		cellDocuments.index = 1;
		cellDocuments.width = 9;
		cellDocuments.media = { type: 'sniplet', source: { application: 'workspace', template: 'documents', source: {} } };
		row1.cells.push(cellDocuments);

		$scope.community.website.pages.push(page);
	};

	$scope.updatePageTitle = function(service) {
		var page = $scope.community.website.pages.find(function(page){ return page.titleLink === service.name; });
		if (page) {
			page.rows.first().cells.first().media.source = '<h1>' + $scope.community.name + '</h1>'; // TODO : escape HTML ?
		}
	};

	$scope.updatePage_home = function(service) {
		var page = $scope.community.website.pages.find(function(page){ return page.titleLink === service.name; });
		if (page) {
			page.rows.first().cells.first().media.source = '<h1>' + $scope.community.name + '</h1>'; // TODO : escape HTML ?
			page.rows.all[1].cells.all[1].media.source = $scope.serviceHome.content;
		}
	};

	$scope.getPage_home = function(page, service) {
		var content = page.rows.all[1].cells.all[1].media.source;
		if (content && _.isString(content)) {
			service.content = content;
		}
	};

	$scope.deletePage = function(service) {
		// Ensure the Page is deleted - The Page must contain a 'titleLink' attr referencing the community Service 'name'
		$scope.community.website.pages.all = $scope.community.website.pages.reject(function(page){ return page.titleLink === service.name });
		delete service.created;
	};


	/* Members */
	$scope.setupMembersEditor = function(){
		$scope.search = { term: '', found: [] };
		$scope.members = [];
		$scope.community.getMembers(function(visibles){
			$scope.members = _.union($scope.community.members.manager, $scope.community.members.contrib, $scope.community.members.read);
			$scope.visibles = visibles;
			$scope.edited = { delete: [], manage: [], contrib: [], read: [] };
			$scope.$apply('members');
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
		$scope.search.found = _.filter($scope.visibles, function(user){
			var testName = lang.removeAccents(user.lastName + ' ' + user.firstName).toLowerCase();
			var testNameReversed = lang.removeAccents(user.firstName + ' ' + user.lastName).toLowerCase();
			return testName.indexOf(searchTerm) !== -1 || testNameReversed.indexOf(searchTerm) !== -1;
		});
		$scope.search.found = _.filter($scope.search.found, function(element){
			return _.find($scope.members, function(member){ return member.id === element.id }) === undefined;
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