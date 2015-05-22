function Community() {
	this.services = [
	    // TODO : i18n for services' titles
		{ name: 'home', title: 'Accueil', mandatory: true, active: true, workflow: "community.create" },
		{ name: 'blog', title: 'Blog', workflow: 'blog.create' },
		{ name: 'documents', title: 'Documents', workflow: 'workspace.create' },
		{ name: 'wiki', title: 'Wiki', workflow: 'wiki.create' },
		{ name: 'forum', title: 'Forum', workflow: 'forum.admin' }
/*		{ name: 'userbook' },
		{ name: 'timeline' },
		{ name: 'poll' },
*/	];
	this.members = {
		read: [],
		contrib: [],
		manager: []
	};
}

Community.prototype.create = function(callback) {
	http().postJson('/community', this).done(function(data){
		this.website._id = data.pageId;
		data.owner = { displayName: model.me.username, userId: model.me.userId };
		this.updateData(data);
		this.types = ['manager'];
		this.behaviours('community');
		model.communities.pushWithRights(this);
		if(typeof callback === 'function'){
			callback();
		}
	}.bind(this));
};

Community.prototype.update = function(callback) {
	http().putJson('/community/' + this.id, this).done(function(data){
		if(typeof callback === 'function'){
			callback();
		}
	});
};

Community.prototype.delete = function(callback) {
	http().delete('/community/' + this.id).done(function(data){
		if(typeof callback === 'function'){
			callback();
		}
	});
};

Community.prototype.toJSON = function() {
	var json = { name: this.name }
	if (this.icon) {
		json.icon = this.icon;
	}
	if (this.description) {
		json.description = this.description;
	}
	return json;
};

Community.prototype.getMembers = function(callback) {
	var community = this;
	http().get('/community/' + this.id + '/users').done(function(members){
		if (members.manager) {
			community.members.manager = _.filter(members.manager, function(member) { 
				member.role = 'manager';
				return member.id !== model.me.userId;
			});
		}
		if (members.contrib) {
			community.members.contrib = _.filter(members.contrib, function(member) {
				member.role = 'contrib';
				return member.id !== model.me.userId;
			});
		}
		if (members.read) {
			community.members.read = _.filter(members.read, function(member) { 
				member.role = 'read';
				return member.id !== model.me.userId;
			});
		}
		// community.members.all = _.union(community.members.manager, community.members.contrib, community.members.read);

		var visibles = { users: [], groups: [] };
		if (members.visibles) {
			if (members.visibles.users) {
				_.each(members.visibles.users, function(user){ user.displayName = user.username; });
				visibles.users = members.visibles.users;
			}
			if (members.visibles.groups) {
				_.each(members.visibles.groups, function(group){ group.isGroup = true; });
				visibles.groups = members.visibles.groups;
			}
		}
		if(typeof callback === 'function'){
			callback(visibles);
		}
	});
};


Community.prototype.addMember = function(id, role, callback) {
	var data = {};
	data[role] = [ id ];
	this.putJsonMembers(data, callback);
};

Community.prototype.addMembers = function(ids, role, callback) {
	var data = {};
	data[role] = ids;
	this.putJsonMembers(data, callback);
};

Community.prototype.setMemberRole = function(id, role, callback) {
	var data = { delete: [ id ] };
	data[role] = [ id ];
	this.putJsonMembers(data, callback);
};

Community.prototype.removeMember = function(id, callback) {
	var data = { delete: [ id ] };
	this.putJsonMembers(data, callback);
};

Community.prototype.updateMembers = function(editedMembers, callback) {
	var community = this;
	// clean delete : only delete actual members
	editedMembers.delete = _.filter(editedMembers.delete, function(member){
		return _.find(_.union(community.members.manager, community.members.contrib, community.members.read), function(m){
			return m.id === member.id
		});
	});
	this.putJsonMembers(editedMembers, callback);
};

Community.prototype.putJsonMembers = function(members, callback) {
	http().putJson('/community/' + this.id + '/users', JSON.parse(JSON.stringify(members))).done(function(data){
		if(typeof callback === 'function'){
			callback();
		}
	});
};

Community.prototype.url = function() {
	return '/pages#/website/' + this.pageId;
}


AsyncProcessor = function() {
	this.actions = 0;
}

AsyncProcessor.prototype.setCallback = function(callback) {
	if (typeof callback === 'function') {
		this.callable = true;
		this.callback = callback;
	}
};

AsyncProcessor.prototype.stack = function() {
	this.actions++;
};

AsyncProcessor.prototype.done = function() {
	if (this.callable && this.ended && this.actions <= 0 && this.callback) {
		this.callback();
		this.callable = false;
	}
	else {
		this.actions--;
	}
};

AsyncProcessor.prototype.end = function() {
	if (this.callable && this.actions <= 0 && this.callback) {
		this.callback();
		this.callable = false;
	}
	else {
		this.ended = true;
		this.actions--;
	}
};


model.build = function(){
	this.makeModels([Community]);
	this.me.workflow.load(['blog', 'forum', 'wiki']);

	var rightsSetter = {
		manager: function(resource) {
			resource.myRights.manager = true;
			resource.myRights.contrib = true;
			resource.role = 'manager';
		},
		contrib: function(resource) {
			resource.myRights.contrib = true;
			resource.role = 'contrib';
		},
		default: function(resource) {
			resource.role = 'read';	
		}
	}

	this.collection(Community, {
		sync: function(callback){
			http().get('/community/list').done(function(communities){
				var col = this;
				this.load(communities, function(community) {
					col.synced = true;
					community.myRights = {};
					if (community.types) {
						_.each(community.types, function(type) {
							if (typeof rightsSetter[type] === 'function') {
								rightsSetter[type](community);
							}
							else {
								rightsSetter.default(community);
							}
						});
					}
				});
				if(typeof callback === 'function'){
					callback();
				}
			}.bind(this));
		},
		deleteSelection: function(){
			this.selection().forEach(function(community){
				community.delete();
			});
			this.removeSelection();
		},
		pushWithRights: function(community){
			community.myRights = {};
			if (community.types) {
				_.each(community.types, function(type) {
					if (typeof rightsSetter[type] === 'function') {
						rightsSetter[type](community);
					}
					else {
						rightsSetter.default(community);	
					}
				});
			}
			this.push(community);
		},
		behaviours: 'community'
	})
};