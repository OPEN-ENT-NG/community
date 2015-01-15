function Community() {
	this.services = [
		{ name: 'home', title: 'Accueil', mandatory: true, active: true },
		{ name: 'blog', title: 'Blog' },
		{ name: 'documents', title: 'Documents' }
/*		{ name: 'forum' },
		{ name: 'wiki' },
		{ name: 'userbook' },
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
		data.owner = { displayName: model.me.username, userId: model.me.userId };
		this.updateData(data);
		this.behaviours('community');
		model.communities.push(this);
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

		var visibles = [];
		if (members.visibles) {
			_.each(members.visibles, function(user){ user.displayName = user.username; });
			visibles = members.visibles;
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


model.build = function(){
	this.makeModels([Community]);

	var rightsSetter = {
		manager: function(rights) {
			rights.manager = true;
			rights.contrib = true;
		},
		contrib: function(rights) {
			rights.contrib = true;
		}
	}

	this.collection(Community, {
		sync: function(callback){
			http().get('/community/list').done(function(communities){
				this.load(communities, function(community) {
					community.myRights = {};
					if (community.types) {
						_.each(community.types, function(type) {
							if (typeof rightsSetter[type] === 'function') {
								rightsSetter[type](community.myRights);
							}
						});
					}
				});
				if(typeof callback === 'function'){
					callback();
				}
			}.bind(this));
		},
		behaviours: 'community'
	})
};