import Link from "next/link";
import { Heart, MessageCircle, Plus, Search, Star, Wheat } from "lucide-react";
export default function Dashboard() {
 return <main className="container" style={{padding:"42px 0 70px"}}>
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div className="muted" style={{fontSize:13,fontWeight:800}}>ЛИЧНЫЙ КАБИНЕТ</div><h1 style={{fontSize:38,margin:"7px 0"}}>Добрый день, Тимофей</h1></div><Link href="/announcements/new" className="btn btn-primary"><Plus size={17}/> Новое объявление</Link></div>
  <div style={{display:"grid",gridTemplateColumns:"260px 1fr",gap:20,marginTop:25}}>
   <aside className="card" style={{padding:12,height:"fit-content"}}>{[[Wheat,"Мои объявления"],[Search,"Найти заявки"],[MessageCircle,"Сообщения"],[Heart,"Избранное"],[Star,"Отзывы"]].map(([I,t],i)=>{const Icon=I as any;return <div key={i} style={{padding:"12px 13px",borderRadius:11,background:i===0?"#edf3e8":"transparent",fontWeight:700,display:"flex",gap:10,alignItems:"center"}}><Icon size={17} color="var(--green)"/>{t as string}</div>})}</aside>
   <section><div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14}}>{[["Активные объявления","4"],["Новых откликов","12"],["Средний рейтинг","4.9"]].map(x=><div className="card" style={{padding:20}} key={x[0]}><div className="muted" style={{fontSize:13}}>{x[0]}</div><b style={{fontSize:30,display:"block",marginTop:8}}>{x[1]}</b></div>)}</div><div className="card" style={{padding:24,marginTop:18}}><h2 style={{marginTop:0}}>Последняя активность</h2>{["Новый отклик на «Куплю семена подсолнечника»","Вы получили новый отзыв","КФХ Петров добавил объявление"].map((x,i)=><div key={i} style={{padding:"15px 0",borderTop:"1px solid var(--line)",display:"flex",justifyContent:"space-between"}}><span>{x}</span><span className="muted" style={{fontSize:13}}>{i+1} ч. назад</span></div>)}</div></section>
  </div>
 </main>;
}