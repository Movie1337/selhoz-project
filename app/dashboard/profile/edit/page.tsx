"use client";

import DashboardLayout from "@/components/DashboardLayout";
import Link from "next/link";
import { ArrowLeft, Camera, X } from "lucide-react";
import { useProfile } from "@/components/ProfileContext";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";

export default function EditProfile() {
  const { profile, updateProfile } = useProfile();
  const router = useRouter();

  const [formData, setFormData] = useState({
    phone: profile.phone,
    firstName: profile.firstName,
    lastName: profile.lastName,
    organizationName: profile.organizationName,
    inn: profile.inn,
    email: profile.email,
    accountType: profile.accountType as "individual" | "legal"
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [photo, setPhoto] = useState(profile.photo ?? "");
  const [photoError, setPhotoError] = useState("");

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setPhotoError("");

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    const suspiciousName = /(?:nsfw|nude|nudity|sex|porn|xxx|гол|обнаж|эрот|порно|секс)/iu.test(file.name);
    if (!allowedTypes.includes(file.type) || suspiciousName) {
      setPhotoError("Фото не прошло модерацию. Загрузите подходящее изображение без откровенного или неподобающего содержимого.");
      event.target.value = "";
      return;
    }

    const image = new Image();
    image.onload = () => {
      if (image.width > 500 || image.height > 500) {
        setPhotoError("Размер фото не должен превышать 500 на 500 пикселей.");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => setPhoto(String(reader.result));
      reader.readAsDataURL(file);
    };
    image.onerror = () => setPhotoError("Не удалось проверить фото. Выберите другое изображение.");
    image.src = URL.createObjectURL(file);
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    
    if (name === "phone") {
      let digits = value.replace(/\D/g, "");
      
      if (digits.startsWith("8")) {
        digits = "7" + digits.slice(1);
      }
      if (!digits.startsWith("7")) {
        digits = "7" + digits;
      }
      if (digits.length > 11) {
        digits = digits.slice(0, 11);
      }
      
      const formatted = "+7 " + (digits.length > 1 ? digits.slice(1) : "");
      setFormData(prev => ({...prev, phone: formatted}));
    } else {
      setFormData(prev => ({...prev, [name]: value}));
    }
  };

  const handlePasswordChange = (e: any) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({...prev, [name]: value}));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setError("");
    
    if (formData.accountType === "individual") {
      if (!formData.firstName || !formData.lastName || !formData.phone || !formData.email) {
        setError("Пожалуйста, заполните все поля");
        return;
      }
    } else {
      if (!formData.organizationName || !formData.inn || !formData.email) {
        setError("Пожалуйста, заполните все поля");
        return;
      }
    }

    if (photoError) return;
    updateProfile({...formData, photo});
    router.push("/dashboard/profile");
  };

  const handlePasswordSubmit = (e: any) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordError("Пожалуйста, заполните все поля");
      return;
    }

    if (passwordData.currentPassword !== profile.password) {
      setPasswordError("Текущий пароль неверен");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError("Новый пароль должен содержать минимум 6 символов");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("Пароли не совпадают");
      return;
    }

    updateProfile({ password: passwordData.newPassword });
    setPasswordSuccess("Пароль успешно изменен");
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  return <DashboardLayout>
    <div>
      <Link href="/dashboard/profile" style={{textDecoration:"none",color:"var(--green)",fontWeight:700,display:"inline-flex",alignItems:"center",gap:8,marginBottom:20}}>
        <ArrowLeft size={18}/> Вернуться в профиль
      </Link>
      <div className="card" style={{padding:24,marginBottom:24}}>
        <h2 style={{margin:"0 0 24px"}}>Редактировать профиль</h2>

        <form onSubmit={handleSubmit} style={{display:"grid",gap:16,maxWidth:"600px"}}>
          <div>
            <label style={{display:"grid",gap:8,fontWeight:700}}>Фото профиля
              <div style={{display:"flex",alignItems:"center",gap:14}}>
                <div style={{width:76,height:76,borderRadius:"50%",overflow:"hidden",background:"#edf3e8",display:"grid",placeItems:"center",color:"var(--green)",border:"1px solid var(--line)"}}>
                  {photo ? <img src={photo} alt="Предпросмотр фото профиля" style={{width:"100%",height:"100%",objectFit:"cover"}}/> : <Camera size={25}/>} 
                </div>
                <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
                  <label className="btn btn-secondary" style={{cursor:"pointer"}}><Camera size={16}/> Загрузить фото<input type="file" accept="image/jpeg,image/png,image/webp" onChange={handlePhotoChange} hidden/></label>
                  {photo && <button type="button" className="btn btn-secondary" onClick={() => { setPhoto(""); setPhotoError(""); }}><X size={16}/> Удалить</button>}
                </div>
              </div>
            </label>
            <div className="muted" style={{fontSize:12,marginTop:7}}>JPEG, PNG или WEBP, не более 500×500 пикселей. Фото проходит автоматическую модерацию.</div>
            {photoError && <p role="alert" style={{margin:"8px 0 0",color:"#b42318",fontSize:13,fontWeight:700}}>{photoError}</p>}
          </div>
          <div>
            <label style={{display:"block",fontWeight:700,marginBottom:8}}>Тип аккаунта</label>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <button
                type="button"
                onClick={() => setFormData(prev => ({...prev, accountType: "individual"}))}
                style={{
                  padding:"12px 16px",
                  borderRadius:8,
                  border:"2px solid " + (formData.accountType === "individual" ? "var(--green)" : "var(--line)"),
                  background: formData.accountType === "individual" ? "#f7f8f2" : "white",
                  fontWeight:700,
                  cursor:"pointer",
                  color: formData.accountType === "individual" ? "var(--green)" : "#7b897d",
                  transition:"all 0.2s"
                }}
              >
                Физическое лицо
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({...prev, accountType: "legal"}))}
                style={{
                  padding:"12px 16px",
                  borderRadius:8,
                  border:"2px solid " + (formData.accountType === "legal" ? "var(--green)" : "var(--line)"),
                  background: formData.accountType === "legal" ? "#f7f8f2" : "white",
                  fontWeight:700,
                  cursor:"pointer",
                  color: formData.accountType === "legal" ? "var(--green)" : "#7b897d",
                  transition:"all 0.2s"
                }}
              >
                Юридическое лицо
              </button>
            </div>
          </div>

          {formData.accountType === "individual" ? (
            <>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
                <div>
                  <label style={{display:"grid",gap:7,fontWeight:700}}>
                    Имя
                    <input 
                      type="text" 
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="input"
                      placeholder="Ваше имя"
                    />
                  </label>
                </div>
                <div>
                  <label style={{display:"grid",gap:7,fontWeight:700}}>
                    Фамилия
                    <input 
                      type="text" 
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="input"
                      placeholder="Ваша фамилия"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label style={{display:"grid",gap:7,fontWeight:700}}>
                  Телефон
                  <input 
                    type="text" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="input"
                    placeholder="+7 ..."
                  />
                </label>
              </div>
            </>
          ) : (
            <>
              <div>
                <label style={{display:"grid",gap:7,fontWeight:700}}>
                  Название организации
                  <input 
                    type="text" 
                    name="organizationName"
                    value={formData.organizationName}
                    onChange={handleChange}
                    className="input"
                    placeholder="Название вашей организации"
                  />
                </label>
              </div>

              <div>
                <label style={{display:"grid",gap:7,fontWeight:700}}>
                  ИНН
                  <input 
                    type="text" 
                    name="inn"
                    value={formData.inn}
                    onChange={handleChange}
                    className="input"
                    placeholder="Ваш ИНН"
                  />
                </label>
              </div>
            </>
          )}

          <div>
            <label style={{display:"grid",gap:7,fontWeight:700}}>
              Электронная почта
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input"
                placeholder="ваша@почта.ru"
              />
            </label>
          </div>

          {error && <p role="alert" style={{margin:0,color:"#b42318",fontSize:14,fontWeight:700}}>{error}</p>}

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginTop:8}}>
            <Link href="/dashboard/profile" className="btn btn-secondary" style={{textDecoration:"none",textAlign:"center"}}>
              Отмена
            </Link>
            <button type="submit" className="btn btn-primary">
              Сохранить
            </button>
          </div>
        </form>
      </div>

      <div className="card" style={{padding:24}}>
        <h2 style={{margin:"0 0 24px"}}>Смена пароля</h2>

        <form onSubmit={handlePasswordSubmit} style={{display:"grid",gap:16,maxWidth:"600px"}}>
          <div>
            <label style={{display:"grid",gap:7,fontWeight:700}}>
              Текущий пароль
              <input 
                type="password" 
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className="input"
                placeholder="Введите текущий пароль"
              />
            </label>
          </div>

          <div>
            <label style={{display:"grid",gap:7,fontWeight:700}}>
              Новый пароль
              <input 
                type="password" 
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className="input"
                placeholder="Введите новый пароль"
              />
            </label>
          </div>

          <div>
            <label style={{display:"grid",gap:7,fontWeight:700}}>
              Подтвердите пароль
              <input 
                type="password" 
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                className="input"
                placeholder="Повторите новый пароль"
              />
            </label>
          </div>

          {passwordError && <p role="alert" style={{margin:0,color:"#b42318",fontSize:14,fontWeight:700}}>{passwordError}</p>}
          {passwordSuccess && <p role="status" style={{margin:0,color:"var(--green)",fontSize:14,fontWeight:700}}>{passwordSuccess}</p>}

          <button type="submit" className="btn btn-primary" style={{maxWidth:"200px"}}>
            Изменить пароль
          </button>
        </form>
      </div>
    </div>
  </DashboardLayout>;
}
