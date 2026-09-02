"use client";

import Link from "next/link";
import { Bell, CircleUserRound, Menu, Wheat } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { ACTIVITY_EVENT, markActivityViewed, readUnreadActivity } from "@/lib/activity";
import { ActivityItem, readAllActivity } from "@/lib/activity";
import { useEffect, useState } from "react";

export default function Header() {
  const { isAuthenticated, openAuth } = useAuth();
  const [hasUnread, setHasUnread] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  useEffect(() => {
    const syncUnread = () => {
      setHasUnread(readUnreadActivity().length > 0);
      setActivities(readAllActivity());
    };
    syncUnread();
    window.addEventListener(ACTIVITY_EVENT, syncUnread);
    window.addEventListener("storage", syncUnread);
    return () => {
      window.removeEventListener(ACTIVITY_EVENT, syncUnread);
      window.removeEventListener("storage", syncUnread);
    };
  }, []);

  const openNotifications = () => {
    markActivityViewed();
    setHasUnread(false);
    setActivities(readAllActivity());
    setShowNotifications(previous => !previous);
  };

  return (
    <header style={{background:"#fff", borderBottom:"1px solid var(--line)", position:"sticky", top:0, zIndex:30}}>
      <div className="container" style={{height:76, display:"flex", alignItems:"center", justifyContent:"space-between", gap:20}}>
        <Link href="/" style={{display:"flex", alignItems:"center", gap:10, fontWeight:900, fontSize:22}}>
          <span style={{width:40,height:40,borderRadius:13,display:"grid",placeItems:"center",background:"var(--green)",color:"#fff"}}>
            <Wheat size={21}/>
          </span>
          АгроСвязь
        </Link>
        <nav style={{display:"flex", gap:26, fontSize:14, fontWeight:700}} className="desktop-nav">
          <Link href="/announcements">Объявления</Link>
          <Link href="/services">Услуги</Link>
          <Link href="/map">Карта</Link>
          <Link href="/organizations">Организации</Link>
        </nav>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{position:"relative"}}>
            <button onClick={openNotifications} className="btn btn-secondary" aria-label="Уведомления" aria-expanded={showNotifications} style={{position:"relative"}}><Bell size={17}/>{hasUnread && <span aria-label="Есть новые уведомления" style={{position:"absolute",right:7,top:7,width:8,height:8,borderRadius:"50%",background:"var(--green)",border:"2px solid #fff"}}/>}</button>
            {showNotifications && <div role="menu" aria-label="Уведомления" style={{position:"absolute",right:0,top:"calc(100% + 10px)",width:340,maxWidth:"calc(100vw - 24px)",padding:12,background:"#fff",border:"1px solid var(--line)",borderRadius:16,boxShadow:"0 14px 34px rgba(23,53,31,.14)",zIndex:40}}>
              <div style={{fontWeight:900,color:"var(--green)",padding:"4px 6px 10px"}}>Уведомления</div>
              <div style={{display:"grid",gap:4,maxHeight:360,overflowY:"auto"}}>
                {activities.slice(0,6).map(activity => <Link key={activity.id} href={activity.href} onClick={() => setShowNotifications(false)} role="menuitem" style={{display:"block",padding:"11px 8px",borderRadius:10,textDecoration:"none",color:"inherit"}}><div style={{fontSize:14,fontWeight:700}}>{activity.text}</div><div className="muted" style={{fontSize:12,marginTop:4}}>{activity.time}</div></Link>)}
                {activities.length === 0 && <div className="muted" style={{padding:"12px 8px",fontSize:14}}>Новых уведомлений нет</div>}
              </div>
            </div>}
          </div>
          {isAuthenticated ? <Link className="btn btn-primary" href="/dashboard"><CircleUserRound size={17}/> Личный кабинет</Link> : <button onClick={() => openAuth("login")} className="btn btn-primary"><CircleUserRound size={17}/> Войти</button>}
          <button className="btn btn-secondary" style={{display:"none"}} aria-label="Меню"><Menu/></button>
        </div>
      </div>
    </header>
  );
}
