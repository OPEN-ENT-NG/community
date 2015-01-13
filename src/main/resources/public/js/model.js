function Community() {
	this.services = [
		{ name: 'home', mandatory: true, active: true },
		{ name: 'blog' },
		{ name: 'documents' },
		{ name: 'forum' },
		{ name: 'wiki' },
		{ name: 'userbook' },
		{ name: 'timeline' },
		{ name: 'poll' },
	];
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

		var visibles = { users: [], groups: [] };
		if (members.visibles) {
			if (members.visibles.users) {
				_.each(members.visibles.users, function(user){ user.displayName = user.username; });
				visibles.users = members.visibles.users;
			}
			if (members.visibles.groups) {
				_.each(members.visibles.groups, function(group){ group.displayName = group.name; });
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

	this.collection(Community, {
		sync: function(callback){
			http().get('/community/list').done(function(communities){
				this.load(communities);
				if(typeof callback === 'function'){
					callback();
				}
			}.bind(this));
		},
		behaviours: 'community'
	})
};