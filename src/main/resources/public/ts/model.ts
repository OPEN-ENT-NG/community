Community.prototype.getDetails = function(cb){
    http().get('/community/' + this.id + '/details').done(function(data){
        console.log(data);
        this.groups = {
            read: _.findWhere(data.groups, { type: 'read' }).id,
            contrib: _.findWhere(data.groups, { type: 'contrib' }).id,
            manager: _.findWhere(data.groups, { type: 'manager' }).id
        }
        if(typeof cb === 'function'){
            cb();
        }
    }.bind(this));
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

	this.website.sync();
	this.website.one('sync', function(){
		this.website.synchronizeRights();
	}.bind(this))
};