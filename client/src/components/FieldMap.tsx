import type { Field } from "@/lib/demo-data";
import { CircleMarker, MapContainer, TileLayer, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const statusColor: Record<Field["status"], string> = {
  Safe: "#2e6b55",
  Watch: "#b58124",
  Triggered: "#c85a2b",
  "Data unavailable": "#7f8f86",
};

export function FieldMap({ fields }: { fields: Field[] }) {
  return (
    <MapContainer center={[30.09, 71.5]} zoom={10} scrollWheelZoom={false} className="field-map" aria-label="Map of monitored demo fields">
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {fields.map(field => (
        <CircleMarker
          key={field.id}
          center={field.position}
          radius={field.status === "Triggered" ? 11 : 8}
          pathOptions={{ color: "#f9fbf5", weight: 2, fillColor: statusColor[field.status], fillOpacity: 1 }}
        >
          <Tooltip direction="top" offset={[0, -10]} opacity={1}>
            <strong>{field.name}</strong><br />{field.status}
          </Tooltip>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
