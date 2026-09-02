import { organizations } from "@/lib/data";
import { Layers, MapPin, Search, SlidersHorizontal } from "lucide-react";
const regionPositions: Record<string, {x:number;y:number}> = {
 "Саратовская область": {x:46,y:44},
 "Воронежская область": {x:34,y:59},
 "Ростовская область": {x:68,y:52},
};

export default async function MapPage({searchParams}:{searchParams:Promise<{region?:string}>}) {
 const { region } = await searchParams;
 const selectedRegion = region?.trim();
 const visibleOrganizations = selectedRegion ? organizations.filter(item => item.region === selectedRegion) : organizations;
 const position = selectedRegion ? regionPositions[selectedRegion] ?? {x:50,y:50} : null;
 return <main className="container" style={{padding:"40px 0 70px"}}>
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"end",marginBottom:22}}><div><div className="muted" style={{fontSize:13,fontWeight:800}}>ГЕОГРАФИЯ</div><h1 style={{fontSize:42,margin:"7px 0"}}>Карта участников</h1><p className="muted">Найдите поставщиков, покупателей и услуги рядом.</p></div><button className="btn btn-secondary"><Layers size={17}/> Слои</button></div>
  <div className="card" style={{overflow:"hidden",display:"grid",gridTemplateColumns:"1fr 340px",minHeight:600}}>
    <div className="map-grid" style={{position:"relative",minHeight:600}}>
      {position && <div style={{position:"absolute",left:`${position.x}%`,top:`${position.y}%`,transform:"translate(-50%,-50%)",zIndex:1}}><div style={{background:"var(--orange)",color:"#fff",borderRadius:999,padding:"9px 12px",fontSize:12,fontWeight:800,whiteSpace:"nowrap",boxShadow:"0 8px 20px #17351f40"}}><MapPin size={14} style={{verticalAlign:"-2px"}}/> {selectedRegion}</div><div style={{width:16,height:16,borderRadius:"50%",background:"var(--orange)",border:"4px solid #fff",margin:"4px auto"}}/></div>}
      {visibleOrganizations.map((o,i)=><div key={i} style={{position:"absolute",left:`${o.x}%`,top:`${o.y}%`,transform:"translate(-50%,-50%)"}}><div style={{background:"var(--green)",color:"#fff",borderRadius:999,padding:"8px 11px",fontSize:11,fontWeight:800,whiteSpace:"nowrap",boxShadow:"0 8px 20px #17351f30"}}>{o.type}</div><div style={{width:12,height:12,borderRadius:"50%",background:"var(--orange)",border:"3px solid #fff",margin:"4px auto"}}/></div>)}
      <div style={{position:"absolute",left:18,top:18,width:320}}><div className="card" style={{padding:10,display:"flex",gap:8,alignItems:"center"}}><Search size={17}/><input style={{border:0,outline:0,width:"100%"}} placeholder="Поиск на карте"/></div></div>
    </div>
    <aside style={{background:"#fff",borderLeft:"1px solid var(--line)",padding:18}}><div style={{display:"flex",gap:8,marginBottom:15}}><button className="pill" style={{border:0,background:"var(--green)",color:"#fff"}}>Все</button><button className="pill" style={{border:0,background:"#f1f4ee"}}>Поставщики</button></div>{selectedRegion && <div className="pill" style={{background:"#fff0df",color:"#a65a17",marginBottom:12}}><MapPin size={13}/> {selectedRegion}</div>}<div className="muted" style={{fontSize:12,marginBottom:10}}>{visibleOrganizations.length} объектов</div>{visibleOrganizations.map(o=><div key={o.name} style={{padding:"14px 0",borderBottom:"1px solid var(--line)"}}><b>{o.name}</b><div className="muted" style={{fontSize:13,marginTop:5}}><MapPin size={13} style={{verticalAlign:"-2px"}}/> {o.region}</div><div style={{fontSize:13,marginTop:5}}>★ {o.rating} · {o.type}</div></div>)}</aside>
  </div>
 </main>
}
