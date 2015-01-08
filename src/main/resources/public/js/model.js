function Community() {
	this.members = {
		read: [],
		contrib: [],
		manager: []
	}
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
	http().putJson('/community/' + this._id, this).done(function(data){
		if(typeof callback === 'function'){
			callback();
		}
	});
};

Community.prototype.delete = function(callback) {
	http().delete('/community/' + this._id).done(function(data){
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
	// TODO : API fecth possible members...
	
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