package net.atos.entng.community;

import net.atos.entng.community.controllers.CommunityController;

import org.entcore.common.http.BaseServer;
import org.entcore.common.http.filter.ShareAndOwner;
import org.entcore.common.mongodb.MongoDbConf;


public class Community extends BaseServer {

	@Override
	public void start() {
		super.start();
		setDefaultResourceFilter(new ShareAndOwner());
		addController(new CommunityController());
	}

}
