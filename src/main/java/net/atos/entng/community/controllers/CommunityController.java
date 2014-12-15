package net.atos.entng.community.controllers;

import fr.wseduc.rs.Get;
import fr.wseduc.security.SecuredAction;
import fr.wseduc.webutils.http.BaseController;
import org.vertx.java.core.http.HttpServerRequest;

public class CommunityController extends BaseController {

	@Get("")
	@SecuredAction("community.view")
	public void view(HttpServerRequest request) {
		renderView(request);
	}

}
