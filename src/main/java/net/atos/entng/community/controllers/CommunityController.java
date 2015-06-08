package net.atos.entng.community.controllers;

import static org.entcore.common.http.response.DefaultResponseHandler.arrayResponseHandler;
import static org.entcore.common.http.response.DefaultResponseHandler.defaultResponseHandler;
import static org.entcore.common.http.response.DefaultResponseHandler.leftToResponse;
import static org.entcore.common.http.response.DefaultResponseHandler.notEmptyResponseHandler;
import static org.entcore.common.user.UserUtils.getUserInfos;

import java.util.ArrayList;
import java.util.List;

import net.atos.entng.community.services.CommunityService;

import org.entcore.common.notification.TimelineHelper;
import org.entcore.common.user.UserInfos;
import org.entcore.common.user.UserUtils;
import org.vertx.java.core.Handler;
import org.vertx.java.core.eventbus.Message;
import org.vertx.java.core.http.HttpServerRequest;
import org.vertx.java.core.json.JsonArray;
import org.vertx.java.core.json.JsonObject;

import fr.wseduc.rs.Delete;
import fr.wseduc.rs.Get;
import fr.wseduc.rs.Post;
import fr.wseduc.rs.Put;
import fr.wseduc.security.ActionType;
import fr.wseduc.security.SecuredAction;
import fr.wseduc.webutils.Either;
import fr.wseduc.webutils.I18n;
import fr.wseduc.webutils.http.BaseController;
import fr.wseduc.webutils.http.Renders;
import fr.wseduc.webutils.request.RequestUtils;

public class CommunityController extends BaseController {

	private CommunityService communityService;
	private final TimelineHelper timeline;
	private static final String NOTIFICATION_TYPE = "COMMUNITY";
	private static final JsonArray resourcesTypes = new JsonArray().add("read").add("contrib").add("manager");

	public CommunityController(TimelineHelper helper) {
		timeline = helper;
	}

	@Get("")
	@SecuredAction("community.view")
	public void view(HttpServerRequest request) {
		renderView(request);
	}

	@Post("")
	@SecuredAction("community.create")
	public void create(final HttpServerRequest request) {
		RequestUtils.bodyToJson(request, pathPrefix + "create", new Handler<JsonObject>() {
			@Override
			public void handle(final JsonObject body) {
				UserUtils.getUserInfos(eb, request, new Handler<UserInfos>() {
					@Override
					public void handle(final UserInfos user) {
						if (user != null) {
							CommunityController.this.create(user, request, body);
						} else {
							unauthorized(request);
						}
					}
				});
			}
		});
	}

	private void create(final UserInfos user, final HttpServerRequest request, final JsonObject body) {
		UserUtils.getSession(eb, request, new Handler<JsonObject>() {
			@Override
			public void handle(JsonObject u) {
				JsonObject p = new JsonObject()
						.putString("title", body.getString("name"))
						.putBoolean("hideInPages", true)
						.putArray("pages", new JsonArray())
						.putObject("referencedResources", new JsonObject());
				JsonObject pages = new JsonObject()
						.putString("action", "create")
						.putObject("user", u)
						.putObject("page", p);
				eb.send("pages", pages, new Handler<Message<JsonObject>>() {
					@Override
					public void handle(Message<JsonObject> message) {
						final JsonObject result = message.body().getObject("result");
						if ("ok".equals(message.body().getString("status")) && result != null &&
								!result.getString("_id", "").trim().isEmpty()) {
							final String pageId = result.getString("_id");
							body.putString("pageId", pageId);
							communityService.create(body, user, new Handler<Either<String, JsonObject>>() {
								@Override
								public void handle(Either<String, JsonObject> r) {
									if (r.isRight()) {
										sharePage(pageId, user.getUserId(), r.right().getValue());
										createPageMarkups(pageId);
										r.right().getValue().putString("pageId", pageId);
										renderJson(request, r.right().getValue(), 201);
									} else {
										leftToResponse(request, r.left());
										eb.send("pages", new JsonObject().putString("action", "delete")
												.putString("pageId", pageId));
									}
								}
							});
						} else {
							renderError(request, message.body());
						}
					}
				});
			}
		});
	}

	private void sharePage(String pageId, String userId, final JsonObject value) {
		final JsonObject share = new JsonObject().putString("action", "share")
				.putString("pageId", pageId).putString("userId", userId);

		JsonObject r = share
				.putString("groupId", value.getString("read"))
				.putArray("actions", new JsonArray().add("fr-wseduc-pages-controllers-PagesController|get"));
		eb.send("pages", r, new Handler<Message<JsonObject>>() {
			@Override
			public void handle(Message<JsonObject> message) {
				if (!"ok".equals(message.body().getString("status"))) {
					log.error("Error when share page : " + message.body().getString("message"));
				}
				JsonObject c = share
						.putString("groupId", value.getString("contrib"))
						.putArray("actions", new JsonArray()
										.add("fr-wseduc-pages-controllers-PagesController|get")
										.add("fr-wseduc-pages-controllers-PagesController|update")
						);
				eb.send("pages", c, new Handler<Message<JsonObject>>() {
					@Override
					public void handle(Message<JsonObject> message) {
						if (!"ok".equals(message.body().getString("status"))) {
							log.error("Error when share page : " + message.body().getString("message"));
						}
						JsonObject m = share
								.putString("groupId", value.getString("manager"))
								.putArray("actions", new JsonArray()
												.add("fr-wseduc-pages-controllers-PagesController|get")
												.add("fr-wseduc-pages-controllers-PagesController|update")
												.add("fr-wseduc-pages-controllers-PagesController|delete")
								);
						eb.send("pages", m, new Handler<Message<JsonObject>>() {
							@Override
							public void handle(Message<JsonObject> message) {
								if (!"ok".equals(message.body().getString("status"))) {
									log.error("Error when share page : " + message.body().getString("message"));
								}
							}
						});
					}
				});
			}
		});
	}

	private void createPageMarkups(String pageId) {
		JsonObject updatePage = new JsonObject()
		.putString("action", "update")
		.putString("pageId", pageId)
		.putObject("page", new JsonObject()
			.putObject("markups", new JsonObject()
				.putArray("view", new JsonArray()
					.addObject(new JsonObject()
						.putString("label", "community.edit")
						.putString("resourceRight", "share")
						.putString("href", "/community#/edit/" + pageId))
					.addObject(new JsonObject()
						.putString("label", "community.back.to")
						.putString("resourceRight", "read")
						.putString("href", "/community#/list")))));
		eb.send("pages", updatePage, new Handler<Message<JsonObject>>() {
			@Override
			public void handle(Message<JsonObject> message) {
				if (!"ok".equals(message.body().getString("status"))) {
					log.error(message.body().getString("message"));
				}
			}
		});
	}

	@Put("/:id")
	@SecuredAction(value = "", type = ActionType.RESOURCE)
	public void update(final HttpServerRequest request) {
		RequestUtils.bodyToJson(request, pathPrefix + "update", new Handler<JsonObject>() {
			@Override
			public void handle(JsonObject body) {
				if (body.size() > 0) {
					String name = body.getString("name");
					Handler<Either<String, JsonObject>> handler = (name != null && !name.trim().isEmpty()) ?
							updatePageHandler(request, name) : notEmptyResponseHandler(request);
					communityService.update(request.params().get("id"), body, handler);
				} else {
					badRequest(request, "empty.json");
				}
			}
		});
	}

	private Handler<Either<String, JsonObject>> updatePageHandler(final HttpServerRequest request, final String name) {
		return new Handler<Either<String, JsonObject>>() {
			@Override
			public void handle(final Either<String, JsonObject> r) {
				if (r.isRight()) {
					String pageId = r.right().getValue().getString("pageId");
					r.right().getValue().removeField("pageId");
					JsonObject updatePage = new JsonObject()
							.putString("action", "update")
							.putString("pageId", pageId)
							.putObject("page", new JsonObject()
								.putString("title", name)
								.putBoolean("hideInPages", true)
								.putObject("markups", new JsonObject()
								.putArray("view", new JsonArray()
									.addObject(new JsonObject()
										.putString("label", "community.edit")
										.putString("href", "/community#/edit/" + pageId))
									.addObject(new JsonObject()
										.putString("label", "community.back.to")
										.putString("href", "/community#/list")))));
					eb.send("pages", updatePage, new Handler<Message<JsonObject>>() {
						@Override
						public void handle(Message<JsonObject> message) {
							if (!"ok".equals(message.body().getString("status"))) {
								log.error(message.body().getString("message"));
							}
							renderJson(request, r.right().getValue());
						}
					});
				} else {
					leftToResponse(request, r.left());
				}
			}
		};
	}

	@Delete("/:id")
	@SecuredAction(value = "", type = ActionType.RESOURCE)
	public void delete(final HttpServerRequest request) {
		communityService.delete(request.params().get("id"), new Handler<Either<String, JsonObject>>() {
			@Override
			public void handle(Either<String, JsonObject> r) {
				if (r.isRight()) {
					JsonObject deletePage = new JsonObject()
							.putString("action", "delete")
							.putString("pageId", r.right().getValue().getString("pageId"))
							.putBoolean("deleteResources", true);
					eb.send("pages", deletePage);
					ok(request);
				} else {
					leftToResponse(request, r.left());
				}
			}
		});
	}

	@Get("/list")
	@SecuredAction(value = "", type = ActionType.AUTHENTICATED)
	public void list(final HttpServerRequest request) {
		UserUtils.getUserInfos(eb, request, new Handler<UserInfos>() {
			@Override
			public void handle(UserInfos user) {
				if (user != null) {
					communityService.list(user, arrayResponseHandler(request));
				} else {
					unauthorized(request);
				}
			}
		});
	}

	@Put("/:id/users")
	@SecuredAction(value = "", type = ActionType.RESOURCE)
	public void manageUsers(final HttpServerRequest request) {
		RequestUtils.bodyToJson(request, pathPrefix + "manageUsers", new Handler<JsonObject>() {
			@Override
			public void handle(final JsonObject body) {
				if (body.size() > 0) {
					communityService.manageUsers(request.params().get("id"), body, new Handler<Either<String, JsonObject>>() {
						@Override
						public void handle(Either<String, JsonObject> event) {
							if (event.isRight()) {
								UserUtils.getUserInfos(eb, request, new Handler<UserInfos>() {
									@Override
									public void handle(final UserInfos user) {
										communityService.get(request.params().get("id"), user, new Handler<Either<String,JsonObject>>() {
											public void handle(Either<String, JsonObject> event) {
												if (event.isRight()) {
													//Populate notification parameters
													JsonObject params = new JsonObject()
														.putString("resourceName", event.right().getValue().getString("name", ""))
														.putString("resourceUri", event.right().getValue().getString("pageId", ""))
														.putString("uri", "/userbook/annuaire#" + user.getUserId() + "#" + user.getType())
														.putString("username", user.getUsername());

													//Get user list
													ArrayList<String> readList = new ArrayList<>();
													ArrayList<String> contribList = new ArrayList<>();
													ArrayList<String> managerList = new ArrayList<>();
													for(String field : body.getFieldNames()){
														if("read".equals(field))
															readList.addAll(body.getArray(field).toList());
														else if("contrib".equals(field))
															contribList.addAll(body.getArray(field).toList());
														else if("manager".equals(field))
															managerList.addAll(body.getArray(field).toList());
													}

													if(readList.size() > 0){
														timeline.notifyTimeline(
																request,
																user,
																NOTIFICATION_TYPE,
																NOTIFICATION_TYPE + "_SHARE",
																readList,
																request.params().get("id"),
																"notify-share.html",
																params.putString("shareType", "read"));
													}
													if(contribList.size() > 0){
														params.removeField("shareType");
														timeline.notifyTimeline(
																request,
																user,
																NOTIFICATION_TYPE,
																NOTIFICATION_TYPE + "_SHARE",
																contribList,
																request.params().get("id"),
																"notify-share.html",
																params.putString("shareType", "contrib"));
													}
													if(managerList.size() > 0){
														params.removeField("shareType");
														timeline.notifyTimeline(
																request,
																user,
																NOTIFICATION_TYPE,
																NOTIFICATION_TYPE + "_SHARE",
																managerList,
																request.params().get("id"),
																"notify-share.html",
																params.putString("shareType", "manager"));
													}
												}
											}
										});
									}
								});
								Renders.renderJson(request, event.right().getValue(), 200);
							} else {
								JsonObject error = new JsonObject()
										.putString("error", event.left().getValue());
								Renders.renderJson(request, error, 400);
							}
						}
					});
				} else {
					badRequest(request, "empty.json");
				}
			}
		});
	}

	@Get("/:id/users")
	@SecuredAction(value = "", type = ActionType.RESOURCE)
	public void listUsers(final HttpServerRequest request) {
		List<String> t = request.params().getAll("type");
		JsonArray types = (t != null && !t.isEmpty()) ?
				new JsonArray(t.toArray()) : resourcesTypes; //new JsonArray(RightsController.allowedSharingRights.toArray());
		communityService.listUsers(request.params().get("id"), types, new Handler<Either<String, JsonObject>>(){
			@Override
			public void handle(final Either<String, JsonObject> event) {
				final Handler<Either<String, JsonObject>> handler = defaultResponseHandler(request);
				if (event.isRight()) {
					final JsonObject res = event.right().getValue();
					listVisible(request, I18n.acceptLanguage(request), new Handler<JsonObject>(){
						@Override
						public void handle(final JsonObject visibles) {
							res.putObject("visibles", visibles);
							handler.handle(event);
						}
					});
				}
				else {
					handler.handle(event);
				}
			}
		});
	}

	private void listVisible(final HttpServerRequest request, final String acceptLanguage, final Handler<JsonObject> handler) {
		getUserInfos(eb, request, new Handler<UserInfos>() {
			@Override
			public void handle(final UserInfos user) {
				final JsonObject visibles = new JsonObject();
				UserUtils.findVisibleUsers(eb, user.getUserId(), false, new Handler<JsonArray>(){
					@Override
					public void handle(JsonArray users) {
						if (users != null) {
							visibles.putArray("users", users);
						}
						UserUtils.findVisibleProfilsGroups(eb, user.getUserId(), new Handler<JsonArray>(){
							@Override
							public void handle(JsonArray groups) {
								if (groups != null) {
									for (Object g : groups) {
										if (!(g instanceof JsonObject)) continue;
										JsonObject group = (JsonObject) g;
										UserUtils.groupDisplayName(group, acceptLanguage);
									}
									visibles.putArray("groups", groups);
								}
								handler.handle(visibles);
							}
						});
					}
				});
			}
		});
	}

	public void setCommunityService(CommunityService communityService) {
		this.communityService = communityService;
	}

}
