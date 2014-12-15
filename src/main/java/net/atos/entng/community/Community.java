package net.atos.entng.community;

import net.atos.entng.community.controllers.CommunityController;
import net.atos.entng.community.filters.ManagerFilter;
import net.atos.entng.community.services.impl.DefaultCommunityService;
import org.entcore.common.http.BaseServer;


public class Community extends BaseServer {

	@Override
	public void start() {
		super.start();
		setDefaultResourceFilter(new ManagerFilter());
		CommunityController communityController = new CommunityController();
		communityController.setCommunityService(new DefaultCommunityService());
		addController(communityController);
	}

}
