"use client";

import DashboardLayout from "@/components/DashboardLayout";
import Link from "next/link";
import { useState } from "react";
import { useListings } from "@/components/ListingsContext";

export default function MyListings() {
  const [hoverId, setHoverId] = useState<string | null>(null);
  const { listings } = useListings();

  return <DashboardLayout>
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <h2 style={{margin:0}}>Мои активные объявления</h2>
        <Link href="/announcements/new" className="btn btn-primary">Новое объявление</Link>
      </div>
      <div style={{display:"grid",gap:12}}>
        {listings.map(listing => (
          <Link href={`/dashboard/my-listings/${listing.id}`} key={listing.id} style={{textDecoration:"none",color:"inherit"}}>
            <div 
              className="card" 
              style={{
                padding:16,
                cursor:"pointer",
                transition:"all 0.2s",
                border:"1px solid var(--line)",
                borderColor: hoverId === listing.id ? "var(--green)" : "var(--line)",
                background: hoverId === listing.id ? "#f7f8f2" : "transparent"
              }} 
              onMouseEnter={() => setHoverId(listing.id)} 
              onMouseLeave={() => setHoverId(null)}
            >
              <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:20,alignItems:"start"}}>
                <div>
                  <div style={{fontWeight:700,fontSize:16}}>{listing.title}</div>
                  <div className="muted" style={{fontSize:13,marginTop:4}}>{listing.category} • {listing.volume}</div>
                  <div style={{marginTop:8,display:"flex",gap:12,alignItems:"center"}}>
                    <span style={{fontWeight:700,color:"var(--green)"}}>{listing.price}</span>
                    <span style={{background:"#edf3e8",color:"var(--green)",padding:"4px 10px",borderRadius:8,fontSize:12,fontWeight:700}}>
                      ✓ Активно
                    </span>
                  </div>
                </div>
                <div style={{textAlign:"right",fontSize:12,color:"#999"}}>
                  Нажмите для редактирования →
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  </DashboardLayout>;
}
