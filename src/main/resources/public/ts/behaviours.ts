import { Behaviours } from 'entcore';
import { _ } from 'entcore/libs/underscore/underscore';
import http from 'axios';

console.log('community behaviours loaded');

Behaviours.register('community', {
	rights: {
		workflow: {
			create: 'net.atos.entng.community.controllers.CommunityController|create',
			listAllPages: 'net.atos.entng.community.controllers.CommunityController|listAllPages',
			view: 'net.atos.entng.community.controllers.CommunityController|view'
		},
		resource: {
			update: 'net-atos-entng-community-controllers-PagesController|update'
		}
	},
	// Used by component "linker" to load community pages
	loadResources: async function(callback){
        let response = await http.get('/community/listallpages');
        let communities = response.data;
		var pagesArray = _.map(communities, function(community) {
            var communityIcon;
            if (typeof (community.thumbnail) === 'undefined' || community.thumbnail === '' ) {
                communityIcon = '/img/icons/glyphicons_036_file.png';
            }
            else {
                communityIcon = community.thumbnail + '?thumbnail=48x48';
            }

            return {
                title : community.name,
                icon : communityIcon,
                path : '/pages#/website/' + community.pageId,
                community_id : community.id,
                id : community.id
            };
        });

		this.resources = _.flatten(pagesArray);
		if(typeof callback === 'function'){
			callback(this.resources);
		}
	},

	// Used by component "linker" to create a new page
	create: async function(page, callback){
		page.loading = true;
		var data = {
			title : page.title,
			content : ''
		};

        await http.post('/community/' + page.wiki_id + '/page', data);

		this.loadResources(callback);
		page.loading = false;
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
				init: async function(){
                    this.communities = [];
                    this.community = this.source.community;
                    let response = await http.get('/community/list');
					this.communities = response.data;
					 
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
