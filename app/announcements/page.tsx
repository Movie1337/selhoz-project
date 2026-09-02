"use client";

import ListingCard from "@/components/ListingCard";
import { listings } from "@/lib/data";
import Link from "next/link";
import { Filter, Plus, Search, X } from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { REGIONS } from "@/lib/regions";

const paymentByListingId: Record<string, string> = {
 "1": "Безналичная",
 "2": "Наличная",
 "3": "По договорённости",
 "4": "Безналичная",
};

const wordStem = (word: string) => word
 .toLocaleLowerCase("ru-RU")
 .replace(/ё/g, "е")
 .replace(/(иями|ями|ами|ого|ему|ыми|ими|ов|ев|ам|ям|ах|ях|ую|юю|ой|ей|ом|ем|а|я|ы|и|у|ю|е|о)$/u, "");

const matchesQuery = (value: string, query: string) => {
 const queryWords = query.match(/[\p{L}\p{N}]+/gu) ?? [];
 const valueWords = value.match(/[\p{L}\p{N}]+/gu) ?? [];

 return queryWords.every(queryWord => {
   const queryStem = wordStem(queryWord);
   return queryStem.length < 3 || valueWords.some(valueWord => {
     const valueStem = wordStem(valueWord);
     return valueStem.startsWith(queryStem) || queryStem.startsWith(valueStem);
   });
 });
};

function AnnouncementsContent() {
 const searchParams = useSearchParams();
 const initialType = searchParams.get("type");
 const [type, setType] = useState<"all" | "buy" | "sell">(initialType === "buy" || initialType === "sell" ? initialType : "all");
 const [showFilters, setShowFilters] = useState(false);
 const [sort, setSort] = useState("");
 const [query, setQuery] = useState("");
 const [category, setCategory] = useState(() => searchParams.get("category") ?? "");
 const [volume, setVolume] = useState("");
 const [price, setPrice] = useState("");
 const [region, setRegion] = useState("");
 const [deadline, setDeadline] = useState("");
 const [payment, setPayment] = useState("");
 const [verifiedOnly, setVerifiedOnly] = useState(false);
 
 let filtered = type === "all" 
   ? listings 
   : type === "buy"
   ? listings.filter(x => x.type === "Куплю")
   : listings.filter(x => x.type === "Продам");

 const includes = (value: string, filter: string) =>
   !filter || value.toLocaleLowerCase("ru-RU").includes(filter.trim().toLocaleLowerCase("ru-RU"));

 if (query.trim()) {
   filtered = filtered.filter(x =>
     [x.title, x.category, x.variety, x.region].some(value => matchesQuery(value, query))
   );
 }
 if (category) filtered = filtered.filter(x => x.category === category);
 if (sort.trim()) filtered = filtered.filter(x => includes(x.variety, sort));
 if (volume.trim()) filtered = filtered.filter(x => includes(x.volume, volume));
 if (price.trim()) filtered = filtered.filter(x => includes(x.price, price));
 if (region) filtered = filtered.filter(x => x.region === region);
 if (deadline.trim()) filtered = filtered.filter(x => includes(x.deadline, deadline));
 if (payment) filtered = filtered.filter(x => paymentByListingId[x.id] === payment);
 if (verifiedOnly) filtered = filtered.filter(x => x.verified);

 return <main className="container" style={{padding:"45px 0 70px"}}>
  <style>{`
    .announcements-list {
      max-height: min(700px, calc(100vh - 360px));
      overflow-y: auto;
      overscroll-behavior: contain;
      padding: 2px 8px 8px 2px;
    }
    .announcements-list::-webkit-scrollbar { width: 8px; }
    .announcements-list::-webkit-scrollbar-thumb { background: #c6d5c2; border-radius: 8px; }
    @media (max-width: 700px) {
      .announcements-list { max-height: 560px; }
    }
  `}</style>
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"end",gap:20,marginBottom:28}}>
    <div><div className="muted" style={{fontSize:13,fontWeight:800}}>МАРКЕТПЛЕЙС</div><h1 style={{fontSize:42,margin:"7px 0"}}>Объявления</h1><p className="muted">Покупайте, продавайте и находите партнёров для сотрудничества</p></div>
    <Link className="btn btn-primary" href="/announcements/new"><Plus size={17}/> Разместить</Link>
  </div>
  <div className="card" style={{padding:14,display:"grid",gridTemplateColumns:"1.6fr auto auto 1fr 1fr auto",gap:10,marginBottom:24}}>
    <div style={{position:"relative"}}><Search size={17} style={{position:"absolute",left:13,top:15,color:"#7b897d"}}/><input value={query} onChange={e => setQuery(e.target.value)} className="input" style={{paddingLeft:40}} placeholder="Что ищете? Например, пшеница"/></div>
    <button onClick={() => setType("buy")} style={{padding:"10px 16px",borderRadius:8,border:0,fontWeight:800,fontSize:14,cursor:"pointer",background:type === "buy" ? "var(--green)" : "#eef5ec",color:type === "buy" ? "#fff" : "var(--green)",transition:"all 0.2s"}}>КУПИТЬ</button>
    <button onClick={() => setType("sell")} style={{padding:"10px 16px",borderRadius:8,border:0,fontWeight:800,fontSize:14,cursor:"pointer",background:type === "sell" ? "#ef4444" : "#fee2e2",color:type === "sell" ? "#fff" : "#ef4444",transition:"all 0.2s"}}>ПРОДАТЬ</button>
    <select value={category} onChange={e => setCategory(e.target.value)} className="input"><option value="">Все культуры</option><option>Зерновые</option><option>Семена</option><option>Масличные</option><option>Овощные</option><option>Сельхозтехника</option><option>Удобрения</option><option>Средства защиты растений</option><option>Животноводство</option><option>Другая продукция</option></select>
    <select value={region} onChange={e => setRegion(e.target.value)} className="input">
      <option value="">Все регионы</option>
      {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
    </select>
    <button onClick={() => setShowFilters(!showFilters)} className="btn btn-secondary"><Filter size={17}/> Фильтры</button>
  </div>

  {showFilters && (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",display:"grid",placeItems:"center",zIndex:1000}}>
      <div className="card" style={{width:"90%",maxWidth:600,maxHeight:"90vh",overflow:"auto",padding:30}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
          <h2 style={{fontSize:24,margin:0}}>Дополнительные фильтры</h2>
          <button onClick={() => setShowFilters(false)} style={{border:0,background:"none",cursor:"pointer",padding:0}}><X size={24}/></button>
        </div>

        <div style={{marginBottom:20}}>
          <label style={{display:"block",fontWeight:800,marginBottom:8}}>Сорт</label>
          <input value={sort} onChange={e => setSort(e.target.value)} className="input" style={{width:"100%"}} placeholder="Введите сорт"/>
        </div>

        <div style={{marginBottom:20}}>
          <label style={{display:"block",fontWeight:800,marginBottom:8}}>Объём</label>
          <input value={volume} onChange={e => setVolume(e.target.value)} className="input" style={{width:"100%"}} placeholder="Например: 50 тонн"/>
        </div>

        <div style={{marginBottom:20}}>
          <label style={{display:"block",fontWeight:800,marginBottom:8}}>Цена за единицу</label>
          <input value={price} onChange={e => setPrice(e.target.value)} className="input" style={{width:"100%"}} placeholder="Например: 58 000 ₽/т"/>
        </div>

        <div style={{marginBottom:20}}>
          <label style={{display:"block",fontWeight:800,marginBottom:8}}>Регион</label>
          <select value={region} onChange={e => setRegion(e.target.value)} className="input" style={{width:"100%"}}>
            <option value="">Все регионы</option>
            {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        <div style={{marginBottom:20}}>
          <label style={{display:"block",fontWeight:800,marginBottom:8}}>Срок поставки</label>
          <input value={deadline} onChange={e => setDeadline(e.target.value)} className="input" style={{width:"100%"}} placeholder="Например: до 20 сентября"/>
        </div>

        <div style={{marginBottom:20}}>
          <label style={{display:"block",fontWeight:800,marginBottom:8}}>Форма оплаты</label>
          <select value={payment} onChange={e => setPayment(e.target.value)} className="input" style={{width:"100%"}}>
            <option value="">Любая</option>
            <option>Наличная</option>
            <option>Безналичная</option>
            <option>По договорённости</option>
          </select>
        </div>

        <div style={{marginBottom:24,display:"flex",alignItems:"center",gap:10}}>
          <input 
            type="checkbox" 
            checked={verifiedOnly} 
            onChange={e => setVerifiedOnly(e.target.checked)}
            style={{cursor:"pointer",width:18,height:18}}
          />
          <label style={{fontWeight:800,cursor:"pointer",margin:0}}>Только проверенные организации</label>
        </div>

        <div style={{display:"flex",gap:10}}>
          <button onClick={() => setShowFilters(false)} className="btn btn-primary" style={{flex:1}}>Применить</button>
          <button onClick={() => {setSort("");setVolume("");setPrice("");setRegion("");setDeadline("");setPayment("");setVerifiedOnly(false);}} className="btn btn-secondary" style={{flex:1}}>Сбросить</button>
        </div>
      </div>
    </div>
  )}

  <div className="announcements-list" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:18}}>{filtered.map(x=><ListingCard key={x.id} item={x}/>)}</div>
 </main>;
}

export default function Announcements() {
 return <Suspense fallback={<main className="container" style={{padding:"45px 0 70px"}}>Загрузка объявлений...</main>}><AnnouncementsContent/></Suspense>;
}
