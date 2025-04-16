import { HttpResponse, http } from "msw";

/**
 * DO NOT MODIFY
 */
const defaultHandlers = [
  http.get("/i18n", () => {
    return HttpResponse.json({ status: 200 });
  }),

  http.get("/theme", () => {
    return HttpResponse.json({
      template: "/public/template/portal.html",
      logoutCallback: "",
      skin: "/assets/themes/fake/skins/default/",
      themeName: "fake-theme",
      skinName: "default",
    });
  }),

  http.get("/locale", () => {
    return HttpResponse.json({ locale: "fr" });
  }),
];

export const handlers = [...defaultHandlers];
