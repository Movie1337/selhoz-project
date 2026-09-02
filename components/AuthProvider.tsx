"use client";

import { CheckCircle2, ShieldCheck, X } from "lucide-react";
import { createContext, FormEvent, ReactNode, useContext, useEffect, useState } from "react";

type AuthMode = "login" | "register";
type AccountType = "individual" | "legal";
type AuthContextValue = { isAuthenticated: boolean; openAuth: (mode?: AuthMode) => void; logout: () => void };
const AuthContext = createContext<AuthContextValue | null>(null);
const defaultUser = { accountType: "individual", phone: "+7 9999999999", password: "123456789", email: "demo@agrosvyaz.ru", firstName: "Тестовый", lastName: "Пользователь" };

export const useAuth = () => {
 const context = useContext(AuthContext);
 if (!context) throw new Error("useAuth must be used inside AuthProvider");
 return context;
};

export default function AuthProvider({children}:{children:ReactNode}) {
 const [isAuthenticated, setIsAuthenticated] = useState(false);
 const [mode, setMode] = useState<AuthMode>("login");
 const [isOpen, setIsOpen] = useState(false);
 const [error, setError] = useState("");
 const [phone, setPhone] = useState("+7 ");
 const [loginIdentity, setLoginIdentity] = useState("");
 const [accountType, setAccountType] = useState<AccountType>("individual");
 const [organization, setOrganization] = useState("");
 const [inn, setInn] = useState("");

 useEffect(() => {
  if (!window.localStorage.getItem("selhoz-user")) window.localStorage.setItem("selhoz-user", JSON.stringify(defaultUser));
  setIsAuthenticated(window.localStorage.getItem("selhoz-authenticated") === "true");
 }, []);
 const openAuth = (nextMode: AuthMode = "login") => { setMode(nextMode); setError(""); setIsOpen(true); };
 const close = () => { setIsOpen(false); setError(""); };
 const authenticate = () => {
  window.localStorage.setItem("selhoz-authenticated", "true");
  setIsAuthenticated(true);
  close();
 };
 const logout = () => {
  window.localStorage.removeItem("selhoz-authenticated");
  setIsAuthenticated(false);
 };
 const updatePhone = (value: string) => {
  let digits = value.replace(/\D/g, "");
  if (digits.startsWith("7") || digits.startsWith("8")) digits = digits.slice(1);
  if (digits.length > 10) digits = digits.slice(0, 10);
  setPhone(`+7 ${digits}`);
 };
 const submit = (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const phone = String(form.get("phone") ?? "").trim();
  const rawIdentity = String(form.get("identity") ?? "").trim();
  const email = String(form.get("email") ?? "").trim();
  const firstName = String(form.get("firstName") ?? "").trim();
  const lastName = String(form.get("lastName") ?? "").trim();
  const organizationValue = String(form.get("organization") ?? "").trim();
  const innValue = String(form.get("inn") ?? "").replace(/\D/g, "");
  const password = String(form.get("password") ?? "");
  const confirmation = String(form.get("confirmation") ?? "");
  const botCheck = form.get("botCheck") === "on";
  const identity = mode === "login" && accountType === "individual" ? phone : rawIdentity;
  const isPhoneComplete = phone.replace(/\D/g, "").length === 11;
  if (mode === "login" && ((accountType === "individual" && !isPhoneComplete) || (accountType === "legal" && !identity) || !password)) return setError(accountType === "individual" ? "Введите номер телефона и пароль." : "Введите ИНН и пароль.");
  if (mode === "register" && accountType === "individual" && (!isPhoneComplete || !email || !firstName || !lastName || !password || !confirmation)) return setError("Заполните все поля регистрации.");
  if (mode === "register" && accountType === "legal" && (!organizationValue || !email || !password || !confirmation || ![10, 12].includes(innValue.length))) return setError("Заполните все поля и укажите ИНН из 10 или 12 цифр.");
  if (mode === "register" && password.length < 6) return setError("Пароль должен содержать не менее 6 символов.");
  if (mode === "register" && password !== confirmation) return setError("Пароли не совпадают.");
  if (!botCheck) return setError("Подтвердите, что вы не робот.");
  if (mode === "login") {
   const savedUser = window.localStorage.getItem("selhoz-user");
   const user = savedUser ? JSON.parse(savedUser) as {accountType?:AccountType;phone?:string;inn?:string;password:string} : null;
   const savedIdentity = user?.accountType === "legal" ? user.inn : user?.phone;
   const enteredIdentity = identity.replace(/\D/g, "");
   const expectedIdentity = savedIdentity?.replace(/\D/g, "");
   if (!user || expectedIdentity !== enteredIdentity || user.password !== password) return setError("Неверный номер телефона или ИНН, либо пароль.");
  }
  if (mode === "register") window.localStorage.setItem("selhoz-user", JSON.stringify(accountType === "legal" ? {accountType, organization: organizationValue, inn: innValue, email, password} : {accountType, phone, email, firstName, lastName, password}));
  authenticate();
 };

 return <AuthContext.Provider value={{isAuthenticated, openAuth, logout}}>
  {children}
  {isOpen && <div role="dialog" aria-modal="true" style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",display:"grid",placeItems:"center",padding:20,zIndex:1100}}>
   <div className="card" style={{width:"100%",maxWidth:560,padding:32,position:"relative"}}>
    <button onClick={close} aria-label="Закрыть" style={{position:"absolute",right:16,top:16,width:40,height:40,border:"1px solid var(--line)",borderRadius:"50%",background:"#fff",cursor:"pointer",display:"grid",placeItems:"center",padding:0,zIndex:1}}><X size={22}/></button>
    <div style={{display:"flex",gap:8,marginBottom:22}}>
     <button onClick={() => {setMode("login");setError("");}} className={`btn ${mode === "login" ? "btn-primary" : "btn-secondary"}`} style={{flex:1}}>Войти</button>
     <button onClick={() => {setMode("register");setError("");}} className={`btn ${mode === "register" ? "btn-primary" : "btn-secondary"}`} style={{flex:1}}>Регистрация</button>
    </div>
    <h2 style={{fontSize:26,margin:"0 0 8px"}}>{mode === "login" ? "Вход в аккаунт" : "Создать аккаунт"}</h2>
    <p className="muted" style={{margin:"0 0 22px"}}>{mode === "login" ? "Выберите тип аккаунта и введите данные, созданные при регистрации." : "Заполните данные, чтобы размещать объявления и связываться с авторами."}</p>
    <form onSubmit={submit} style={{display:"grid",gap:14}}>
     {mode === "login" ? <><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}><button type="button" onClick={() => {setAccountType("individual");setError("");setPhone("+7 ");setLoginIdentity("");}} className={`btn ${accountType === "individual" ? "btn-primary" : "btn-secondary"}`}>Физическое лицо</button><button type="button" onClick={() => {setAccountType("legal");setError("");setPhone("+7 ");setLoginIdentity("");}} className={`btn ${accountType === "legal" ? "btn-primary" : "btn-secondary"}`}>Юр. лицо</button></div>{accountType === "individual" ? <label style={{display:"grid",gap:7,fontWeight:700}}>Номер телефона<input name="phone" type="tel" value={phone} onChange={event => updatePhone(event.target.value)} className="input" placeholder="+7 (___) ___-__-__"/><span className="muted" style={{fontSize:12,fontWeight:400}}>Вводите номер без 8 и +7</span></label> : <label style={{display:"grid",gap:7,fontWeight:700}}>ИНН<input name="identity" inputMode="numeric" value={loginIdentity} onChange={event => setLoginIdentity(event.target.value.replace(/\D/g, ""))} className="input" placeholder="10 или 12 цифр"/></label>}<label style={{display:"grid",gap:7,fontWeight:700}}>Пароль<input name="password" type="password" className="input" placeholder="Введите пароль"/></label></> : <>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}><button type="button" onClick={() => {setAccountType("individual");setPhone("+7 ");setLoginIdentity("");setOrganization("");setInn("");}} className={`btn ${accountType === "individual" ? "btn-primary" : "btn-secondary"}`}>Физическое лицо</button><button type="button" onClick={() => {setAccountType("legal");setPhone("+7 ");setLoginIdentity("");setOrganization("");setInn("");}} className={`btn ${accountType === "legal" ? "btn-primary" : "btn-secondary"}`}>Юр. лицо</button></div>
      {accountType === "individual" ? <>
      <label style={{display:"grid",gap:7,fontWeight:700}}>Номер телефона<input name="phone" type="tel" value={phone} onChange={event => updatePhone(event.target.value)} className="input" placeholder="+7 (___) ___-__-__"/><span className="muted" style={{fontSize:12,fontWeight:400}}>Вводите номер без 8 и +7</span></label>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}><label style={{display:"grid",gap:7,fontWeight:700}}>Имя<input name="firstName" className="input" placeholder="Иван"/></label><label style={{display:"grid",gap:7,fontWeight:700}}>Фамилия<input name="lastName" className="input" placeholder="Иванов"/></label></div>
      </> : <><label style={{display:"grid",gap:7,fontWeight:700}}>Название организации<input name="organization" type="text" inputMode="text" value={organization} onChange={event => setOrganization(event.target.value)} className="input" placeholder="Например: ООО «АгроСнаб»"/></label><label style={{display:"grid",gap:7,fontWeight:700}}>ИНН<input name="inn" inputMode="numeric" value={inn} onChange={event => setInn(event.target.value.replace(/\D/g, ""))} className="input" placeholder="10 или 12 цифр"/></label></>}
      <label style={{display:"grid",gap:7,fontWeight:700}}>Электронная почта<input name="email" type="email" className="input" placeholder="name@example.ru"/></label>
      <label style={{display:"grid",gap:7,fontWeight:700}}>Пароль<input name="password" type="password" className="input" placeholder="Не менее 6 символов"/></label>
      <label style={{display:"grid",gap:7,fontWeight:700}}>Подтвердите пароль<input name="confirmation" type="password" className="input" placeholder="Повторите пароль"/></label>
     </>}
     <label style={{display:"flex",gap:10,alignItems:"center",padding:13,border:"1px solid var(--line)",borderRadius:13,cursor:"pointer"}}><input name="botCheck" type="checkbox" style={{width:18,height:18}}/><ShieldCheck size={18} color="var(--green)"/><span style={{fontWeight:700}}>Я не робот</span></label>
     {error && <p role="alert" style={{margin:0,color:"#b42318",fontSize:14,fontWeight:700}}>{error}</p>}
     <button className="btn btn-primary" type="submit" style={{width:"100%"}}><CheckCircle2 size={17}/>{mode === "login" ? "Войти" : "Зарегистрироваться"}</button>
    </form>
   </div>
  </div>}
 </AuthContext.Provider>;
}
