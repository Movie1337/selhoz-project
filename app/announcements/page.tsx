import ListingCard from "@/components/ListingCard";
import { listings } from "@/lib/data";
import Link from "next/link";
import { Filter, Plus, Search } from "lucide-react";

export default function Announcements() {
 return <main className="container" style={{padding:"45px 0 70px"}}>
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"end",gap:20,marginBottom:28}}>
    <div><div className="muted" style={{fontSize:13,fontWeight:800}}>МАРКЕТПЛЕЙС</div><h1 style={{fontSize:42,margin:"7px 0"}}>Объявления</h1><p className="muted">Куплю и продам сельхозпродукцию напрямую.</p></div>
    <Link className="btn btn-primary" href="/announcements/new"><Plus size={17}/> Разместить</Link>
  </div>
  <div className="card" style={{padding:14,display:"grid",gridTemplateColumns:"1.6fr 1fr 1fr 1fr auto",gap:10,marginBottom:24}}>
    <div style={{position:"relative"}}><Search size={17} style={{position:"absolute",left:13,top:15,color:"#7b897d"}}/><input className="input" style={{paddingLeft:40}} placeholder="Что ищете? Например, пшеница"/></div>
    <select className="input"><option>Все направления</option><option>Куплю</option><option>Продам</option></select>
    <select className="input"><option>Все культуры</option><option>Зерновые</option><option>Семена</option><option>Масличные</option></select>
    <select className="input"><option>Все регионы</option><option>Саратовская область</option><option>Воронежская область</option></select>
    <button className="btn btn-secondary"><Filter size={17}/> Фильтры</button>
  </div>
  <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:18}}>{listings.map(x=><ListingCard key={x.id} item={x}/>)}</div>
 </main>;
}