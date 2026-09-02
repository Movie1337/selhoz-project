"use client";

import { Check, Copy, MessageCircle, Phone, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import Link from "next/link";

type Modal = "contact" | null;

export default function ContactActions({author}:{author:string}) {
 const [modal, setModal] = useState<Modal>(null);
 const { isAuthenticated, openAuth } = useAuth();
 const [phoneVisible, setPhoneVisible] = useState(false);
 const [copied, setCopied] = useState(false);
 const phone = "+7 (927) 123-45-67";

 const openContact = () => isAuthenticated ? setModal("contact") : openAuth("register");
 const copyPhone = async () => {
  await navigator.clipboard.writeText(phone);
  setCopied(true);
 };

 return <>
  <button onClick={openContact} className="btn btn-primary" style={{width:"100%"}}><MessageCircle size={17}/> Связаться</button>
  {modal && <div role="dialog" aria-modal="true" style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",display:"grid",placeItems:"center",padding:20,zIndex:1000}}>
   <div className="card" style={{width:"100%",maxWidth:430,padding:28,position:"relative"}}>
    <button onClick={() => setModal(null)} aria-label="Закрыть" style={{position:"absolute",right:18,top:18,border:0,background:"transparent",cursor:"pointer",padding:4}}><X size={21}/></button>
    <>
     <h2 style={{margin:"0 0 8px",fontSize:25}}>Связаться с автором</h2>
     <p className="muted" style={{margin:"0 0 22px"}}>{author}</p>
     <div style={{display:"grid",gap:10}}>
    <Link className="btn btn-primary" href={`/dashboard/messages?with=${encodeURIComponent(author)}`}><MessageCircle size={17}/> Написать</Link>
      <button onClick={() => setPhoneVisible(true)} className="btn btn-secondary"><Phone size={17}/> Позвонить</button>
     </div>
     <div style={{marginTop:18,padding:15,borderRadius:13,background:"#f7f8f2"}}>
      <div className="muted" style={{fontSize:12,marginBottom:7}}>Номер телефона</div>
      {phoneVisible ? <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}><span style={{fontWeight:800,userSelect:"text"}}>{phone}</span><button onClick={copyPhone} className="btn btn-secondary" style={{minHeight:36,padding:"0 12px"}}>{copied ? <><Check size={15}/> Скопировано</> : <><Copy size={15}/> Копировать</>}</button></div> : <button onClick={() => setPhoneVisible(true)} style={{border:0,padding:0,background:"transparent",fontWeight:800,cursor:"pointer",letterSpacing:2}}>+7 (927) •••-••-••</button>}
     </div>
    </>
   </div>
  </div>}
 </>;
}
