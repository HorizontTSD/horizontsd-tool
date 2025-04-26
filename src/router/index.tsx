import { createBrowserRouter } from "react-router";
import { MainLayout } from "@/layouts";
import { HomePage } from "@/pages";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [{ index: true, element: <HomePage /> }],
  },
]);
