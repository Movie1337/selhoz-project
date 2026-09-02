import { listings } from "@/lib/data";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, MapPin, Star } from "lucide-react";
import { notFound } from "next/navigation";
import ListingCard from "@/components/ListingCard";
import ContactActions from "@/components/ContactActions";

const regionCoordinates: Record<string, {lat:number;lng:number}> = {
 "Саратовская область": {lat:51.53,lng:46.03},
 "Воронежская область": {lat:51.67,lng:39.18},
 "Ростовская область": {lat:47.23,lng:39.72},
};

const regionDistance = (firstRegion: string, secondRegion: string) => {
 const first = regionCoordinates[firstRegion];
 const second = regionCoordinates[secondRegion];
 if (!first || !second) return Number.POSITIVE_INFINITY;

 const toRadians = (value: number) => value * Math.PI / 180;
 const latitudeDifference = toRadians(second.lat - first.lat);
 const longitudeDifference = toRadians(second.lng - first.lng);
 const haversine = Math.sin(latitudeDifference / 2) ** 2
   + Math.cos(toRadians(first.lat)) * Math.cos(toRadians(second.lat)) * Math.sin(longitudeDifference / 2) ** 2;
 return 6371 * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
};

export default async function Announcement({params}:{params:Promise<{id:string}>}) {
 const {id}=await params; const item=listings.find(x=>x.id===id); if(!item) return notFound();
 const similarListings = listings
  .filter(candidate => candidate.id !== item.id)
  .map(candidate => {
   const distance = regionDistance(item.region, candidate.region);
   const score = (candidate.category === item.category ? 50 : 0)
    + (candidate.type === item.type ? 30 : 0)
    + (candidate.region === item.region ? 40 : Math.max(0, 20 - distance / 50));
   return {candidate, score};
  })
  .filter(({score}) => score > 0)
  .sort((first, second) => second.score - first.score)
  .map(({candidate}) => candidate);
 return <main className="container" style={{padding:"45px 0 70px"}}>
  <Link href="/announcements" className="btn btn-primary"><ArrowLeft size={15}/> Все объявления</Link>
  <div style={{display:"grid",gridTemplateColumns:"1.5fr .8fr",gap:20,marginTop:22}}>
   <article className="card" style={{padding:30}}>
    <span className="pill" style={{background:item.type==="Куплю"?"#fff0df":"#e7f2e2",color:item.type==="Куплю"?"#a65a17":"var(--green)"}}>{item.type}</span>
    <h1 style={{fontSize:38,lineHeight:1.1,margin:"18px 0",fontWeight:800}}>{item.title}</h1>
    <Link href={`/map?region=${encodeURIComponent(item.region)}`} className="muted" style={{display:"flex",gap:6,alignItems:"center",width:"fit-content",textDecoration:"underline",textUnderlineOffset:4}}><MapPin size={17}/> {item.region}</Link>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,margin:"28px 0"}}>
      {[["Культура",item.category],["Сорт",item.variety],["Объём",item.volume],["Цена",item.price],["Срок",item.deadline],["Условия","По договорённости"]].map(([a,b])=><div key={a} style={{background:"#f7f8f2",borderRadius:14,padding:15}}><div className="muted" style={{fontSize:12}}>{a}</div><b style={{display:"block",marginTop:5}}>{b}</b></div>)}
    </div>
    <h3 style={{fontWeight:800}}>Требования и описание</h3><p className="muted" style={{lineHeight:1.75}}>Ищем надёжного контрагента с документами на продукцию. Готовы рассмотреть предложения от хозяйств региона и соседних областей. Детальные условия согласовываются после первичного отклика.</p>
   </article>
   <aside className="card" style={{padding:24,height:"fit-content"}}>
    <div style={{fontSize:12,color:"var(--muted)"}}>Автор объявления</div>
    <h3 style={{margin:"8px 0"}}><Link href={`/organizations/${encodeURIComponent(item.author)}`} style={{color:"var(--green)",textDecoration:"underline",textUnderlineOffset:4}}>{item.author}</Link></h3>
    {item.verified&&<span className="pill" style={{background:"#eef5ec",color:"var(--green)"}}><CheckCircle2 size={14}/> Проверенная организация</span>}
    <div style={{margin:"20px 0",display:"flex",alignItems:"center",gap:6}}><Star size={17} fill="currentColor"/><b>{item.rating}</b><span className="muted">/ 5.0</span></div>
    <ContactActions author={item.author}/>
   <button className="btn btn-secondary" style={{width:"100%",marginTop:9}}>Добавить в избранное</button>
   </aside>
  </div>
  {similarListings.length > 0 && <section style={{marginTop:36}}>
   <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:16,marginBottom:16}}>
    <h2 style={{fontSize:28,margin:0}}>Похожие объявления</h2>
    {similarListings.length <= 5 && <Link href={`/announcements?category=${encodeURIComponent(item.category)}&type=${item.type === "Куплю" ? "buy" : "sell"}`} className="btn btn-primary">Все похожие</Link>}
   </div>
   <p className="muted" style={{margin:"0 0 20px"}}>Подобрано по культуре, типу сделки и близости региона.</p>
   <div style={{display:"flex",gap:18,overflowX:"auto",paddingBottom:10,scrollSnapType:"x mandatory"}}>{similarListings.map(listing => <div key={listing.id} style={{flex:"0 0 min(360px, 88%)",scrollSnapAlign:"start"}}><ListingCard item={listing}/></div>)}</div>
  </section>}
 </main>
}
