package net.atos.entng.community.test.integration

import io.gatling.core.Predef._
import io.gatling.http.Predef._
import org.entcore.test.appregistry.Role
import org.entcore.test.auth.Authenticate

object CommunityScenario {

  val scn = exec(Authenticate.authenticateAdmin)
  .exec(Role.createAndSetRole("Community"))
  .exec(Authenticate.authenticateUser("${teacherLogin}", "blipblop"))

  .exec(http("Create community")
    .post("/community")
    .body(StringBody("""{"name" : "My community", "description" : "bla", "icon" : "blo"}"""))
    .check(status.is(201), jsonPath("$.id").find.saveAs("communityId")))

  .exec(http("Update community")
    .put("/community/${communityId}")
    .body(StringBody("""{"description" : "nuage", "icon" : "arbre", "name": "Panda"}"""))
    .check(status.is(200), jsonPath("$.id").find.is("${communityId}")))

  .exec(http("Add users")
    .put("/community/${communityId}/users")
    .body(StringBody("""{"contrib" : ["${studentId}"], "read" : ["${childrenId}"]}"""))
    .check(status.is(200)))

  .exec(http("Get users")
    .get("/community/${communityId}/users")
    .check(status.is(200),
      jsonPath("$.contrib[0].id").find.is("${studentId}"),
      jsonPath("$.read[0].id").find.is("${childrenId}"),
      jsonPath("$.manager[0].id").find.is("${teacherId}")
    ))

  .exec(http("List communities")
    .get("/community/list")
    .check(status.is(200),
      jsonPath("$[0].id").find.is("${communityId}"),
      jsonPath("$[0].name").find.is("Panda"),
      jsonPath("$[0].types[0]").find.is("manager")
    ))

  .exec(http("Delete community")
    .delete("/community/${communityId}")
    .check(status.is(200)))

}
