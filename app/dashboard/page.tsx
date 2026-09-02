"use client";

import DashboardLayout from "@/components/DashboardLayout";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useListings } from "@/components/ListingsContext";
import { Edit2 } from "lucide-react";
import { ACTIVITY_EVENT, markActivityViewed, readAllActivity, readUnreadActivity, ActivityItem } from "@/lib/activity";

const RATING_VIEWED_KEY = "dashboard-rating-viewed";

export default function Dashboard() {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const { listings } = useListings();
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [ratingViewed, setRatingViewed] = useState(false);
  useEffect(() => {
    const syncActivity = () => {
      setActivity(readAllActivity());
      setUnreadCount(readUnreadActivity().length);
    };
    syncActivity();
    setRatingViewed(localStorage.getItem(RATING_VIEWED_KEY) === "true");
    window.addEventListener(ACTIVITY_EVENT, syncActivity);
    window.addEventListener("storage", syncActivity);
    return () => {
      window.removeEventListener(ACTIVITY_EVENT, syncActivity);
      window.removeEventListener("storage", syncActivity);
    };
  }, []);
  const liveActivity = activity.filter(item => !item.id.startsWith("default-"));
  const newFavorites = liveActivity.filter(item => item.kind === "favorite").length;
  const newRatings = ratingViewed ? 0 : 1;
  const markRatingViewed = () => {
    localStorage.setItem(RATING_VIEWED_KEY, "true");
    setRatingViewed(true);
  };

 return <DashboardLayout>
  <div style={{display:"flex",justifyContent:"flex-end",marginBottom:20}}>
    <Link href="/dashboard/profile/edit" className="btn btn-primary" style={{textDecoration:"none",display:"inline-flex",alignItems:"center",gap:8}}>
      <Edit2 size={16}/> Редактировать профиль
    </Link>
  </div>
  <style>{`
    .stat-badge {
      display: inline-block;
      background-color: var(--green);
      color: white;
      font-size: 12px;
      font-weight: 800;
      padding: 4px 8px;
      border-radius: 4px;
      margin-left: 10px;
    }
  `}</style>
  <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14}}>
    <Link href="/dashboard/my-listings" style={{textDecoration:"none",color:"inherit"}}>
      <div 
        className="card" 
        style={{
          padding:20,
          cursor:"pointer",
          transition:"all 0.2s",
          border:"1px solid transparent",
          borderColor: hoverIndex === 0 ? "var(--green)" : "transparent",
          background: hoverIndex === 0 ? "#f7f8f2" : "transparent"
        }} 
        onMouseEnter={() => setHoverIndex(0)} 
        onMouseLeave={() => setHoverIndex(null)}
      >
        <div className="muted" style={{fontSize:13}}>Активные объявления</div>
        <b style={{fontSize:30,display:"block",marginTop:8}}>{listings.length}</b>
      </div>
    </Link>
    <Link href="/dashboard/requests" style={{textDecoration:"none",color:"inherit"}}>
      <div 
        className="card" 
        style={{
          padding:20,
          cursor:"pointer",
          transition:"all 0.2s",
          border:"1px solid transparent",
          borderColor: hoverIndex === 1 ? "var(--green)" : "transparent",
          background: hoverIndex === 1 ? "#f7f8f2" : "transparent"
        }}
        onMouseEnter={() => setHoverIndex(1)} 
        onMouseLeave={() => setHoverIndex(null)}
      >
        <div className="muted" style={{fontSize:13}}>Новых заявок</div>
        <div style={{marginTop:8,display:"flex",alignItems:"baseline",gap:0}}>
          <b style={{fontSize:30}}>{12 + newFavorites}</b>
          {newFavorites > 0 && <span className="stat-badge">+{newFavorites}</span>}
        </div>
      </div>
    </Link>
    <Link href="/dashboard/reviews" onClick={markRatingViewed} style={{textDecoration:"none",color:"inherit"}}>
      <div 
        className="card" 
        style={{
          padding:20,
          cursor:"pointer",
          transition:"all 0.2s",
          border:"1px solid transparent",
          borderColor: hoverIndex === 2 ? "var(--green)" : "transparent",
          background: hoverIndex === 2 ? "#f7f8f2" : "transparent"
        }}
        onMouseEnter={() => setHoverIndex(2)} 
        onMouseLeave={() => setHoverIndex(null)}
      >
        <div className="muted" style={{fontSize:13}}>Средний рейтинг</div>
        <div style={{marginTop:8,display:"flex",alignItems:"baseline",gap:0}}>
          <b style={{fontSize:30}}>4.9</b>
          {newRatings > 0 && <span className="stat-badge">+{newRatings}</span>}
        </div>
      </div>
    </Link>
  </div>
  <div className="card" onClick={markActivityViewed} style={{padding:24,marginTop:18}}>
    <div style={{display:"flex",alignItems:"center",gap:10}}><h2 style={{marginTop:0,fontWeight:900,color:"var(--green)"}}>Последняя активность</h2>{unreadCount > 0 && <span className="stat-badge" style={{marginTop:-8}}>+{unreadCount}</span>}</div>
    {activity.slice(0,6).map(item => <Link key={item.id} href={item.href} style={{padding:"15px 0",borderTop:"1px solid var(--line)",display:"flex",justifyContent:"space-between",gap:16,textDecoration:"none",color:"inherit"}}><span style={{fontWeight:item.id.startsWith("default") ? 400 : 700}}>{item.text}</span><span className="muted" style={{fontSize:13,whiteSpace:"nowrap"}}>{item.time}</span></Link>)}
  </div>
 </DashboardLayout>;
}
