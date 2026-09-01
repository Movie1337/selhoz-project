import Link from "next/link";
export default function Footer() {
  return <footer style={{background:"var(--green-dark)",color:"#fff",marginTop:70}}>
    <div className="container" style={{padding:"50px 0 28px",display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:30}}>
      <div><div style={{fontSize:22,fontWeight:900,marginBottom:12}}>АгроМост</div><p style={{color:"#cbd9ce",lineHeight:1.7,maxWidth:390}}>Цифровая площадка для производителей, покупателей и организаций аграрного сектора.</p></div>
      <div><b>Платформа</b><div style={{display:"grid",gap:10,marginTop:14,color:"#cbd9ce"}}><Link href="/announcements">Объявления</Link><Link href="/services">Услуги</Link><Link href="/map">Карта</Link></div></div>
      <div><b>Участникам</b><div style={{display:"grid",gap:10,marginTop:14,color:"#cbd9ce"}}><Link href="/dashboard">Кабинет</Link><Link href="/organizations">Организации</Link><Link href="/reviews">Отзывы</Link></div></div>
      <div><b>Поддержка</b><div style={{display:"grid",gap:10,marginTop:14,color:"#cbd9ce"}}><span>support@agromost.ru</span><span>Политика конфиденциальности</span><span>Условия использования</span></div></div>
    </div>
    <div className="container" style={{borderTop:"1px solid rgba(255,255,255,.12)",padding:"18px 0",color:"#9fb1a2",fontSize:13}}>© 2026 АгроМост. Концепт MVP.</div>
  </footer>;
}