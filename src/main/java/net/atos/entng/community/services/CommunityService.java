package net.atos.entng.community.services;

import fr.wseduc.webutils.Either;
import org.entcore.common.user.UserInfos;
import org.vertx.java.core.Handler;
import org.vertx.java.core.json.JsonArray;
import org.vertx.java.core.json.JsonObject;

public interface CommunityService {

	void create(JsonObject data, UserInfos user, Handler<Either<String, JsonObject>> handler);

	void update(String id, JsonObject data, Handler<Either<String, JsonObject>> handler);

	void delete(String id, Handler<Either<String, JsonObject>> handler);

	void get(String id, UserInfos user, Handler<Either<String, JsonObject>> handler);

	void get(String id, Handler<Either<String, JsonObject>> handler);

	void list(UserInfos user, Handler<Either<String, JsonArray>> handler);

	void manageUsers(String id, JsonObject users, Handler<Either<String, JsonObject>> handler);

	void listUsers(String id, JsonArray types, Handler<Either<String, JsonObject>> handler);

}
