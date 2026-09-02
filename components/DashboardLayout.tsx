"use client";

import Link from "next/link";
import { Heart, MessageCircle, Plus, Search, Star, Wheat, User } from "lucide-react";
import LogoutButton from "@/components/LogoutButton";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { useProfile } from "@/components/ProfileContext";

const sections = [
  [Wheat, "Мои объявления", "/dashboard"],
  [Search, "Мои заявки", "/dashboard/requests"],
  [MessageCircle, "Сообщения", "/dashboard/messages"],
  [Heart, "Избранное", "/dashboard/favorites"],
  [Star, "Отзывы", "/dashboard/reviews"],
  [User, "Профиль", "/dashboard/profile"]
] as const;

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [greeting, setGreeting] = useState("Добрый день");
  const { profile } = useProfile();

  const displayName = profile.accountType === "individual" 
    ? (profile.firstName || "Гость")
    : (profile.organizationName || "Гость");

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      setGreeting(hour >= 5 && hour < 12 ? "Доброе утро" : hour >= 12 && hour < 18 ? "Добрый день" : hour >= 18 && hour < 23 ? "Добрый вечер" : "Доброй ночи");
    };
    updateGreeting();
    const timer = window.setInterval(updateGreeting, 60000);
    return () => window.clearInterval(timer);
  }, []);

  return <main className="container" style={{padding:"42px 0 70px"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{display:"flex",alignItems:"center",gap:16}}><div style={{width:64,height:64,borderRadius:"50%",overflow:"hidden",background:"#edf3e8",display:"grid",placeItems:"center",color:"var(--green)",flexShrink:0}}>{profile.photo ? <img src={profile.photo} alt="Фото профиля" style={{width:"100%",height:"100%",objectFit:"cover"}}/> : <User size={28}/>}</div><div><div className="muted" style={{fontSize:13,fontWeight:800,color:"var(--green)"}}>ЛИЧНЫЙ КАБИНЕТ</div><h1 style={{fontSize:38,margin:"7px 0"}}>{greeting}, {displayName}</h1></div></div><div style={{display:"flex",gap:10}}><Link href="/announcements/new" className="btn btn-primary"><Plus size={17}/> Новое объявление</Link><LogoutButton/></div></div>
    <div style={{display:"grid",gridTemplateColumns:"260px 1fr",gap:20,marginTop:25}}>
      <aside className="card" style={{padding:12,height:"fit-content"}}>
        {sections.map(([I, t, href], i) => {
          const Icon = I as any;
          const isActive = pathname === href;
          const isHovered = hoveredIndex === i;
          return (
            <Link href={href} key={i} style={{textDecoration:"none",color:"inherit"}}>
              <div 
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  padding:"12px 13px",
                  borderRadius:11,
                  background:isActive||isHovered?"#edf3e8":"transparent",
                  fontWeight:900,
                  color:"var(--green)",
                  display:"flex",
                  gap:10,
                  alignItems:"center",
                  cursor:"pointer",
                  transition:"background 0.2s"
                }}
              >
                <Icon size={17} color="var(--green)"/>
                {t}
              </div>
            </Link>
          );
        })}
      </aside>
      <section>
        {children}
      </section>
    </div>
  </main>;
}
