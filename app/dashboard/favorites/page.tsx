"use client";

import DashboardLayout from "@/components/DashboardLayout";
import ListingCard from "@/components/ListingCard";
import { listings } from "@/lib/data";
import { useEffect, useState } from "react";
import { FAVORITES_EVENT, FAVORITES_KEY } from "@/components/FavoriteButton";

export default function Favorites() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  useEffect(() => {
    const syncFavorites = () => {
      const saved = localStorage.getItem(FAVORITES_KEY);
      try {
        setFavoriteIds(saved ? JSON.parse(saved) : []);
      } catch {
        setFavoriteIds([]);
      }
    };
    syncFavorites();
    window.addEventListener(FAVORITES_EVENT, syncFavorites);
    window.addEventListener("storage", syncFavorites);
    return () => {
      window.removeEventListener(FAVORITES_EVENT, syncFavorites);
      window.removeEventListener("storage", syncFavorites);
    };
  }, []);

  const favoriteListings = listings.filter(listing => favoriteIds.includes(listing.id));

  return <DashboardLayout>
    <style>{`
      .favorites-list {
        max-height: min(620px, calc(100vh - 330px));
        overflow-y: auto;
        overscroll-behavior: contain;
        padding: 2px 8px 8px 2px;
      }
      .favorites-list::-webkit-scrollbar { width: 8px; }
      .favorites-list::-webkit-scrollbar-thumb { background: #c6d5c2; border-radius: 8px; }
      @media (max-width: 700px) {
        .favorites-list { max-height: 520px; }
      }
    `}</style>
    <div className="card" style={{padding:24}}>
      <h2 style={{marginTop:0,fontWeight:900,color:"var(--green)"}}>Избранное</h2>
      <p className="muted">Объявления и заявки, которые вы сохранили для последующего просмотра.</p>
      <div className="favorites-list" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:18,marginTop:20}}>
        {favoriteListings.map(listing => <ListingCard key={listing.id} item={listing}/>)}
        {favoriteListings.length === 0 && <div style={{gridColumn:"1 / -1",padding:"32px 16px",textAlign:"center",border:"1px dashed var(--line)",borderRadius:14}}><b>В избранном пока нет объявлений</b><div className="muted" style={{fontSize:14,marginTop:6}}>Нажмите на сердечко в объявлении, чтобы сохранить его.</div></div>}
      </div>
    </div>
  </DashboardLayout>;
}
