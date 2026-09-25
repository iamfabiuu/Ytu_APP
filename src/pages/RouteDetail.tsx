import { useParams, useNavigate } from "react-router-dom";
import { ROUTES } from "../data/routes";
import { RouteJourney } from "../components/Routejourney";

export function RouteDetail() {
    const { id } = useParams();
    const nav = useNavigate();

    const route = ROUTES.find((r) => r.id === id);

    if (!route) {
        return (
            <section className="flex min-h-screen items-center justify-center bg-[#FDF7F2] px-5">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-[#0B1B3F]">
                        Rota não encontrada
                    </h1>

                    <button
                        onClick={() => nav("/nearby")}
                        className="mt-4 rounded-2xl bg-[#1D3FA8] px-5 py-3 font-bold text-white"
                    >
                        Voltar
                    </button>
                </div>
            </section>
        );
    }

    return (
        <RouteJourney
            route={route}
            badge={route.featured ? "ROTA DA SEMANA" : "ROTA CULTURAL"}
        />
    );
}