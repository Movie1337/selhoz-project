"use client";

import DashboardLayout from "@/components/DashboardLayout";
import ContactActions from "@/components/ContactActions";
import { useListings } from "@/components/ListingsContext";
import { ArrowLeft, MapPin } from "lucide-react";
import Link from "next/link";
import { use } from "react";

export default function RequestDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { listings } = useListings();
  const listing = listings.find(item => item.id === id);

  if (!listing) {
    return <DashboardLayout>
      <div className="card" style={{padding:24,textAlign:"center"}}>
        <h2>Заявка не найдена</h2>
        <Link href="/dashboard/requests" className="btn btn-primary" style={{marginTop:16}}>Вернуться к заявкам</Link>
      </div>
    </DashboardLayout>;
  }

  const details = [
    ["Тип заявки", listing.type],
    ["Категория", listing.category],
    ["Вид / сорт", listing.variety],
    ["Количество", listing.volume],
    ["Цена", listing.price],
    ["Срок", listing.deadline]
  ];

  return <DashboardLayout>
    <Link href="/dashboard/requests" style={{textDecoration:"none",color:"var(--green)",fontWeight:700,display:"inline-flex",alignItems:"center",gap:8,marginBottom:20}}>
      <ArrowLeft size={18}/> Все заявки
    </Link>
    <article className="card" style={{padding:24}}>
      <div style={{marginBottom:24}}>
        <span className="pill" style={{background:listing.type === "Куплю" ? "#fff0df" : "#e7f2e2",color:listing.type === "Куплю" ? "#a65a17" : "var(--green)"}}>{listing.type}</span>
        <h2 style={{margin:"14px 0 8px",fontWeight:900,color:"var(--green)"}}>{listing.title}</h2>
        <div className="muted" style={{display:"flex",alignItems:"center",gap:6}}><MapPin size={16}/> {listing.region}</div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:16,marginBottom:24}}>
        {details.map(([label, value]) => <div key={label} style={{borderTop:"1px solid var(--line)",paddingTop:14}}>
          <div className="muted" style={{fontSize:12}}>{label}</div>
          <div style={{fontWeight:700,marginTop:5,color:label === "Цена" ? "var(--green)" : "var(--ink)"}}>{value}</div>
        </div>)}
      </div>

      <div style={{borderTop:"1px solid var(--line)",paddingTop:20}}>
        <div style={{fontSize:14,fontWeight:900,color:"var(--green)"}}>Описание</div>
        <p style={{margin:"8px 0 0",lineHeight:1.65}}>{listing.description || "Описание не указано."}</p>
      </div>

      <div style={{borderTop:"1px solid var(--line)",paddingTop:20,marginTop:24}}>
        <h3 style={{margin:"7px 0 18px"}}>
          <Link href={`/organizations/${encodeURIComponent(listing.author)}`} style={{color:"var(--green)",textDecoration:"underline",textUnderlineOffset:4}}>{listing.author}</Link>
        </h3>
        <ContactActions author={listing.author}/>
      </div>
    </article>
  </DashboardLayout>;
}