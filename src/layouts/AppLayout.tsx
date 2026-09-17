import { Outlet } from "react-router-dom";
import BottomNav from "@/components/BottomNav"; // seu menu

export default function AppLayout() {
  return (
    <div className="min-h-screen pb-20">
      <Outlet />
      <BottomNav />
    </div>
  );
}
