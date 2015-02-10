package net.atos.entng.community.events;

import static org.entcore.common.neo4j.Neo4jResult.validResultHandler;

import org.entcore.common.neo4j.Neo4j;
import org.entcore.common.user.RepositoryEvents;
import org.vertx.java.core.Handler;
import org.vertx.java.core.eventbus.EventBus;
import org.vertx.java.core.json.JsonArray;
import org.vertx.java.core.json.JsonObject;
import org.vertx.java.core.logging.Logger;
import org.vertx.java.core.logging.impl.LoggerFactory;

import fr.wseduc.webutils.Either;

public class CommunityRepositoryEvents implements RepositoryEvents {

	private static final Logger log = LoggerFactory.getLogger(CommunityRepositoryEvents.class);
	private final Neo4j neo4j = Neo4j.getInstance();
	private final EventBus eb;

	public CommunityRepositoryEvents(EventBus eb) {
		this.eb = eb;
	}

	@Override
	public void exportResources(String exportId, String userId, JsonArray groups, String exportPath, String locale) {
		// TODO Implement export
		log.error("Event [exportResources] is not implemented");
	}

	@Override
	public void deleteGroups(JsonArray groups) {
		// No group members in Community
		log.info("Event [deleteGroups] : no goup to delete");
	}

	@Override
	public void deleteUsers(JsonArray users) {
		// Users are already deleted in Graph - Control and delete communities with no managers
		JsonObject params = new JsonObject().putString("type", "manager");
		String query = "MATCH (c:Community)<-[:DEPENDS]-(gm:CommunityGroup {type : {type}}) "
					 + "OPTIONAL MATCH gm<-[:IN]-(um:User) "
					 + "OPTIONAL MATCH c<-[r:DEPENDS]-(g:CommunityGroup)<-[r2:IN|COMMUNIQUE]-() "
					 + "WITH c, c.pageId as pageId, gm, r, g, r2, COUNT(um) AS managers WHERE managers = 0 "
					 + "DELETE c, r, g, r2 "
					 + "RETURN DISTINCT pageId";
		neo4j.execute(query, params, validResultHandler(new Handler<Either<String, JsonArray>>(){
			@Override
			public void handle(Either<String, JsonArray> event) {
				if (event.isRight()) {
					JsonArray pageIds = event.right().getValue();
					for (Object o : pageIds) {
						if (!(o instanceof JsonObject)) continue;
						JsonObject page = (JsonObject) o;
						if (!page.containsField("pageId")) continue;

						// Delete the page
						JsonObject deletePage = new JsonObject()
							.putString("action", "delete")
							.putString("pageId", page.getString("pageId"))
							.putBoolean("deleteResources", true);
						eb.send("pages", deletePage);
					}
					log.info("Deleted communities (community, page and resources) : " + pageIds.toList().toString());
				}
				else {
					log.error("Failed to delete communities : " + event.left().getValue());
				}
			}
		}));
	}

}