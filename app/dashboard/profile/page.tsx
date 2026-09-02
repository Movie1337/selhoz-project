"use client";

import DashboardLayout from "@/components/DashboardLayout";
import Link from "next/link";
import { Edit2, ArrowLeft } from "lucide-react";
import { useProfile } from "@/components/ProfileContext";

export default function ProfilePage() {
  const { profile } = useProfile();

  return <DashboardLayout>
    <div>
      <Link href="/dashboard" style={{textDecoration:"none",color:"var(--green)",fontWeight:700,display:"inline-flex",alignItems:"center",gap:8,marginBottom:20}}>
        <ArrowLeft size={18}/> Вернуться в личный кабинет
      </Link>
      <div className="card" style={{padding:24}}>
        {profile.photo && <img src={profile.photo} alt="Фото профиля" style={{width:88,height:88,borderRadius:"50%",objectFit:"cover",marginBottom:18}}/>}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
          <h2 style={{margin:0}}>Мой профиль</h2>
          <Link href="/dashboard/profile/edit" className="btn btn-primary" style={{textDecoration:"none",display:"inline-flex",alignItems:"center",gap:8}}>
            <Edit2 size={16}/> Редактировать
          </Link>
        </div>

        <div style={{display:"grid",gap:24}}>
          <div>
            <label style={{display:"block",fontSize:13,fontWeight:800,color:"#7b897d",marginBottom:4}}>Тип аккаунта</label>
            <p style={{margin:0,fontSize:16}}>
              {profile.accountType === "individual" ? "Физическое лицо" : "Юридическое лицо"}
            </p>
          </div>

          {profile.accountType === "individual" ? (
            <>
              <div>
                <label style={{display:"block",fontSize:13,fontWeight:800,color:"#7b897d",marginBottom:4}}>Имя</label>
                <p style={{margin:0,fontSize:16}}>
                  {profile.firstName || "—"}
                </p>
              </div>
              <div>
                <label style={{display:"block",fontSize:13,fontWeight:800,color:"#7b897d",marginBottom:4}}>Фамилия</label>
                <p style={{margin:0,fontSize:16}}>
                  {profile.lastName || "—"}
                </p>
              </div>
              <div>
                <label style={{display:"block",fontSize:13,fontWeight:800,color:"#7b897d",marginBottom:4}}>Телефон</label>
                <p style={{margin:0,fontSize:16}}>
                  {profile.phone || "—"}
                </p>
              </div>
            </>
          ) : (
            <>
              <div>
                <label style={{display:"block",fontSize:13,fontWeight:800,color:"#7b897d",marginBottom:4}}>Название организации</label>
                <p style={{margin:0,fontSize:16}}>
                  {profile.organizationName || "—"}
                </p>
              </div>
              <div>
                <label style={{display:"block",fontSize:13,fontWeight:800,color:"#7b897d",marginBottom:4}}>ИНН</label>
                <p style={{margin:0,fontSize:16}}>
                  {profile.inn || "—"}
                </p>
              </div>
            </>
          )}

          <div>
            <label style={{display:"block",fontSize:13,fontWeight:800,color:"#7b897d",marginBottom:4}}>Электронная почта</label>
            <p style={{margin:0,fontSize:16}}>
              {profile.email || "—"}
            </p>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>;
}
