/*
 * Copyright © WebServices pour l'Éducation, 2014
 *
 * This file is part of ENT Core. ENT Core is a versatile ENT engine based on the JVM.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation (version 3 of the License).
 *
 * For the sake of explanation, any module that communicate over native
 * Web protocols, such as HTTP, with ENT Core is outside the scope of this
 * license and could be license under its own terms. This is merely considered
 * normal use of ENT Core, and does not fall under the heading of "covered work".
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 */

package net.atos.entng.community.filters;

import com.mongodb.DBObject;
import fr.wseduc.mongodb.MongoQueryBuilder;
import fr.wseduc.webutils.http.Binding;
import org.bson.conversions.Bson;
import org.entcore.common.http.filter.MongoAppFilter;
import org.entcore.common.http.filter.ResourcesProvider;
import org.entcore.common.mongodb.MongoDbConf;
import org.entcore.common.service.VisibilityFilter;
import org.entcore.common.user.UserInfos;
import io.vertx.core.Handler;
import io.vertx.core.http.HttpServerRequest;

import java.util.ArrayList;
import java.util.List;

import static com.mongodb.client.model.Filters.*;

public class PageReadFilter implements ResourcesProvider {

	private MongoDbConf conf = MongoDbConf.getInstance();

	@Override
	public void authorize(HttpServerRequest request, Binding binding, UserInfos user, Handler<Boolean> handler) {
		String sharedMethod = binding.getServiceMethod().replaceAll("\\.", "-");
		String id = request.params().get(conf.getResourceIdLabel());
		if (id != null && !id.trim().isEmpty()) {
			List<Bson> groups = new ArrayList<>();
			groups.add(and(
				eq("userId",user.getUserId()),
				eq(sharedMethod, true)
			));
			for (String gpId: user.getGroupsIds()) {
				groups.add(and(
					eq("groupId",gpId),
					eq(sharedMethod, true)
				));
			}
			final Bson query = and(
				eq("_id",id),
				or(
					eq("owner.userId",user.getUserId()),
					eq("visibility",VisibilityFilter.PUBLIC.name()),
					eq("visibility",VisibilityFilter.PROTECTED.name()),
					elemMatch("shared", or(groups))
				)
			);
			MongoAppFilter.executeCountQuery(request, conf.getCollection(),
					MongoQueryBuilder.build(query), 1, handler);
		} else {
			handler.handle(false);
		}
	}

}
