Behaviours.register('community', {
	rights: {
		workflow: {
			create: 'net.atos.entng.community.controllers.CommunityController|create'
		},
		resource: {
			manage: { right: 'net-atos-entng-community-controllers-CommunityController|update' },
			share: { right: 'net-atos-entng-community-controllers-CommunityController|shareCategory' }
		}
	}
});