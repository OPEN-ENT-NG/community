/*
 * Copyright © Région Nord Pas de Calais-Picardie,  Département 91, Région Aquitaine-Limousin-Poitou-Charentes, 2016.
 *
 * This file is part of OPEN ENT NG. OPEN ENT NG is a versatile ENT Project based on the JVM and ENT Core Project.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation (version 3 of the License).
 *
 * For the sake of explanation, any module that communicate over native
 * Web protocols, such as HTTP, with OPEN ENT NG is outside the scope of this
 * license and could be license under its own terms. This is merely considered
 * normal use of OPEN ENT NG, and does not fall under the heading of "covered work".
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 */

package net.atos.entng.community.services;

import fr.wseduc.webutils.Either;
import org.entcore.common.user.UserInfos;
import io.vertx.core.Handler;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;

public interface CommunityService {

	void create(JsonObject data, UserInfos user, Handler<Either<String, JsonObject>> handler);

	void update(String id, JsonObject data, Handler<Either<String, JsonObject>> handler);

	void delete(String id, Handler<Either<String, JsonObject>> handler);

	void get(String id, UserInfos user, Handler<Either<String, JsonObject>> handler);

	void get(String id, Handler<Either<String, JsonObject>> handler);

	void list(UserInfos user, Handler<Either<String, JsonArray>> handler);

	void manageUsers(String id, JsonObject users, Handler<Either<String, JsonObject>> handler);

	void listUsers(String id, JsonArray types, Handler<Either<String, JsonObject>> handler);

	void updateShare(String pageId, String userId, final JsonObject value, final  Handler<Either<String, JsonObject>> handler);

}
