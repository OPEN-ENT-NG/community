package net.atos.entng.community;

import net.atos.entng.community.controllers.CommunityController;
import net.atos.entng.community.events.CommunityRepositoryEvents;
import net.atos.entng.community.filters.ManagerFilter;
import net.atos.entng.community.services.impl.DefaultCommunityService;

import org.entcore.common.events.EventStoreFactory;
import org.entcore.common.http.BaseServer;
import org.entcore.common.notification.TimelineHelper;


public class Community extends BaseServer {

	@Override
	public void start() {
		super.start();

		TimelineHelper timeline = new TimelineHelper(vertx, vertx.eventBus(), this.container);

		EventStoreFactory eventStoreFactory = EventStoreFactory.getFactory();
		eventStoreFactory.setContainer(container);
		eventStoreFactory.setVertx(vertx);
		setRepositoryEvents(new CommunityRepositoryEvents(vertx.eventBus()));

		setDefaultResourceFilter(new ManagerFilter());
		CommunityController communityController = new CommunityController(timeline);
		communityController.setCommunityService(new DefaultCommunityService());
		addController(communityController);
	}

}
