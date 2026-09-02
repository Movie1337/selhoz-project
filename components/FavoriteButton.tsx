"use client";

import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { addActivity, removeActivity } from "@/lib/activity";

const FAVORITES_KEY = "favorite-listing-ids";
const FAVORITES_EVENT = "favorites-updated";

const readFavoriteIds = () => {
  const saved = localStorage.getItem(FAVORITES_KEY);
  if (!saved) return [];
  try {
    return JSON.parse(saved) as string[];
  } catch {
    return [];
  }
};

export default function FavoriteButton({ listingId }: { listingId: string }) {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    setIsFavorite(readFavoriteIds().includes(listingId));
    const syncFavorites = () => setIsFavorite(readFavoriteIds().includes(listingId));
    window.addEventListener(FAVORITES_EVENT, syncFavorites);
    window.addEventListener("storage", syncFavorites);
    return () => {
      window.removeEventListener(FAVORITES_EVENT, syncFavorites);
      window.removeEventListener("storage", syncFavorites);
    };
  }, [listingId]);

  const toggleFavorite = () => {
    const favoriteIds = readFavoriteIds();
    const nextIds = favoriteIds.includes(listingId)
      ? favoriteIds.filter(id => id !== listingId)
      : [...favoriteIds, listingId];
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(nextIds));
    setIsFavorite(nextIds.includes(listingId));
    if (nextIds.includes(listingId)) {
      addActivity({id:`favorite-${listingId}`,text:"Новое объявление добавили в избранное",time:"только что",href:`/announcements/${listingId}`,kind:"favorite"});
    } else {
      removeActivity(`favorite-${listingId}`);
    }
    window.dispatchEvent(new Event(FAVORITES_EVENT));
  };

  return <button type="button" onClick={event => { event.stopPropagation(); toggleFavorite(); }} aria-label={isFavorite ? "Убрать из избранного" : "Добавить в избранное"} title={isFavorite ? "Убрать из избранного" : "Добавить в избранное"} style={{width:40,height:40,display:"grid",placeItems:"center",border:"1px solid var(--line)",borderRadius:"50%",background:"#fff",cursor:"pointer",flexShrink:0}}>
    <Heart size={20} color={isFavorite ? "var(--green)" : "var(--muted)"} fill={isFavorite ? "var(--green)" : "none"}/>
  </button>;
}

export { FAVORITES_EVENT, FAVORITES_KEY };
