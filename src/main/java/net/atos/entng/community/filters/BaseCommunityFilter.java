package net.atos.entng.community.filters;

import fr.wseduc.webutils.http.Binding;
import org.entcore.common.http.filter.ResourcesProvider;
import org.entcore.common.neo4j.Neo4j;
import org.entcore.common.user.UserInfos;
import org.vertx.java.core.Handler;
import org.vertx.java.core.eventbus.Message;
import org.vertx.java.core.http.HttpServerRequest;
import org.vertx.java.core.json.JsonArray;
import org.vertx.java.core.json.JsonObject;

public abstract class BaseCommunityFilter implements ResourcesProvider {

	@Override
	public void authorize(final HttpServerRequest request, Binding binding, UserInfos user, final Handler<Boolean> handler) {
		String id = request.params().get("id");
		if (id == null || id.trim().isEmpty()) {
			handler.handle(false);
			return;
		}
		String query =
				"MATCH (:Community {id : {id}})<-[:DEPENDS]-(:CommunityGroup {type : {type}})" +
				"<-[:IN]-(:User { id : {userId}}) " +
				"RETURN COUNT(*) > 0 as exists ";
		JsonObject params = new JsonObject()
				.putString("id", id)
				.putString("userId", user.getUserId())
				.putString("type", groupRoleType());
		request.pause();
		Neo4j.getInstance().execute(query, params, new Handler<Message<JsonObject>>() {
			@Override
			public void handle(Message<JsonObject> r) {
				request.resume();
				JsonArray res = r.body().getArray("result");
				handler.handle(
						"ok".equals(r.body().getString("status")) &&
						res.size() == 1 && ((JsonObject) res.get(0)).getBoolean("exists", false)
				);
			}
		});
	}

	protected abstract String groupRoleType();

}
