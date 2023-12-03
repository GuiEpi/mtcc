import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Outlet } from "react-router-dom";

export default function Layout() {
    return (
      <>
        <Header />
        <div className="min-h-screen">
          <Outlet />
        </div>
        <Footer />
      </>
    );
  }