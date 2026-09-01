 "use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { load } from "@2gis/mapgl";
import { Layers, MapPin, Search, LocateFixed, X } from "lucide-react";
import { organizations } from "@/lib/data";
import Link from "next/link";

type Org = (typeof organizations)[number];

const MAP_CENTER: [number, number] = [46.0342, 51.5336];

const typeColors: Record<string, string> = {
  Поставщик: "#2f9e44",
  Покупатель: "#1971c2",
  Услуги: "#e67700",
  Учреждение: "#8e44ad",
};
function markerIcon(type: string) {
  const color = typeColors[type] ?? "#1971c2";

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="38" height="48" viewBox="0 0 38 48">
      <path
        d="M19 1C9.6 1 2 8.6 2 18c0 12.8 17 29 17 29s17-16.2 17-29C36 8.6 28.4 1 19 1Z"
        fill="${color}"
        stroke="white"
        stroke-width="3"
      />
      <circle cx="19" cy="18" r="6" fill="white" />
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}
export default function MapPage() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("Все");
  const [region, setRegion] = useState("Все регионы");
  const [category, setCategory] = useState("Все категории");
  const [minRating, setMinRating] = useState("0");
  const [onlyVerified, setOnlyVerified] = useState(false);

  const [selected, setSelected] = useState<Org | null>(null);
  const [mapReady, setMapReady] = useState(false);
 const [viewMode, setViewMode] = useState<"map" | "list">("map");
  const [mapError, setMapError] = useState("");

  const filters = ["Все", "Поставщик", "Покупатель", "Услуги", "Учреждение"];
  const regions = ["Все регионы", ...Array.from(new Set(organizations.map((o) => o.region)))];
  const categories = [
    "Все категории",
    ...Array.from(new Set(organizations.map((o) => o.category))),
  ];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return organizations.filter((o) => {
      const searchText = [
        o.name,
        o.region,
        o.type,
        o.category,
        ...o.offers,
      ]
        .join(" ")
        .toLowerCase();

      return (
        (filter === "Все" || o.type === filter) &&
        (region === "Все регионы" || o.region === region) &&
        (category === "Все категории" || o.category === category) &&
        o.rating >= Number(minRating) &&
        (!onlyVerified || o.verified) &&
        (!q || searchText.includes(q))
      );
    });
  }, [query, filter, region, category, minRating, onlyVerified]);
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
  icon: markerIcon(org.type),
  size: [38, 48],
  anchor: [19, 47],
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
const buildRoute = (org: Org) => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const from = `${position.coords.longitude},${position.coords.latitude}`;
      const to = `${org.coordinates[0]},${org.coordinates[1]}`;

      const fromPoint = `${from}%E2%95%8E%E2%95%8E`;
      const toPoint = `${to}%E2%95%8E%E2%95%8E`;

      window.open(
        `https://2gis.ru/saratov/routeSearch/rsType/car/from/${fromPoint}/to/${toPoint}`,
        "_blank",
        "noopener,noreferrer"
      );
    },
    () => {
      alert("Разреши геолокацию в браузере, чтобы построить маршрут.");
    }
  );
};
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
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
  <button
    className={viewMode === "map" ? "btn btn-primary" : "btn btn-secondary"}
    onClick={() => setViewMode("map")}
  >
    🗺 Карта
  </button>

  <button
    className={viewMode === "list" ? "btn btn-primary" : "btn btn-secondary"}
    onClick={() => setViewMode("list")}
  >
    ☷ Список
  </button>

  <button className="btn btn-secondary" onClick={resetMap}>
    <LocateFixed size={17} /> Вся Россия
  </button>
</div>
      </div>

      <div
        className="card"
        style={{
          overflow: "hidden",
          display: viewMode === "map" ? "grid" : "none",
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
      width: 340,
      maxWidth: "calc(100% - 36px)",
      padding: 18,
      zIndex: 5,
      background: "rgba(255,255,255,.97)",
    }}
  >
    <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
      <div>
        <div style={{ fontSize: 12, color: typeColors[selected.type], fontWeight: 800 }}>
          ● {selected.type} {selected.verified ? "· ПРОВЕРЕНО" : ""}
        </div>

        <h3 style={{ margin: "6px 0 7px" }}>{selected.name}</h3>

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

    <div style={{ marginTop: 12, fontWeight: 800 }}>
      ★ {selected.rating} · {selected.reviews} отзывов
    </div>

    <div style={{ marginTop: 12, fontSize: 13, fontWeight: 800 }}>
      {selected.type === "Покупатель" ? "Покупает:" : "Предлагает:"}
    </div>

    <div className="muted" style={{ fontSize: 13, lineHeight: 1.6, marginTop: 4 }}>
      {selected.offers.map((offer) => (
        <div key={offer}>• {offer}</div>
      ))}
    </div>

    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 16 }}>
      <Link className="btn btn-secondary" href="/organizations">
        Подробнее
      </Link>

      <a
        className="btn btn-primary"
        href={`mailto:support@agromost.ru?subject=${encodeURIComponent(
          `Запрос для ${selected.name}`
        )}`}
      >
        Связаться
      </a>

      <button
  className="btn btn-secondary"
  onClick={() => buildRoute(selected)}
>
  Маршрут
</button>
    </div>
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
  <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 16 }}>
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

  <div style={{ display: "grid", gap: 9, marginBottom: 16 }}>
    <select
      className="input"
      value={region}
      onChange={(e) => setRegion(e.target.value)}
    >
      {regions.map((item) => (
        <option key={item}>{item}</option>
      ))}
    </select>

    <select
      className="input"
      value={category}
      onChange={(e) => setCategory(e.target.value)}
    >
      {categories.map((item) => (
        <option key={item}>{item}</option>
      ))}
    </select>

    <select
      className="input"
      value={minRating}
      onChange={(e) => setMinRating(e.target.value)}
    >
      <option value="0">Любой рейтинг</option>
      <option value="4">Рейтинг от 4.0</option>
      <option value="4.5">Рейтинг от 4.5</option>
      <option value="4.8">Рейтинг от 4.8</option>
    </select>

    <label
      style={{
        display: "flex",
        gap: 8,
        alignItems: "center",
        fontSize: 13,
        cursor: "pointer",
      }}
    >
      <input
        type="checkbox"
        checked={onlyVerified}
        onChange={(e) => setOnlyVerified(e.target.checked)}
      />
      Только проверенные
    </label>
  </div>

  <div
    style={{
      padding: "12px 0",
      borderTop: "1px solid var(--line)",
      borderBottom: "1px solid var(--line)",
      marginBottom: 8,
      fontSize: 12,
    }}
  >
    <div className="muted" style={{ marginBottom: 8 }}>
      {filtered.length} из {organizations.length} объектов
    </div>

    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {Object.entries(typeColors).map(([type, color]) => (
        <span key={type} style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: color,
              display: "inline-block",
            }}
          />
          {type}
        </span>
      ))}
    </div>
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

      <div style={{ fontSize: 13, marginTop: 6, color: typeColors[o.type] }}>
        ● {o.type} {o.verified ? "· Проверено" : ""}
      </div>

      <div className="muted" style={{ fontSize: 13, marginTop: 5 }}>
        <MapPin size={13} style={{ verticalAlign: "-2px" }} /> {o.region}
      </div>

      <div style={{ fontSize: 13, marginTop: 5 }}>
        ★ {o.rating} · {o.reviews} отзывов
      </div>

      <div className="muted" style={{ fontSize: 13, marginTop: 5 }}>
        {o.category}
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
      {viewMode === "list" && (
  <section>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 16,
        margin: "10px 0 20px",
      }}
    >
      <div>
        <h2 style={{ margin: 0 }}>Все участники</h2>
        <p className="muted" style={{ margin: "6px 0 0" }}>
          Найдено: {filtered.length}
        </p>
      </div>
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
      {filtered.map((o) => (
        <article className="card" key={o.name} style={{ padding: 20 }}>
          <div
            style={{
              color: typeColors[o.type],
              fontSize: 13,
              fontWeight: 800,
              marginBottom: 8,
            }}
          >
            ● {o.type} {o.verified ? "· ПРОВЕРЕНО" : ""}
          </div>

          <h3 style={{ margin: "0 0 8px" }}>{o.name}</h3>

          <div className="muted" style={{ fontSize: 14 }}>
            <MapPin size={14} style={{ verticalAlign: "-2px" }} /> {o.region}
          </div>

          <div style={{ marginTop: 10, fontWeight: 800 }}>
            ★ {o.rating} · {o.reviews} отзывов
          </div>

          <div className="muted" style={{ marginTop: 10, fontSize: 14 }}>
            <b>{o.category}</b>
            <br />
            {o.offers.slice(0, 2).join(" · ")}
          </div>

          <button
            className="btn btn-secondary"
            style={{ marginTop: 18, width: "100%" }}
            onClick={() => {
              setViewMode("map");
              focusOrganization(o);
            }}
          >
            Показать на карте
          </button>
        </article>
      ))}
    </div>

    {filtered.length === 0 && (
      <div className="card muted" style={{ padding: 30, textAlign: "center" }}>
        По выбранным фильтрам ничего не найдено.
      </div>
    )}
  </section>
)}
    <section
  className="card"
  style={{
    marginTop: 32,
    padding: "32px 28px",
    background: "#eaf3e5",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 20,
    flexWrap: "wrap",
  }}
>
  <div>
    <div className="muted" style={{ fontSize: 13, fontWeight: 800 }}>
      ДЛЯ УЧАСТНИКОВ РЫНКА
    </div>

    <h2 style={{ margin: "7px 0 8px" }}>Не нашли нужную организацию?</h2>

    <p className="muted" style={{ margin: 0, maxWidth: 650 }}>
      Разместите свою организацию на АгроМосте и расскажите потенциальным
      клиентам о товарах и услугах.
    </p>
  </div>

  <Link className="btn btn-primary" href="/dashboard">
    Добавить организацию
  </Link>
</section>
    </main>
  );
}
