package net.atos.entng.community.services.impl;

import fr.wseduc.webutils.Either;
import net.atos.entng.community.services.CommunityService;

import org.entcore.common.neo4j.Neo4j;
import org.entcore.common.neo4j.StatementsBuilder;
import org.entcore.common.user.UserInfos;
import org.vertx.java.core.Handler;
import org.vertx.java.core.eventbus.Message;
import org.vertx.java.core.json.JsonArray;
import org.vertx.java.core.json.JsonObject;

import java.util.UUID;

import static org.entcore.common.neo4j.Neo4jResult.validEmptyHandler;
import static org.entcore.common.neo4j.Neo4jResult.validResultHandler;
import static org.entcore.common.neo4j.Neo4jResult.validUniqueResultHandler;
import static org.entcore.common.neo4j.Neo4jUtils.nodeSetPropertiesFromJson;

public class DefaultCommunityService implements CommunityService {

	private Neo4j neo4j = Neo4j.getInstance();

	@Override
	public void create(JsonObject data, UserInfos user, Handler<Either<String, JsonObject>> handler) {
		String query =
				"CREATE (c:Community {props}), " +
				"c<-[:DEPENDS]-(cr:CommunityGroup:Group:Visible {name : c.name + '-read', type : 'read'}), " +
				"c<-[:DEPENDS]-(cc:CommunityGroup:Group:Visible {name : c.name + '-contrib', type : 'contrib', users : ''}), " +
				"c<-[:DEPENDS]-(cm:CommunityGroup:Group:Visible {name : c.name + '-manager', type : 'manager', users : ''}) " +
				"SET cr.id = id(cr)+'-'+timestamp(), " +
				"cc.id = id(cc)+'-'+timestamp(), cm.id = id(cm)+'-'+timestamp() " +
				"WITH c, cm, cr, cc " +
				"MATCH (u:User {id : {userId}}) " +
				"CREATE u-[:IN]->cm, u-[:COMMUNIQUE]->cm, " +
				"cc-[:COMMUNIQUE]->cr, cc-[:COMMUNIQUE]->cm, " +
				"cm-[:COMMUNIQUE]->cr, cm-[:COMMUNIQUE]->cc " +
				"RETURN c.id as id, cr.id as read, cc.id as contrib, cm.id as manager";
		JsonObject params = new JsonObject()
				.putString("userId", user.getUserId())
				.putObject("props", data.putString("id", UUID.randomUUID().toString()));
		neo4j.execute(query, params, validUniqueResultHandler(handler));
	}

	@Override
	public void update(String id, JsonObject data, Handler<Either<String, JsonObject>> handler) {
		String name = data.getString("name");
		String query;
		if (name != null && !name.trim().isEmpty()) {
			query = "MATCH (c:Community { id : {id}})<-[:DEPENDS]-(g:CommunityGroup) " +
					"SET " + nodeSetPropertiesFromJson("c", data) +
					", g.name = {name} + '-' + LAST(SPLIT(g.name, '-')) " +
					"RETURN DISTINCT c.id as id, c.pageId as pageId";
		} else {
			query = "MATCH (c:Community { id : {id}}) " +
					"SET " + nodeSetPropertiesFromJson("c", data) + " " +
					"RETURN c.id as id";
		}
		data.putString("id", id);
		neo4j.execute(query, data, validUniqueResultHandler(handler));
	}

	@Override
	public void delete(String id, Handler<Either<String, JsonObject>> handler) {
		StatementsBuilder sb = new StatementsBuilder();
		JsonObject params = new JsonObject().putString("id", id);
		sb.add("MATCH (c:Community { id : {id}}) RETURN c.pageId as pageId", params);
		String query =
				"MATCH (c:Community { id : {id}})<-[r:DEPENDS]-(g:CommunityGroup) " +
				"OPTIONAL MATCH g<-[r2:IN|COMMUNIQUE]-() " +
				"DELETE c, r, g, r2 ";
		sb.add(query, params);
		neo4j.executeTransaction(sb.build(), null, true, validUniqueResultHandler(0, handler));
	}

	@Override
	public void list(UserInfos user, Handler<Either<String, JsonArray>> handler) {
		String query =
				"MATCH (u:User {id : {userId}})-[:IN]->(g:CommunityGroup)-[:DEPENDS]->(c:Community) " +
				"RETURN c.id as id, c.name as name, c.description as description, " +
				"c.icon as icon, c.pageId as pageId, COLLECT(g.type) as types, COLLECT(distinct {id: g.id, type: g.type, name: g.name}) as groups ";
		JsonObject params = new JsonObject().putString("userId", user.getUserId());
		neo4j.execute(query, params, validResultHandler(handler));
	}

	@Override
	public void get(String id, UserInfos user, Handler<Either<String,JsonObject>> handler) {
		String query =
				"MATCH (u:User {id : {userId}})-[:IN]->(g:CommunityGroup)-[:DEPENDS]->(c:Community {id: {id}}) " +
				"RETURN c.id as id, c.name as name, c.description as description, " +
				"c.icon as icon, c.pageId as pageId, COLLECT(g.type) as types, COLLECT(distinct {id: g.id, type: g.type, name: g.name}) as groups ";
		JsonObject params = new JsonObject().putString("userId", user.getUserId()).putString("id", id);
		neo4j.execute(query, params, validUniqueResultHandler(handler));
	};

	@Override
	public void manageUsers(String id, JsonObject users, Handler<Either<String, JsonObject>> handler) {
		StatementsBuilder sb = new StatementsBuilder();
		JsonObject params = new JsonObject().putString("id", id);

		JsonArray delete = users.getArray("delete");
		if (delete != null && delete.size() > 0) {
			users.removeField("delete");
			final String query =
					"MATCH (c:Community {id : {id}})<-[:DEPENDS]-(:CommunityGroup)<-[r:IN|COMMUNIQUE]-(u:User) " +
					"WHERE u.id IN {delete} " +
					"DELETE r";
			sb.add(query, params.copy().putArray("delete", delete));
		}
		final String query =
				"MATCH (c:Community {id : {id}})<-[:DEPENDS]-(g:CommunityGroup {type: {type}}), (u:User) " +
				"WHERE u.id IN {users} " +
				"CREATE UNIQUE g<-[:IN]-u";
		for (String attr: users.getFieldNames()) {
			String q = ("contrib".equals(attr) || "manager".equals(attr)) ?
					query + ", g<-[:COMMUNIQUE]-u" : query;
			sb.add(q, params.copy().putString("type", attr).putArray("users", users.getArray(attr)));
		}
		neo4j.executeTransaction(sb.build(), null, true, validEmptyHandler(handler));
	}

	@Override
	public void listUsers(String id, final JsonArray types, final Handler<Either<String, JsonObject>> handler) {
		String query =
				"MATCH (:Community {id: {id}})<-[:DEPENDS]-(:CommunityGroup {type : {type}})<-[:IN]-(u:User) " +
				"RETURN u.id as id, u.displayName as displayName ";
		JsonObject params = new JsonObject().putString("id", id);
		StatementsBuilder sb = new StatementsBuilder();
		for (Object o: types) {
			if (!(o instanceof String)) continue;
			sb.add(query, params.copy().putString("type", o.toString()));
		}
		neo4j.executeTransaction(sb.build(), null, true, new Handler<Message<JsonObject>>() {
			@Override
			public void handle(Message<JsonObject> r) {
				if ("ok".equals(r.body().getString("status"))) {
					JsonArray results = r.body().getArray("results");
					JsonObject res = new JsonObject();
					for (int i = 0; i < results.size(); i++) {
						res.putArray(types.<String>get(i), results.<JsonArray>get(i));
					}
					handler.handle(new Either.Right<String, JsonObject>(res));
				} else {
					handler.handle(new Either.Left<String, JsonObject>(r.body().getString("message")));
				}
			}
		});
	}

}
