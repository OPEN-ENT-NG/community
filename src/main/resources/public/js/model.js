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
	return {
		name: this.name,
		description : this.description,
		icon: this.icon
	}
};

Community.prototype.getMembers = function(callback) {
	var community = this;
	http().get('/community/' + this.id + '/users').done(function(users){
		if (users.manager) {
			community.members.manager = _.filter(users.manager, function(user) { return user.id !== model.me.userId; });
		}
		if (users.contrib) {
			community.members.contrib = _.filter(users.contrib, function(user) { return user.id !== model.me.userId; });
		}
		if (users.read) {
			community.members.read = _.filter(users.read, function(user) { return user.id !== model.me.userId; });
		}
		// TODO : API should also fecth possible members...
		if(typeof callback === 'function'){
			callback();
		}
	});
};

Community.prototype.addMembers = function(roles, callback) {

};

Community.prototype.removeMembers = function(members, callback) {

};


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