 "use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { load } from "@2gis/mapgl";
import { Layers, MapPin, Search, LocateFixed, X } from "lucide-react";
import { organizations } from "@/lib/data";

type Org = (typeof organizations)[number];

const MAP_CENTER: [number, number] = [46.0342, 51.5336];

export default function MapPage() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("Все");
  const [selected, setSelected] = useState<Org | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState("");

  const filters = ["Все", "Поставщик", "Покупатель", "Услуги", "Учреждение"];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return organizations.filter((o) => {
      const matchesFilter = filter === "Все" || o.type === filter;
      const matchesQuery =
        !q ||
        o.name.toLowerCase().includes(q) ||
        o.region.toLowerCase().includes(q) ||
        o.type.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [query, filter]);

  useEffect(() => {
    let destroyed = false;

    async function initMap() {
      if (!mapContainerRef.current) return;

      try {
        const mapgl = await load();
        if (destroyed || !mapContainerRef.current) return;

        const key = process.env.NEXT_PUBLIC_2GIS_API_KEY;
        if (!key) {
          setMapError("Не найден NEXT_PUBLIC_2GIS_API_KEY. Проверьте .env.local.");
          return;
        }

        const map = new mapgl.Map(mapContainerRef.current, {
          key,
          center: MAP_CENTER,
          zoom: 6,
          pitch: 0,
        });

        mapRef.current = map;
        (map as any).__mapgl = mapgl;
        setMapReady(true);

        return () => map.destroy();
      } catch (error) {
        console.error(error);
        setMapError("Не удалось загрузить карту 2ГИС. Проверьте API-ключ и подключение.");
      }
    }

    const cleanupPromise = initMap();

    return () => {
      destroyed = true;
      cleanupPromise.then((cleanup) => cleanup?.());
      markersRef.current.forEach((marker) => marker.destroy?.());
      markersRef.current = [];
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;

    markersRef.current.forEach((marker) => marker.destroy?.());
    markersRef.current = [];

    // MapGL API is loaded dynamically, so keep its constructor on the map instance.
    // We create markers through the API object saved during initialization below.
  }, [filtered, mapReady]);

  // Re-initialize markers using the MapGL API stored on the map instance.
  useEffect(() => {
    const map = mapRef.current;
    const mapgl = (map as any)?.__mapgl;
    if (!map || !mapgl || !mapReady) return;

    markersRef.current.forEach((marker) => marker.destroy?.());
    markersRef.current = [];

    filtered.forEach((org) => {
      if (!org.coordinates) return;

      const marker = new mapgl.Marker(map, {
        coordinates: org.coordinates,
        userData: org,
      });

      marker.on("click", () => {
        setSelected(org);
        map.setCenter(org.coordinates);
        map.setZoom(11);
      });

      markersRef.current.push(marker);
    });

    return () => {
      markersRef.current.forEach((marker) => marker.destroy?.());
      markersRef.current = [];
    };
  }, [filtered, mapReady]);

  const focusOrganization = (org: Org) => {
    if (!mapRef.current || !org.coordinates) return;
    setSelected(org);
    mapRef.current.setCenter(org.coordinates);
    mapRef.current.setZoom(11);
  };

  const resetMap = () => {
    setSelected(null);
    mapRef.current?.setCenter(MAP_CENTER);
    mapRef.current?.setZoom(6);
  };

  return (
    <main className="container" style={{ padding: "40px 0 70px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "end",
          marginBottom: 22,
          gap: 20,
        }}
      >
        <div>
          <div className="muted" style={{ fontSize: 13, fontWeight: 800 }}>
            ГЕОГРАФИЯ
          </div>
          <h1 style={{ fontSize: 42, margin: "7px 0" }}>Карта участников</h1>
          <p className="muted" style={{ marginBottom: 0 }}>
            Реальная карта 2ГИС с организациями АгроМоста.
          </p>
        </div>
        <button className="btn btn-secondary" onClick={resetMap}>
          <LocateFixed size={17} /> Вся Россия
        </button>
      </div>

      <div
        className="card"
        style={{
          overflow: "hidden",
          display: "grid",
          gridTemplateColumns: "1fr 340px",
          minHeight: 650,
        }}
      >
        <div style={{ position: "relative", minHeight: 650, background: "#edf3e8" }}>
          <div ref={mapContainerRef} style={{ position: "absolute", inset: 0 }} />

          {!mapError && (
            <div
              style={{
                position: "absolute",
                left: 18,
                top: 18,
                width: 340,
                maxWidth: "calc(100% - 36px)",
                zIndex: 5,
              }}
            >
              <div
                className="card"
                style={{
                  padding: 10,
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                  background: "rgba(255,255,255,.96)",
                }}
              >
                <Search size={17} />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  style={{ border: 0, outline: 0, width: "100%", background: "transparent" }}
                  placeholder="Поиск организации или региона"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    aria-label="Очистить поиск"
                    style={{ border: 0, background: "transparent", cursor: "pointer" }}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>
          )}

          {mapError && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "grid",
                placeItems: "center",
                padding: 30,
                textAlign: "center",
              }}
            >
              <div className="card" style={{ padding: 24, maxWidth: 480 }}>
                <MapPin size={30} color="var(--green)" />
                <h3 style={{ margin: "12px 0 8px" }}>Карта 2ГИС не загрузилась</h3>
                <p className="muted" style={{ lineHeight: 1.6, margin: 0 }}>
                  {mapError}
                </p>
              </div>
            </div>
          )}

          {selected && (
            <div
              className="card"
              style={{
                position: "absolute",
                left: 18,
                bottom: 18,
                width: 320,
                maxWidth: "calc(100% - 36px)",
                padding: 18,
                zIndex: 5,
                background: "rgba(255,255,255,.97)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                <div>
                  <div className="muted" style={{ fontSize: 12 }}>
                    {selected.type}
                  </div>
                  <h3 style={{ margin: "5px 0 7px" }}>{selected.name}</h3>
                  <div className="muted" style={{ fontSize: 13 }}>
                    <MapPin size={13} style={{ verticalAlign: "-2px" }} /> {selected.region}
                  </div>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  aria-label="Закрыть"
                  style={{ border: 0, background: "transparent", cursor: "pointer", height: 28 }}
                >
                  <X size={17} />
                </button>
              </div>
              <div style={{ marginTop: 12, fontWeight: 800 }}>★ {selected.rating} рейтинг</div>
            </div>
          )}
        </div>

        <aside
          style={{
            background: "#fff",
            borderLeft: "1px solid var(--line)",
            padding: 18,
            overflowY: "auto",
            maxHeight: 650,
          }}
        >
          <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 15 }}>
            {filters.map((item) => (
              <button
                key={item}
                className="pill"
                onClick={() => setFilter(item)}
                style={{
                  border: 0,
                  cursor: "pointer",
                  background: filter === item ? "var(--green)" : "#f1f4ee",
                  color: filter === item ? "#fff" : "var(--ink)",
                }}
              >
                {item}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div className="muted" style={{ fontSize: 12 }}>
              {filtered.length} из {organizations.length} объектов
            </div>
            <Layers size={16} className="muted" />
          </div>

          {filtered.map((o) => (
            <button
              key={o.name}
              onClick={() => focusOrganization(o)}
              style={{
                width: "100%",
                textAlign: "left",
                padding: "14px 0",
                border: 0,
                borderBottom: "1px solid var(--line)",
                background: "transparent",
                cursor: "pointer",
                color: "inherit",
              }}
            >
              <b>{o.name}</b>
              <div className="muted" style={{ fontSize: 13, marginTop: 5 }}>
                <MapPin size={13} style={{ verticalAlign: "-2px" }} /> {o.region}
              </div>
              <div style={{ fontSize: 13, marginTop: 5 }}>
                ★ {o.rating} · {o.type}
              </div>
            </button>
          ))}

          {filtered.length === 0 && (
            <div className="muted" style={{ padding: "30px 0", textAlign: "center", fontSize: 14 }}>
              Ничего не найдено.
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}
