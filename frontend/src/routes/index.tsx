import { QueryClient } from "@tanstack/react-query";
import { RouteObject, createBrowserRouter } from "react-router-dom";

import { NotFound } from "./errors/not-found";
import { PageError } from "./errors/page-error";
import { Index } from "./communities";
import CreateWizard from "./wizard/CreateWizard";
import "./index.css";

const routes = (_: QueryClient): RouteObject[] => [
  /* Main route */
  {
    path: "/",
    async lazy() {
      const { loader, Root: Component } = await import("~/routes/root");
      return {
        loader,
        Component,
      };
    },
    errorElement: <PageError />,
    children: [
      {
        index: true,
        element: <Index />,
      },
      {
        path: "create/*",
        element: <CreateWizard />,
      },
    ],
  },
  /* 404 Page */
  {
    path: "*",
    element: <NotFound />,
  },
];

export const basename = import.meta.env.PROD ? "/community" : "/";

export const router = (queryClient: QueryClient) =>
  createBrowserRouter(routes(queryClient), {
    basename,
  });
