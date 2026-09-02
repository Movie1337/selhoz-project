"use client";

import DashboardLayout from "@/components/DashboardLayout";
import Link from "next/link";
import { ArrowLeft, Edit2, Trash2 } from "lucide-react";
import { useListings } from "@/components/ListingsContext";
import { useRouter } from "next/navigation";
import { useState, use } from "react";

export default function ListingDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { listings, deleteListing } = useListings();
  const router = useRouter();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const listing = listings.find(l => l.id === id);

  if (!listing) {
    return <DashboardLayout>
      <div className="card" style={{padding:24,textAlign:"center"}}>
        <h2>Объявление не найдено</h2>
        <Link href="/dashboard/my-listings" className="btn btn-primary" style={{marginTop:16}}>Вернуться к объявлениям</Link>
      </div>
    </DashboardLayout>;
  }

  const handleDelete = () => {
    deleteListing(listing.id);
    router.push("/dashboard/my-listings");
  };

  return <DashboardLayout>
    <div>
      <Link href="/dashboard/my-listings" style={{textDecoration:"none",color:"var(--green)",fontWeight:700,display:"inline-flex",alignItems:"center",gap:8,marginBottom:20}}>
        <ArrowLeft size={18}/> Вернуться к объявлениям
      </Link>
      <div className="card" style={{padding:24}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"start",marginBottom:20}}>
          <div>
            <h2 style={{margin:"0 0 8px"}}>{listing.title}</h2>
            <div className="muted">{listing.region}</div>
          </div>
          <div style={{display:"flex",gap:10}}>
            <Link href={`/dashboard/my-listings/${listing.id}/edit`} className="btn btn-secondary" style={{display:"flex",gap:8,alignItems:"center",textDecoration:"none",color:"inherit"}}>
              <Edit2 size={17}/> Редактировать
            </Link>
            <button 
              className="btn btn-secondary" 
              style={{display:"flex",gap:8,alignItems:"center",color:"#b42318"}}
              onClick={() => setShowDeleteConfirm(true)}
            >
              <Trash2 size={17}/> Удалить
            </button>
          </div>
        </div>

        {showDeleteConfirm && (
          <div style={{background:"#fff3cd",border:"1px solid #ffc107",borderRadius:8,padding:16,marginBottom:20}}>
            <div style={{fontWeight:700,marginBottom:12}}>Вы уверены, что хотите удалить это объявление?</div>
            <div style={{display:"flex",gap:10}}>
              <button 
                onClick={handleDelete}
                className="btn btn-secondary"
                style={{color:"#b42318"}}
              >
                Да, удалить
              </button>
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                className="btn btn-secondary"
              >
                Отмена
              </button>
            </div>
          </div>
        )}

        <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:16,marginBottom:24}}>
          <div>
            <div className="muted" style={{fontSize:12}}>Статус</div>
            <div style={{fontWeight:700,marginTop:4,display:"flex",alignItems:"center",gap:8}}>
              <span style={{background:"#edf3e8",color:"var(--green)",padding:"4px 10px",borderRadius:8,fontSize:12,fontWeight:700}}>✓ Активно</span>
            </div>
          </div>
          <div>
            <div className="muted" style={{fontSize:12}}>Тип</div>
            <div style={{fontWeight:700,marginTop:4}}>{listing.type}</div>
          </div>
          <div>
            <div className="muted" style={{fontSize:12}}>Категория</div>
            <div style={{fontWeight:700,marginTop:4}}>{listing.category}</div>
          </div>
          <div>
            <div className="muted" style={{fontSize:12}}>Сорт/Вид</div>
            <div style={{fontWeight:700,marginTop:4}}>{listing.variety}</div>
          </div>
          <div>
            <div className="muted" style={{fontSize:12}}>Объем</div>
            <div style={{fontWeight:700,marginTop:4}}>{listing.volume}</div>
          </div>
          <div>
            <div className="muted" style={{fontSize:12}}>Цена</div>
            <div style={{fontWeight:700,marginTop:4,color:"var(--green)"}}>{listing.price}</div>
          </div>
        </div>

        <div style={{borderTop:"1px solid var(--line)",paddingTop:24}}>
          <div className="muted" style={{fontSize:12}}>Описание</div>
          <p style={{marginTop:8,lineHeight:1.6}}>{listing.description}</p>
        </div>

        <div style={{borderTop:"1px solid var(--line)",paddingTop:24,marginTop:24}}>
          <div className="muted" style={{fontSize:12}}>Крайний срок</div>
          <div style={{fontWeight:700,marginTop:4}}>{listing.deadline}</div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:12,marginTop:24}}>
          <button className="btn btn-secondary">Просмотреть отклики</button>
          <button className="btn btn-primary">Повысить объявление</button>
        </div>
      </div>
    </div>
  </DashboardLayout>;
}
