"use client";

import DashboardLayout from "@/components/DashboardLayout";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useListings } from "@/components/ListingsContext";
import { useRouter } from "next/navigation";
import { useState, use } from "react";
import { REGIONS } from "@/lib/regions";

export default function EditListing({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { listings, updateListing } = useListings();
  const router = useRouter();
  const listing = listings.find(l => l.id === id);

  const [formData, setFormData] = useState(listing || {
    title: "",
    type: "Куплю" as const,
    category: "",
    variety: "",
    volume: "",
    region: "",
    price: "",
    deadline: "",
    description: ""
  });

  const [error, setError] = useState("");

  if (!listing) {
    return <DashboardLayout>
      <div className="card" style={{padding:24,textAlign:"center"}}>
        <h2>Объявление не найдено</h2>
        <Link href="/dashboard/my-listings" className="btn btn-primary" style={{marginTop:16}}>Вернуться к объявлениям</Link>
      </div>
    </DashboardLayout>;
  }

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({...prev, [name]: value}));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    
    if (!formData.title || !formData.category || !formData.volume || !formData.region || !formData.price || !formData.description) {
      setError("Пожалуйста, заполните все поля");
      return;
    }

    updateListing(listing.id, formData);
    router.push(`/dashboard/my-listings/${listing.id}`);
  };

  return <DashboardLayout>
    <style>{`
      .custom-select {
        appearance: none;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23548c3e' d='M1.5 4.5l4.5 4 4.5-4'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 12px center;
        background-color: white;
        border: 1px solid var(--line);
        border-radius: 8px;
        padding: 8px 12px 8px 12px;
        padding-right: 32px;
        font-family: inherit;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.2s;
      }
      
      .custom-select:hover {
        border-color: var(--green);
      }
      
      .custom-select:focus {
        outline: none;
        border-color: var(--green);
        background-color: #f7f8f2;
        box-shadow: inset 0 0 0 2px rgba(84, 140, 62, 0.1);
      }
    `}</style>
    <div>
      <Link href={`/dashboard/my-listings/${listing.id}`} style={{textDecoration:"none",color:"var(--green)",fontWeight:700,display:"inline-flex",alignItems:"center",gap:8,marginBottom:20}}>
        <ArrowLeft size={18}/> Вернуться к объявлению
      </Link>
      <div className="card" style={{padding:24}}>
        <h2 style={{margin:"0 0 24px"}}>Редактировать объявление</h2>

        <form onSubmit={handleSubmit} style={{display:"grid",gap:16}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            <div>
              <label style={{display:"grid",gap:7,fontWeight:700}}>
                Название
                <input 
                  type="text" 
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="input"
                  placeholder="Название объявления"
                />
              </label>
            </div>
            <div>
              <label style={{display:"grid",gap:7,fontWeight:700}}>
                Тип
                <select 
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="custom-select input"
                  style={{paddingRight: 32}}
                >
                  <option>Куплю</option>
                  <option>Продам</option>
                </select>
              </label>
            </div>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            <div>
              <label style={{display:"grid",gap:7,fontWeight:700}}>
                Категория
                <input 
                  type="text" 
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="input"
                  placeholder="Например: Семена"
                />
              </label>
            </div>
            <div>
              <label style={{display:"grid",gap:7,fontWeight:700}}>
                Сорт/Вид
                <input 
                  type="text" 
                  name="variety"
                  value={formData.variety}
                  onChange={handleChange}
                  className="input"
                  placeholder="Например: Гибриды"
                />
              </label>
            </div>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            <div>
              <label style={{display:"grid",gap:7,fontWeight:700}}>
                Объем
                <input 
                  type="text" 
                  name="volume"
                  value={formData.volume}
                  onChange={handleChange}
                  className="input"
                  placeholder="Например: 50 тонн"
                />
              </label>
            </div>
            <div>
              <label style={{display:"grid",gap:7,fontWeight:700}}>
                Регион
                <select 
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  className="custom-select input"
                  style={{paddingRight: 32}}
                >
                  <option value="">Выберите регион</option>
                  {REGIONS.map(region => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            <div>
              <label style={{display:"grid",gap:7,fontWeight:700}}>
                Цена
                <input 
                  type="text" 
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="input"
                  placeholder="Например: до 58 000 ₽/т"
                />
              </label>
            </div>
            <div>
              <label style={{display:"grid",gap:7,fontWeight:700}}>
                Крайний срок
                <input 
                  type="text" 
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  className="input"
                  placeholder="Например: до 20 сентября"
                />
              </label>
            </div>
          </div>

          <div>
            <label style={{display:"grid",gap:7,fontWeight:700}}>
              Описание
              <textarea 
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="input"
                placeholder="Подробное описание объявления"
                style={{minHeight:120}}
              />
            </label>
          </div>

          {error && <p role="alert" style={{margin:0,color:"#b42318",fontSize:14,fontWeight:700}}>{error}</p>}

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <Link href={`/dashboard/my-listings/${listing.id}`} className="btn btn-secondary" style={{textDecoration:"none",textAlign:"center"}}>
              Отмена
            </Link>
            <button type="submit" className="btn btn-primary">
              Сохранить изменения
            </button>
          </div>
        </form>
      </div>
    </div>
  </DashboardLayout>;
}
