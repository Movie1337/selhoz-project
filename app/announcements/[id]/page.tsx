import { listings } from "@/lib/data";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, MapPin, MessageCircle, Star } from "lucide-react";
import { notFound } from "next/navigation";

export default async function Announcement({params}:{params:Promise<{id:string}>}) {
 const {id}=await params; const item=listings.find(x=>x.id===id); if(!item) return notFound();
 return <main className="container" style={{padding:"45px 0 70px"}}>
  <Link href="/announcements" className="muted" style={{fontWeight:700}}><ArrowLeft size={15} style={{verticalAlign:"-2px"}}/> Все объявления</Link>
  <div style={{display:"grid",gridTemplateColumns:"1.5fr .8fr",gap:20,marginTop:22}}>
   <article className="card" style={{padding:30}}>
    <span className="pill" style={{background:item.type==="Куплю"?"#fff0df":"#e7f2e2",color:item.type==="Куплю"?"#a65a17":"var(--green)"}}>{item.type}</span>
    <h1 style={{fontSize:38,lineHeight:1.1,margin:"18px 0"}}>{item.title}</h1>
    <p className="muted" style={{display:"flex",gap:6,alignItems:"center"}}><MapPin size={17}/> {item.region}</p>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,margin:"28px 0"}}>
      {[["Культура",item.category],["Сорт",item.variety],["Объём",item.volume],["Цена",item.price],["Срок",item.deadline],["Условия","По договорённости"]].map(([a,b])=><div key={a} style={{background:"#f7f8f2",borderRadius:14,padding:15}}><div className="muted" style={{fontSize:12}}>{a}</div><b style={{display:"block",marginTop:5}}>{b}</b></div>)}
    </div>
    <h3>Требования и описание</h3><p className="muted" style={{lineHeight:1.75}}>Ищем надёжного контрагента с документами на продукцию. Готовы рассмотреть предложения от хозяйств региона и соседних областей. Детальные условия согласовываются после первичного отклика.</p>
   </article>
   <aside className="card" style={{padding:24,height:"fit-content"}}>
    <div style={{fontSize:12,color:"var(--muted)"}}>Автор объявления</div><h3 style={{margin:"8px 0"}}>{item.author}</h3>
    {item.verified&&<span className="pill" style={{background:"#eef5ec",color:"var(--green)"}}><CheckCircle2 size={14}/> Проверенная организация</span>}
    <div style={{margin:"20px 0",display:"flex",alignItems:"center",gap:6}}><Star size={17} fill="currentColor"/><b>{item.rating}</b><span className="muted">/ 5.0</span></div>
    <button className="btn btn-primary" style={{width:"100%"}}><MessageCircle size={17}/> Связаться</button>
    <button className="btn btn-secondary" style={{width:"100%",marginTop:9}}>Добавить в избранное</button>
   </aside>
  </div>
 </main>
}