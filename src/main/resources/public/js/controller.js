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

function CommunityController($scope, template, model, date, route, lang, $location){
	$scope.template = template;
	$scope.me = model.me;
	$scope.display = {};
	$scope.filters = { search: '' };
	$scope.wizard = {};
    $scope.resultsLimit = {
        init: 10,
        limit: 10
    }

	template.open('main', 'editor');
	template.open('services', 'editor-services');
	template.open('properties', 'editor-properties');
	template.open('members', 'editor-members');

	route({
		editCommunity: function(params){
			if ($scope.routed) {
				return;
			}
			$scope.routed = true;
			if (model.communities.synced) {
				$scope.routeEditCommunity(params);
				return;
			}
			model.communities.one('sync', function(){
				$scope.routeEditCommunity(params);
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

    $scope.openCommunity = function(community){
        window.location.href = community.url();
    };

	/* Routing */
	$scope.routeEditCommunity = function(params){
		var community = model.communities.find(function(c){ return c.pageId === params.communityId; });
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
	$scope.createCommunity = function(){
		$scope.community = new Community();
		$scope.community.serviceHome = {};
		$scope.wizard = {};
		$scope.members = [];

		template.open('main', 'creation-wizard');
		template.open('properties', 'editor-properties');
		template.open('services', 'editor-services');
		template.open('members', 'editor-members');
	};

	$scope.saveCommunity = function(){
		$scope.community.update();
	};

	$scope.saveServices = function() {
		$scope.processServicePages(function(){
			$scope.community.website.save(function(){
				try {
					$scope.community.website.synchronizeRights();
				}
				catch (e) {
					notify.error(lang.translate('community.rights.notsynced'));
					console.log("Failed to synchronize rights with services");
					console.log(e);
				}
				$scope.setupMembersEditor();
			});
		});
		// TODO : Manage error
	};

	$scope.finishCreateWizard = function(){
		$scope.saveServices();
		template.open('main', 'list');
	};

	/* Edition */
	$scope.editCommunity = function(community) {
		$scope.community = community;
		$scope.community.oldname = $scope.community.name;
		$scope.setupServicesEditor(function(){
			$scope.$apply('commmunity.serviceHome');
		});
        $scope.community.getDetails(function(){
            $scope.setupMembersEditor();
        });
		
		template.open('main', 'editor');
	};

	$scope.saveEditCommunity = function(){
		$scope.processServicePages(function(){
			/*DEBUG*/console.log("Community: saving website");
			/*DEBUG*/console.log($scope.community.website);
			$scope.community.website.save(function(){
				/*DEBUG*/console.log("Community: saved website");
				try {
					$scope.community.website.synchronizeRights();
				}
				catch (e) {
					notify.error(lang.translate('community.rights.notsynced'));
					console.log("Failed to synchronize rights with services");
					console.log(e);
				}
			});
		});

		$scope.community.update(function(){
			$scope.community.oldname = $scope.community.name;
		});

        $scope.communities.deselectAll();
		template.open('main', 'list');
	};

	$scope.cancelToList = function(){
		if ($scope.community && $scope.community.oldname) {
			$scope.community.name = $scope.community.oldname;
		}
        $scope.communities.deselectAll();
		template.open('main', 'list');
	};

	$scope.cancelCreation = function(){
		$scope.community.delete(function(){
			$scope.communities.sync();
		});
		$scope.cancelToList();
	};

	/* Services */
	$scope.setupServicesEditor = function(callback){
		$scope.community.serviceHome = _.find($scope.community.services, function(s){ return s.name === 'home'; });
		$scope.community.website = new model.pagesModel.Website();
		$scope.community.website._id = $scope.community.pageId;
		if(!$scope.community.website._id){
			return;
		}
		$scope.community.website.sync(function(){
			// Ensure the Pages do exists - The Page must contain a 'titleLink' attr referencing the community Service 'name'
			$scope.community.services.forEach(function(service){
				var page = $scope.community.website.pages.find(function(p) { return p.titleLink === service.name; });
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
	};

	$scope.createBasePage = function(service) {
		var page = new model.pagesModel.Page();
		page.title = service.title;
		page.titleLink = service.name;

		var row0 = page.addRow();
		var row1 = page.addRow();

		var cellSlider = new model.pagesModel.Cell();
		cellSlider.index = 0;
		cellSlider.width = 0;
		cellSlider.media = { type: 'sniplet', source: { application: 'community', template: 'navslider', source: {} } };
		row0.cells.push(cellSlider);

		var cellTitle = new model.pagesModel.Cell();
		cellTitle.width = 11;
		cellTitle.index = 1;
		cellTitle.media = { type: 'text', source: '<h1>' + $scope.community.name + '</h1>' }; // TODO : escape HTML ?
		row0.cells.push(cellTitle);

		var cellNavigation = new model.pagesModel.Cell();
		cellNavigation.index = 0;
		cellNavigation.width = 4;
		cellNavigation.media = { type: 'sniplet', source: { application: 'pages', template: 'navigation', source: { _id: $scope.community.website._id } } };
		row1.cells.push(cellNavigation);

		return page;
	};

	$scope.createPage_home = function(service) {
		var page = $scope.createBasePage(service);
		var row1 = page.rows.last();

		var cellMessage = new model.pagesModel.Cell();
		cellMessage.index = 1;
		cellMessage.width = 8;
		cellMessage.media = { type: 'sniplet', source: { application: 'community', template: 'message', source: { content: $scope.community.serviceHome.content } } };
		row1.cells.push(cellMessage);

		$scope.community.website.pages.push(page);
		$scope.community.website.landingPage = service.name;
	};

	$scope.createPage_blog = function(service) {
		var website = $scope.community.website;
		var page = $scope.createBasePage(service);
		var row1 = page.rows.last();
		var langService = lang;

		var blogCell = new model.pagesModel.Cell();
		blogCell.index = 1;
		blogCell.width = 8;
		blogCell.media = { type: 'sniplet' };

		var processor = $scope.processor;
		processor.stack(); // async: create blog

		Behaviours.applicationsBehaviours.blog.model.register();
		var blog = new Behaviours.applicationsBehaviours.blog.model.Blog();
		blog.title = lang.translate('community.services.blog.pretitle') + $scope.community.name;
		blog.thumbnail = $scope.community.website.icon || '';
		blog['comment-type'] = 'IMMEDIATE';
		blog.description = $scope.community.description || '';

		try {
			blog.save(function(){
				var post = {
					state: 'SUBMITTED',
					title: langService.translate('community.services.blog.firstpost.title'),
					content: langService.translate('community.services.blog.firstpost.content')
				};
				blog.posts.addDraft(post, function(post){
					post.publish(function(){
						blogCell.media.source = {
							template: 'articles',
							application: 'blog',
							source: { _id: blog._id }
						};
						row1.addCell(blogCell);
						/*DEBUG*/console.log("Community: successfuly created blog");
						website.pages.push(page);
						processor.done(); // create blog
					});
				});
			});
		}
		catch (e) {
			console.log("Failed to create Blog for service blog");
			console.log(e);
			service.active = false;
			processor.done();
		}
	};

	$scope.createPage_wiki = function(service) {
		var website = $scope.community.website;
		var page = $scope.createBasePage(service);
		var row1 = page.rows.last();
		var langService = lang;

		var wikiCell = new model.pagesModel.Cell();
		wikiCell.index = 1;
		wikiCell.width = 8;
		wikiCell.media = { type: 'sniplet' };

		var processor = $scope.processor;
		processor.stack(); // async: create wiki

		var wiki = new Behaviours.applicationsBehaviours.wiki.namespace.Wiki();
		var data = { title: langService.translate('community.services.wiki.pretitle') + $scope.community.name };

		try {
			wiki.createWiki(data, function(createdWiki){
        		// Create a default homepage
    			var wikiPage = {
    				isIndex: true,
    				title: langService.translate('community.services.wiki.homepage.title'),
    				content: langService.translate('community.services.wiki.homepage.content')
        		};

    			wiki.createPage(wikiPage, function(createdPage){
    				wikiCell.media.source = {
						template: 'wiki',
						application: 'wiki',
						source: { _id: createdWiki._id}
					};
					row1.addCell(wikiCell);
					/*DEBUG*/console.log("Community: successfuly created wiki");
					website.pages.push(page);
					processor.done(); // create wiki
    			});
    		});
		}
		catch (e) {
			console.log("Failed to create Wiki for service wiki");
			console.log(e);
			service.active = false;
			processor.done();
		}

	};

	$scope.createPage_forum = function(service) {
		var website = $scope.community.website;
		var page = $scope.createBasePage(service);
		var row1 = page.rows.last();
		var langService = lang;

		var forumCell = new model.pagesModel.Cell();
		forumCell.index = 1;
		forumCell.width = 8;
		forumCell.media = { type: 'sniplet' };

		var processor = $scope.processor;
		processor.stack(); // async: create wiki

		var category = new Behaviours.applicationsBehaviours.forum.namespace.Category();
		var templateData = {
			categoryName: lang.translate("community.services.forum.category.title").replace(/\{0\}/g, $scope.community.name),
			firstSubject: lang.translate("community.services.forum.subject.title"),
			firstMessage: lang.translate("community.services.forum.first.message").replace(/\{0\}/g, $scope.community.name)
		};

		try {
			category.createTemplatedCategory(templateData, function(){
				forumCell.media.source = {
					template: 'forum',
					application: 'forum',
					source: { _id: category._id }
				};
				row1.addCell(forumCell);
				/*DEBUG*/console.log("Community: successfuly created forum");
				website.pages.push(page);
				processor.done(); // create forum
    		});
		}
		catch (e) {
			console.log("Failed to create Wiki for service wiki");
			console.log(e);
			service.active = false;
			processor.done();
		}

	};

	$scope.createPage_documents = function(service) {
		var page = $scope.createBasePage(service);
		var row1 = page.rows.last();

		var cellDocuments = new model.pagesModel.Cell();
		cellDocuments.index = 1;
		cellDocuments.width = 8;
		cellDocuments.media = { type: 'sniplet', source: { application: 'workspace', template: 'documents', source: { documents: [] } } };
		row1.cells.push(cellDocuments);

		$scope.community.website.pages.push(page);
	};

	$scope.updatePageTitle = function(service) {
		var page = $scope.community.website.pages.find(function(page){ return page.titleLink === service.name; });
		if (page) {
            var titleCell = page.rows.first().cells.first().media.type === 'text' ?
                page.rows.first().cells.first() :
                page.rows.first().cells.all[1];
			titleCell.media.source = '<h1>' + $scope.community.name + '</h1>'; // TODO : escape HTML ?
		}
	};

	$scope.updatePage_home = function(service) {
		var page = $scope.community.website.pages.find(function(page){ return page.titleLink === service.name; });
		if (page) {
			var titleCell = page.rows.first().cells.first().media.type === 'text' ?
                page.rows.first().cells.first() :
                page.rows.first().cells.all[1];
			titleCell.media.source = '<h1>' + $scope.community.name + '</h1>'; // TODO : escape HTML ?
			/*TEMP
			if (page.rows.all[1].cells.all[1].media.type === 'sniplet') {
				page.rows.all[1].cells.all[1].media = { type: 'sniplet', source: { application: 'community', template: 'message', source: { content: $scope.community.serviceHome.content } } };
			}
			TEMP*/
		}
	};

	$scope.getPage_home = function(page, service) {
		var content = page.rows.all[1].cells.all[1].media.source.source.content;
		if (content && _.isString(content)) {
			service.content = content;
		}
	};

	$scope.deletePage = function(service) {
		// Ensure the Page is deleted - The Page must contain a 'titleLink' attr referencing the community Service 'name'
		$scope.community.website.pages.all = $scope.community.website.pages.reject(function(page){ return page.titleLink === service.name; });
		delete service.created;
	};

	/* Members */
	$scope.setupMembersEditor = function(){
		$scope.search = { term: '', found: [] };
		$scope.members = [];
		$scope.edited = { delete: [], manage: [], contrib: [], read: [] };

		function setMembers(){
			$scope.community.getMembers(function(visibles){
				$scope.visibles = visibles;
				$scope.members = _.union($scope.community.members.manager, $scope.community.members.contrib, $scope.community.members.read);
				$scope.$apply('members');
				$scope.$apply('visibles');
			});
		}

		if(!$scope.community.id){
			$scope.community.create(function(){
				setMembers();
			});
		}
		else{
			setMembers();
		}
	};

	$scope.addMember = function(user, right) {
		// Default rights : read
		user.role = right ? right : 'read';
		$scope.members.push(user);
		$scope.community.addMember(user.id, user.role);
		// TODO : Manage error
		$scope.search = { term: '', found: [] };
	};

	$scope.addAllGroupMembers = function(group, role) {
		http().get('/userbook/visible/users/' + group.id).done(function(users) {
			var addingUsers = [];
			_.each(users, function(user){
				if (model.me.userId === user.id) {
					return; // Do not add the current user (rights could be modified)
				}
				if (_.find($scope.members, function(member){ return member.id === user.id; })) {
					return; // Do not add users already members
				}
				user.role = role;
				addingUsers.push(user.id);
				$scope.members.push(user);
			});
			$scope.community.addMembers(addingUsers, role, function(){
				$scope.search = { term: '', found: [] };
				$scope.$apply('members');
			});
		});
	};

	$scope.setMemberRole = function(member) {
		$scope.community.setMemberRole(member.id, member.role);
		// TODO : Manage error
	};

	$scope.removeMember = function(member) {
		$scope.members = _.reject($scope.members, function(m){ return m.id === member.id });
		$scope.community.removeMember(member.id);
		delete member.role;
		// TODO : Manage error
	};

	$scope.findUserOrGroup = function(){
        $scope.resultsLimit.limit = $scope.resultsLimit.init;
		var searchTerm = lang.removeAccents($scope.search.term).toLowerCase();
		$scope.search.found = _.union(
			_.filter($scope.visibles.groups, function(group){
                if($scope.community.groups.read === group.id || $scope.community.groups.contrib === group.id || $scope.community.groups.manager === group.id){
                    return false;
                }
                var testName = lang.removeAccents(group.name).toLowerCase();
                return testName.indexOf(searchTerm) !== -1;
            }),
			_.filter($scope.visibles.users, function(user){
				var testName = lang.removeAccents(user.lastName + ' ' + user.firstName).toLowerCase();
				var testNameReversed = lang.removeAccents(user.firstName + ' ' + user.lastName).toLowerCase();
				return testName.indexOf(searchTerm) !== -1 || testNameReversed.indexOf(searchTerm) !== -1;
			})
		);
		$scope.search.found = _.filter($scope.search.found, function(element){
			return _.find($scope.members, function(member){ return member.id === element.id; }) === undefined;
		});
	};


    $scope.removeCommunities = function(){
        $scope.display.confirmDelete = true;
    }

	$scope.cancelRemoveCommunity = function() {
		$scope.display.confirmDelete = undefined;
	};

	$scope.doRemoveCommunities = function() {
        var communitiesList = $scope.communities.selection()
        var launcher = {
            countUp: 0,
            max: communitiesList.length,
            action: function(){
                communitiesList[launcher.countUp].delete(function(){
                    model.communities.remove(communitiesList[launcher.countUp]);
                    if(++launcher.countUp >= launcher.max){
                        launcher.terminate()
                    } else {
                        launcher.action()
                    }
                })
            },
            terminate: function(){
                $scope.display.confirmDelete = undefined
                $scope.$apply()
            }
        }

        launcher.action()
	}
}
