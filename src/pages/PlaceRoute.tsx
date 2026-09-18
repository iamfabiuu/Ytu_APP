// src/pages/PlaceRoute.tsx
import { useParams, Navigate } from "react-router-dom";
import { PLACE_DETAILS } from "../data/placeDetails";
import { PlaceDetailView } from "../components/PlaceDetailView";

export function PlaceRoute() {
  const { id = "" } = useParams();
  const place = PLACE_DETAILS[id];
  return place ? <PlaceDetailView place={place} /> : <Navigate to="/" replace />;
}
