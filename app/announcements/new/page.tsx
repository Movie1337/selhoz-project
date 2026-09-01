import Link from "next/link";
export default function NewAnnouncement() {
 return <main className="container" style={{padding:"45px 0 70px",maxWidth:900}}>
  <div className="muted" style={{fontSize:13,fontWeight:800}}>НОВОЕ ОБЪЯВЛЕНИЕ</div><h1 style={{fontSize:40,margin:"7px 0"}}>Разместить заявку</h1><p className="muted">Заполните основные параметры — они будут доступны потенциальным контрагентам.</p>
  <form className="card" style={{padding:28,marginTop:25,display:"grid",gap:18}}>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:15}}><label>Направление<select className="input"><option>Куплю</option><option>Продам</option></select></label><label>Культура<select className="input"><option>Пшеница</option><option>Подсолнечник</option><option>Кукуруза</option><option>Семена</option></select></label></div>
    <label>Заголовок<input className="input" placeholder="Например: Куплю семена подсолнечника"/></label>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:15}}><label>Объём<input className="input" placeholder="50 тонн"/></label><label>Цена<input className="input" placeholder="до 58 000 ₽/т"/></label></div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:15}}><label>Регион<select className="input"><option>Саратовская область</option><option>Воронежская область</option><option>Ростовская область</option></select></label><label>Срок<input className="input" placeholder="до 20 сентября"/></label></div>
    <label>Описание<textarea className="input" style={{height:130,paddingTop:12}} placeholder="Требования, характеристики, условия поставки..."/></label>
    <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}><Link href="/announcements" className="btn btn-secondary">Отмена</Link><button className="btn btn-primary" type="button">Опубликовать</button></div>
  </form>
 </main>
}