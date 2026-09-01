import Link from "next/link";
import { Bell, CircleUserRound, Menu, Wheat } from "lucide-react";

export default function Header() {
  return (
    <header style={{background:"#fff", borderBottom:"1px solid var(--line)", position:"sticky", top:0, zIndex:30}}>
      <div className="container" style={{height:76, display:"flex", alignItems:"center", justifyContent:"space-between", gap:20}}>
        <Link href="/" style={{display:"flex", alignItems:"center", gap:10, fontWeight:900, fontSize:22}}>
          <span style={{width:40,height:40,borderRadius:13,display:"grid",placeItems:"center",background:"var(--green)",color:"#fff"}}>
            <Wheat size={21}/>
          </span>
          АгроМост
        </Link>
        <nav style={{display:"flex", gap:26, fontSize:14, fontWeight:700}} className="desktop-nav">
          <Link href="/announcements">Объявления</Link>
          <Link href="/services">Услуги</Link>
          <Link href="/map">Карта</Link>
          <Link href="/organizations">Организации</Link>
        </nav>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <button className="btn btn-secondary" aria-label="Уведомления"><Bell size={17}/></button>
          <Link className="btn btn-primary" href="/dashboard"><CircleUserRound size={17}/> Личный кабинет</Link>
          <button className="btn btn-secondary" style={{display:"none"}} aria-label="Меню"><Menu/></button>
        </div>
      </div>
    </header>
  );
}