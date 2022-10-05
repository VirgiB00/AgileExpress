import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Login from './routes/login';
import Dashboard from './routes/dashboard';
import Project from './components/dashboard/ProjectScreen/project';
import SearchResult from "./components/dashboard/Search/SearchResult";
import ProjectScreen from "./components/dashboard/ProjectsScreen/ProjectScreen";
import BurndownChart from "./components/dashboard/ProjectScreen/Sprint/BurndownChart";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <Routes>
            <Route path={"/burndown"} element={<BurndownChart/>}/>
            <Route path={"/"} element={<Login/>}/>
            <Route path={"login"} element={<Login/>}/>
            <Route path={"dashboard"} element={<Dashboard/>}>
                <Route path={"projects"} element={<ProjectScreen/>}/>
                <Route path={"project"} element={<Project/>}>
                    <Route path={":projectLinkName/:action"} element={<Project/>}>
                        <Route path={":itemId"} element={<Project/>}/>
                    </Route>
                </Route>
                <Route path={"search"}>
                    <Route path={":value"} element={<SearchResult/>}/>
                </Route>
            </Route>
            <Route
                path={"*"}
                element={
                    <main style={{padding: "1rem"}}>
                        <p>There's nothing here!</p>
                    </main>
                }
            />
        </Routes>
    </BrowserRouter>
    // <App />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
