import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function EditorLayout() {
  return (
    <div className="editor-layout">
      <Sidebar />
      <main className="editor-content">
        <Outlet />
      </main>
    </div>
  );
}