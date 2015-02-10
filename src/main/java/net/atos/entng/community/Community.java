package net.atos.entng.community;

import net.atos.entng.community.controllers.CommunityController;
import net.atos.entng.community.events.CommunityRepositoryEvents;
import net.atos.entng.community.filters.ManagerFilter;
import net.atos.entng.community.services.impl.DefaultCommunityService;

import org.entcore.common.events.EventStoreFactory;
import org.entcore.common.http.BaseServer;
import org.entcore.common.user.RepositoryHandler;


public class Community extends BaseServer {

	@Override
	public void start() {
		super.start();

		EventStoreFactory eventStoreFactory = EventStoreFactory.getFactory();
		eventStoreFactory.setContainer(container);
		eventStoreFactory.setVertx(vertx);
		vertx.eventBus().registerHandler("user.repository", new RepositoryHandler(new CommunityRepositoryEvents(vertx.eventBus())));

		setDefaultResourceFilter(new ManagerFilter());
		CommunityController communityController = new CommunityController();
		communityController.setCommunityService(new DefaultCommunityService());
		addController(communityController);
	}

}
