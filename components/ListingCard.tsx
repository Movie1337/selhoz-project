"use client";

import { CheckCircle2, MapPin, Star } from "lucide-react";
import type { listings } from "@/lib/data";
import { useRouter } from "next/navigation";
import FavoriteButton from "@/components/FavoriteButton";

type Listing = (typeof listings)[number];

export default function ListingCard({item}:{item:Listing}) {
 const router = useRouter();
 const openListing = () => router.push(`/announcements/${item.id}`);

  return <article className="card" role="link" tabIndex={0} aria-label={`Открыть объявление: ${item.title}`} onClick={openListing} onKeyDown={event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); openListing(); } }} style={{padding:22,cursor:"pointer",height:"100%",transition:"transform .18s ease, box-shadow .18s ease"}}>
    <div style={{display:"flex",justifyContent:"space-between",gap:12,alignItems:"center"}}>
      <span className="pill" style={{background:item.type==="Куплю"?"#fff0df":"#e7f2e2",color:item.type==="Куплю"?"#a65a17":"var(--green)"}}>{item.type}</span>
      <div style={{display:"flex",alignItems:"center",gap:8}}>{item.verified && <span className="pill" style={{background:"#eef5ec",color:"var(--green)"}}><CheckCircle2 size={14}/> Проверен</span>}<FavoriteButton listingId={item.id}/></div>
    </div>
    <h3 style={{fontSize:19,margin:"16px 0 10px"}}>{item.title}</h3>
    <div className="muted" style={{display:"grid",gap:8,fontSize:14}}>
      <span><MapPin size={15} style={{verticalAlign:"-3px"}}/> {item.region}</span>
      <span>Объём: <b style={{color:"var(--ink)"}}>{item.volume}</b></span>
      <span>Цена: <b style={{color:"var(--ink)"}}>{item.price}</b></span>
      <span>Срок: {item.deadline}</span>
    </div>
    <div style={{borderTop:"1px solid var(--line)",margin:"18px 0 0",paddingTop:15}}>
      <b style={{fontSize:14}}>{item.author}</b><div className="muted" style={{fontSize:13,marginTop:4}}><Star size={13} fill="currentColor" style={{verticalAlign:"-2px"}}/> {item.rating}</div>
    </div>
  </article>;
}
