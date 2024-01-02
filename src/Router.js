import { Route, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import Layout from "./components/Layout";
import Main from "./pages/Main";

export const router = createBrowserRouter(
    createRoutesFromElements(
        <Route element={<Layout/>}>
            <Route path="" element={<Main/>}/>
        </Route>
    )
);