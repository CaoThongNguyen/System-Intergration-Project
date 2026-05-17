// Import component Header từ file Header.jsx
import Header from "./Header";

// Import component Sidebar từ file Sidebar.jsx
import Sidebar from "./Sidebar";

export default function Layout({ children, onLogout }) {

    return (
        <div>
            <Header onLogout={onLogout} />

            <div style={{ display: "flex" }}>
                <Sidebar />

                <main style={{ flexGrow: 1, minWidth: 0 }} className="p-4">
                    {children}
                </main>
            </div>
        </div>
    );
}