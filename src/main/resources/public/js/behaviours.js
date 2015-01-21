Behaviours.register('community', {
	rights: {
		workflow: {
			create: 'net.atos.entng.community.controllers.CommunityController|create'
		}
	}
	/*
	sniplets: {
		menu: {
			title: 'Menu',
			description: 'Navigation specifique communautes',
			hidden: true, // Attribute to hide in interfaces (pages...) - sniplet can only be added automatically
			controller: {
				...
			}
		}
	}
	*/
});