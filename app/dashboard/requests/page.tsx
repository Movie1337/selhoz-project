"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useListings } from "@/components/ListingsContext";
import { ArrowRight, MapPin } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Requests() {
  const { listings } = useListings();
  const [typeFilter, setTypeFilter] = useState<"Все" | "Куплю" | "Продам">("Все");
  const [varietyFilter, setVarietyFilter] = useState("Все");
  const varieties = Array.from(new Set([
    "Пшеница",
    "Подсолнечник",
    "Кукуруза",
    "Семена",
    "Зерновые",
    "Масличные",
    "Овощные",
    "Сельхозтехника",
    "Удобрения",
    "Средства защиты растений",
    "Животноводство",
    "Другая продукция",
    ...listings.map(listing => listing.variety)
  ])).sort((first, second) => first.localeCompare(second, "ru"));
  const filteredListings = listings.filter(listing =>
    (typeFilter === "Все" || listing.type === typeFilter)
    && (varietyFilter === "Все" || listing.variety === varietyFilter || listing.category === varietyFilter)
  );

  return <DashboardLayout>
    <div className="card" style={{padding:24}}>
      <h2 style={{marginTop:0,fontWeight:900,color:"var(--green)"}}>Мои заявки</h2>
      <p className="muted">Заявки пользователей с подробностями о товаре, количестве, цене и месте поставки.</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:12,marginTop:20}}>
        <div style={{display:"grid",gap:7,fontWeight:700,fontSize:14}}>
          Тип заявки
          <div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:8}}>
            <button type="button" onClick={() => setTypeFilter(typeFilter === "Куплю" ? "Все" : "Куплю")} className="btn" style={{background:typeFilter === "Куплю" ? "var(--green)" : "#e7f2e2",color:typeFilter === "Куплю" ? "#fff" : "var(--green)",borderColor:"#b9d2b5"}}>Купить</button>
            <button type="button" onClick={() => setTypeFilter(typeFilter === "Продам" ? "Все" : "Продам")} className="btn" style={{background:typeFilter === "Продам" ? "#c9362b" : "#fde8e6",color:typeFilter === "Продам" ? "#fff" : "#a52b24",borderColor:"#efb8b3"}}>Продать</button>
          </div>
        </div>
        <label style={{display:"grid",gap:7,fontWeight:700,fontSize:14}}>
          Сорт
          <select className="input" value={varietyFilter} onChange={event => setVarietyFilter(event.target.value)}>
            <option value="Все">Все сорта</option>
            {varieties.map(variety => <option key={variety} value={variety}>{variety}</option>)}
          </select>
        </label>
      </div>
      <div style={{display:"grid",gap:12,marginTop:20}}>
        {filteredListings.map(listing => (
          <Link key={listing.id} href={`/dashboard/requests/${listing.id}`} style={{textDecoration:"none",color:"inherit"}}>
            <article className="card" style={{padding:18,background:"#f7f8f2",cursor:"pointer",border:"1px solid var(--line)",transition:"border-color .18s ease, transform .18s ease"}}>
              <div style={{display:"flex",justifyContent:"space-between",gap:16,alignItems:"flex-start"}}>
                <div>
                  <span className="pill" style={{background:listing.type === "Куплю" ? "#fff0df" : "#e7f2e2",color:listing.type === "Куплю" ? "#a65a17" : "var(--green)"}}>{listing.type}</span>
                  <h3 style={{margin:"12px 0 8px",fontSize:18}}>{listing.title}</h3>
                  <div className="muted" style={{display:"flex",flexWrap:"wrap",gap:"6px 18px",fontSize:14}}>
                    <span>{listing.category}: <b style={{color:"var(--ink)"}}>{listing.variety}</b></span>
                    <span>Количество: <b style={{color:"var(--ink)"}}>{listing.volume}</b></span>
                    <span>Цена: <b style={{color:"var(--green)"}}>{listing.price}</b></span>
                    <span><MapPin size={14} style={{verticalAlign:"-2px"}}/> {listing.region}</span>
                  </div>
                </div>
                <ArrowRight size={20} color="var(--green)" aria-hidden="true" />
              </div>
              <div className="muted" style={{fontSize:13,marginTop:14}}>Срок: {listing.deadline}</div>
            </article>
          </Link>
        ))}
        {filteredListings.length === 0 && <div style={{padding:"28px 16px",textAlign:"center",border:"1px dashed var(--line)",borderRadius:14}}>
          <b>Заявок с такими параметрами нет</b>
          <div className="muted" style={{fontSize:14,marginTop:6}}>Измените тип заявки или сорт.</div>
        </div>}
      </div>
    </div>
  </DashboardLayout>;
}
