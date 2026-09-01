import Link from "next/link";
import { ArrowUpRight, CheckCircle2, MapPin, Star } from "lucide-react";
import type { listings } from "@/lib/data";

type Listing = (typeof listings)[number];

export default function ListingCard({item}:{item:Listing}) {
  return <article className="card" style={{padding:22}}>
    <div style={{display:"flex",justifyContent:"space-between",gap:12}}>
      <span className="pill" style={{background:item.type==="Куплю"?"#fff0df":"#e7f2e2",color:item.type==="Куплю"?"#a65a17":"var(--green)"}}>{item.type}</span>
      {item.verified && <span className="pill" style={{background:"#eef5ec",color:"var(--green)"}}><CheckCircle2 size={14}/> Проверен</span>}
    </div>
    <h3 style={{fontSize:19,margin:"16px 0 10px"}}>{item.title}</h3>
    <div className="muted" style={{display:"grid",gap:8,fontSize:14}}>
      <span><MapPin size={15} style={{verticalAlign:"-3px"}}/> {item.region}</span>
      <span>Объём: <b style={{color:"var(--ink)"}}>{item.volume}</b></span>
      <span>Цена: <b style={{color:"var(--ink)"}}>{item.price}</b></span>
      <span>Срок: {item.deadline}</span>
    </div>
    <div style={{borderTop:"1px solid var(--line)",margin:"18px 0",paddingTop:15,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <div><b style={{fontSize:14}}>{item.author}</b><div className="muted" style={{fontSize:13,marginTop:4}}><Star size={13} fill="currentColor" style={{verticalAlign:"-2px"}}/> {item.rating}</div></div>
      <Link className="btn btn-secondary" href={`/announcements/${item.id}`}>Подробнее <ArrowUpRight size={16}/></Link>
    </div>
  </article>;
}