import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../data/routes";
import { RouteJourney } from "../components/Routejourney";

export function WeeklyRouteDetail() {
    const nav = useNavigate();

    const route = useMemo(() => ROUTES.find((r) => r.featured) ?? ROUTES[0], []);

    if (!route) {
        return (
            <section className="grid min-h-screen place-items-center bg-[#FDF7F2] px-5 text-center">
                <div>
                    <h1 className="text-2xl font-bold text-[#0B1B3F]">Nenhuma rota da semana ainda</h1>
                    <p className="mt-2 text-sm text-black/50">Volte em breve — tem coisa boa vindo. ✨</p>
                    <button
                        onClick={() => nav("/")}
                        className="mt-5 rounded-2xl bg-[#1D3FA8] px-6 py-3 font-bold text-white active:scale-95"
                    >
                        Ir para o início
                    </button>
                </div>
            </section>
        );
    }

    return <RouteJourney route={route} badge="ROTA DA SEMANA" />;
}