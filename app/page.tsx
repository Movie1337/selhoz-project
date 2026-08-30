import Link from "next/link";
import { ArrowRight, Building2, MapPin, Search, ShieldCheck, Sprout, Tractor, Wheat } from "lucide-react";
import ListingCard from "@/components/ListingCard";
import { listings, services } from "@/lib/data";

export default function Home() {
  return <>
    <main>
      <section className="hero-grid">
        <div className="container" style={{padding:"78px 0 72px",display:"grid",gridTemplateColumns:"1.1fr .9fr",gap:55,alignItems:"center"}}>
          <div>
            <span className="pill" style={{background:"var(--lime)",color:"var(--green-dark)"}}>Единая аграрная платформа</span>
            <h1 style={{fontSize:"clamp(42px,6vw,72px)",lineHeight:.98,letterSpacing:"-3px",margin:"20px 0"}}>Покупайте.<br/>Продавайте.<br/><span style={{color:"var(--green)"}}>Находите.</span></h1>
            <p className="muted" style={{fontSize:18,lineHeight:1.65,maxWidth:610}}>Объединяем фермеров, компании, бюджетные учреждения и покупателей в одной понятной цифровой среде.</p>
            <div style={{display:"flex",gap:12,marginTop:28,flexWrap:"wrap"}}>
              <Link href="/announcements" className="btn btn-primary">Смотреть объявления <ArrowRight size={17}/></Link>
              <Link href="/announcements/new" className="btn btn-secondary">Разместить объявление</Link>
            </div>
            <div style={{display:"flex",gap:22,marginTop:28,color:"var(--muted)",fontSize:13}}>
              <span><ShieldCheck size={15} style={{verticalAlign:"-3px"}}/> Проверяем организации</span>
              <span><MapPin size={15} style={{verticalAlign:"-3px"}}/> Поиск по регионам</span>
            </div>
          </div>
          <div className="card" style={{padding:18,background:"rgba(255,255,255,.74)",backdropFilter:"blur(10px)"}}>
            <div style={{borderRadius:18,overflow:"hidden",background:"#dce8d6",minHeight:360,position:"relative"}}>
              <div className="map-grid" style={{position:"absolute",inset:0}}/>
              {[[22,32,"Покупатель"],[48,54,"Поставщик"],[70,27,"Услуги"],[78,68,"Учреждение"],[37,75,"Поставщик"]].map(([x,y,label],i)=>
                <div key={i} style={{position:"absolute",left:`${x}%`,top:`${y}%`,transform:"translate(-50%,-50%)",zIndex:2}}>
                  <div style={{background:"var(--green)",color:"#fff",padding:"7px 10px",borderRadius:999,fontSize:11,fontWeight:800,whiteSpace:"nowrap",boxShadow:"0 5px 15px #285c3640"}}>{label}</div>
                  <div style={{width:10,height:10,borderRadius:"50%",background:"var(--green)",margin:"4px auto 0",border:"2px solid white"}}/>
                </div>
              )}
              <div style={{position:"absolute",left:18,bottom:18,right:18,background:"white",borderRadius:15,padding:14,zIndex:3}}>
                <div style={{fontSize:12,color:"var(--muted)"}}>На карте сейчас</div>
                <div style={{display:"flex",gap:22,marginTop:7,fontWeight:900}}><span>1 248 поставщиков</span><span>386 покупателей</span><span>92 услуги</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container" style={{padding:"70px 0"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"end",gap:20,marginBottom:24}}>
          <div><div className="muted" style={{fontSize:13,fontWeight:800}}>ПОСЛЕДНИЕ ЗАПРОСЫ</div><h2 style={{fontSize:34,margin:"7px 0"}}>Новые возможности</h2></div>
          <Link href="/announcements" style={{fontWeight:800,color:"var(--green)"}}>Все объявления →</Link>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:18}}>
          {listings.slice(0,3).map(x=><ListingCard key={x.id} item={x}/>)}
        </div>
      </section>

      <section style={{background:"#edf3e8"}}>
        <div className="container" style={{padding:"68px 0"}}>
          <div style={{maxWidth:700}}><div className="muted" style={{fontSize:13,fontWeight:800}}>ПОЧЕМУ АГРОСВЯЗЬ</div><h2 style={{fontSize:38,margin:"8px 0 14px"}}>Один рынок вместо десятков разрозненных каналов</h2><p className="muted" style={{lineHeight:1.7}}>Логика платформы построена вокруг конкретного действия: найти нужный товар или услугу, проверить контрагента и связаться напрямую.</p></div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:15,marginTop:30}}>
            {[
              [Search,"Поиск","Фильтры по культуре, объёму, цене, региону и срокам."],
              [MapPin,"Карта","Поставщики, покупатели и учреждения на одной карте."],
              [ShieldCheck,"Репутация","Рейтинг, отзывы и отметка проверенной организации."],
              [Building2,"Личный кабинет","Разные сценарии для фермера, компании и учреждения."]
            ].map(([Icon,title,text],i)=>{const I=Icon as any; return <div key={i} className="card" style={{padding:20}}><I size={23} color="var(--green)"/><h3 style={{margin:"14px 0 8px"}}>{title as string}</h3><p className="muted" style={{fontSize:14,lineHeight:1.6,margin:0}}>{text as string}</p></div>})}
          </div>
        </div>
      </section>

      <section className="container" style={{padding:"70px 0"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"end",marginBottom:24}}>
          <div><div className="muted" style={{fontSize:13,fontWeight:800}}>УСЛУГИ</div><h2 style={{fontSize:34,margin:"7px 0"}}>Найдите специалиста рядом</h2></div>
          <Link href="/services" style={{fontWeight:800,color:"var(--green)"}}>Все услуги →</Link>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:18}}>
          {services.map(s=><div key={s.id} className="card" style={{padding:22}}><span className="pill" style={{background:"#eef5ec",color:"var(--green)"}}>{s.category}</span><h3 style={{fontSize:19,margin:"16px 0 9px"}}>{s.title}</h3><p className="muted" style={{margin:"0 0 14px"}}>{s.organization}</p><div style={{display:"flex",justifyContent:"space-between",fontSize:14}}><b>{s.price}</b><span className="muted">{s.term}</span></div></div>)}
        </div>
      </section>

      <section className="container" style={{paddingBottom:70}}>
        <div className="card" style={{padding:"36px 38px",background:"var(--green)",color:"#fff",display:"flex",justifyContent:"space-between",alignItems:"center",gap:25}}>
          <div><h2 style={{fontSize:30,margin:"0 0 8px"}}>Ваша заявка может быть следующей</h2><p style={{margin:0,color:"#cbd9ce"}}>Создайте объявление и получите предложения от участников рынка.</p></div>
          <Link href="/announcements/new" className="btn btn-lime">Создать объявление <ArrowRight size={17}/></Link>
        </div>
      </section>
    </main>
  </>;
}