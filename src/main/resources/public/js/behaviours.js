console.log('community behaviours loaded');

Behaviours.register('community', {
	rights: {
		workflow: {
			create: 'net.atos.entng.community.controllers.CommunityController|create'
		}
	},

	sniplets: {
		message: {
			title: 'Message Accueil',
			description: 'Message de la page d\'accueil modifiable',
			//hidden: true, // Attribute to hide in interfaces (pages...) - sniplet can only be added automatically
			controller: {

                initSource : function() {
                    this.setSnipletSource({
						content: ""
					});
                },

                init : function() {
                	if (! this.display) {
                		this.display = {};
                	}
                    this.editedSource = { content: "" };
                },

                edit : function() {
                    this.editedSource.content = this.source.content;
                	this.display.editing = true;
                },

                save : function() {
                    this.source.content = this.editedSource.content;
                    var that = this;
                	this.snipletResource.save(function(){
                        that.editedSource = { content: "" };
                    });
                    delete this.display.editing;
                },

                cancel : function() {
                	this.editedSource = { content: "" };
                	delete this.display.editing;
                }
			}
		},
		navslider: {
			title: 'sniplet.navslider.title',
			description: 'sniplet.navslider.description',
			hidden: true,
			controller: {
				init: function(){
					var that = this;
					this.communities = [];
					http().get('/community/list').done(function(data){
						that.communities = data;
					});
					 this.community = this.source.community;
				},
				initSource: function(){
					this.setSnipletSource({});
				},
				openCommunity: function(community){
					window.location.href = '/pages#/website/' + community.pageId;
					window.location.reload();
				}
			}
		}
	}

});
