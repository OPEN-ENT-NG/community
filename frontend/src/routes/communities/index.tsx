import { IWebApp } from "@edifice.io/client";
import { AppHeader, Breadcrumb, useEdificeClient } from "@edifice.io/react";
import { Outlet } from "react-router-dom";

export const Index = () => {
  const { currentApp } = useEdificeClient();

  return (
    <AppHeader render={() => <Outlet />}>
      <Breadcrumb app={currentApp as IWebApp} />
    </AppHeader>
  );
};
