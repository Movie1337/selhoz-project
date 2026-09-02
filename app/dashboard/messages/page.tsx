"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { MessageCircle, Send } from "lucide-react";
import Link from "next/link";
import { FormEvent, KeyboardEvent, useState } from "react";
import { addActivity } from "@/lib/activity";
import { listings } from "@/lib/data";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

type Message = { text: string; own: boolean };
type Conversation = { author: string; message: string; time: string; history: Message[] };

const conversations: Conversation[] = [
  { author: "ООО «АгроСнаб»", message: "Здравствуйте! Интересует ваше предложение по семенам.", time: "2 ч. назад", history: [{ text: "Здравствуйте! Интересует ваше предложение по семенам.", own: false }, { text: "Добрый день! Готовы обсудить условия поставки.", own: true }] },
  { author: "КФХ Петров", message: "Согласны ли вы на скидку при оптовой закупке?", time: "5 ч. назад", history: [{ text: "Согласны ли вы на скидку при оптовой закупке?", own: false }] },
  { author: "ФГБУ «Саратовская МИС»", message: "Спасибо за информацию, перезвоним вам завтра", time: "1 д. назад", history: [{ text: "Спасибо за информацию, перезвоним вам завтра", own: false }] }
];

const listingIdByAuthor: Record<string, string> = {
  "ООО «АгроСнаб»": "1",
  "КФХ Петров": "4",
  "ФГБУ «Саратовская МИС»": "2"
};

const forbiddenWordPattern = /(?:бляд|бля|блят|еба|ебл|ебан|ебу|ебат|пизд|пизж|хуй|хуйн|хуес|сук|сука|сучк|муд|мудак|гандон|шлюх|дроч|залуп|пидор|пидар|выеб|ёб|еб)/iu;
const confidentialDataPattern = /(?:\+?\d[\d\s().-]{7,}\d|[\w.+-]+@[\w.-]+\.[a-zа-я]{2,}|(?:https?:\/\/|www\.)\S+|\b(?:инн|паспорт|снилс|карта|карт[а-я]*|код|пароль|адрес)\b)/iu;
const validationMessage = "В сообщении используется нецензурное выражение или конфиденциальная информация!";

function validateMessage(text: string) {
  return text.length > 1000 || forbiddenWordPattern.test(text) || confidentialDataPattern.test(text) ? validationMessage : "";
}

function MessagesContent() {
  const searchParams = useSearchParams();
  const requestedAuthor = searchParams.get("with");
  const [selectedAuthor, setSelectedAuthor] = useState<string | null>(requestedAuthor);
  const [messageText, setMessageText] = useState("");
  const [error, setError] = useState("");
  const [sentMessages, setSentMessages] = useState<Record<string, Message[]>>({});
  const selectedConversation = conversations.find(item => item.author === selectedAuthor);
  const history = selectedConversation && selectedAuthor ? [...selectedConversation.history, ...(sentMessages[selectedAuthor] ?? [])] : [];

  const selectConversation = (author: string) => {
    setSelectedAuthor(author);
    setMessageText("");
    setError("");
  };

  const sendMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedAuthor) return;
    const text = messageText.trim();
    if (!text) {
      setError("Введите сообщение.");
      return;
    }
    const messageError = validateMessage(text);
    if (messageError) {
      setError(messageError);
      return;
    }
    setSentMessages(previous => ({ ...previous, [selectedAuthor]: [...(previous[selectedAuthor] ?? []), { text, own: true }] }));
    const relatedListing = listings.find(listing => listing.author === selectedAuthor);
    const relatedListingId = relatedListing?.id ?? listingIdByAuthor[selectedAuthor] ?? "1";
    addActivity({id:`message-${selectedAuthor}`,text:"Новое сообщение!",time:"только что",href:`/announcements/${relatedListingId}`,kind:"message"});
    setMessageText("");
    setError("");
  };

  const handleMessageKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  };

  return <DashboardLayout>
    <style>{`
      .messages-list {
        height: min(560px, calc(100vh - 330px));
        min-height: 300px;
        overflow-y: auto;
        overscroll-behavior: contain;
        padding-right: 8px;
      }
      .messages-list::-webkit-scrollbar,
      .messages-history::-webkit-scrollbar { width: 8px; }
      .messages-list::-webkit-scrollbar-thumb,
      .messages-history::-webkit-scrollbar-thumb { background: #c6d5c2; border-radius: 8px; }
      @media (max-width: 700px) {
        .messages-list { height: 360px; }
      }
    `}</style>
    <div className="card" style={{padding:24}}>
      <h2 style={{marginTop:0,fontWeight:900,color:"var(--green)"}}>Сообщения</h2>
      <p className="muted">Ваша переписка с потенциальными контрагентами.</p>
      <div style={{display:"grid",gridTemplateColumns:"minmax(0,1fr)",gap:16,marginTop:20}}>
        <div style={{minWidth:0}}>
          <div className="muted" style={{fontSize:12,fontWeight:800,marginBottom:8}}>ДИАЛОГИ</div>
          <div className="messages-list" style={{display:"grid",gap:14}}>
            {conversations.map(conversation => <button key={conversation.author} type="button" onClick={() => selectConversation(conversation.author)} style={{textAlign:"left",padding:"22px 20px",minHeight:104,background:"#f7f8f2",border:"1px solid var(--line)",borderRadius:16,cursor:"pointer",color:"inherit"}}>
              <div style={{display:"flex",justifyContent:"space-between",gap:12,alignItems:"start"}}><Link href={`/organizations/${encodeURIComponent(conversation.author)}`} onClick={event => event.stopPropagation()} style={{fontWeight:800,fontSize:16,color:"var(--green)",textDecoration:"underline",textUnderlineOffset:4}}>{conversation.author}</Link><span className="muted" style={{fontSize:12,whiteSpace:"nowrap"}}>{conversation.time}</span></div>
              <div className="muted" style={{fontSize:14,lineHeight:1.5,marginTop:10,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{conversation.message}</div>
            </button>)}
          </div>
        </div>
        {selectedConversation && <div role="dialog" aria-modal="true" aria-label={`Диалог с ${selectedAuthor}`} style={{position:"fixed",inset:0,zIndex:1000,background:"rgba(0,0,0,.5)",display:"grid",placeItems:"center",padding:20}}>
          <section style={{border:"1px solid var(--line)",borderRadius:16,overflow:"hidden",minWidth:0,width:"100%",maxWidth:620,background:"#fff"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"15px 18px",borderBottom:"1px solid var(--line)",background:"#f7f8f2",fontWeight:800}}><Link href={`/organizations/${encodeURIComponent(selectedConversation.author)}`} style={{color:"var(--green)",textDecoration:"underline",textUnderlineOffset:4}}><MessageCircle size={17} color="var(--green)" style={{verticalAlign:"-3px",marginRight:7}}/>{selectedConversation.author}</Link><button type="button" onClick={() => setSelectedAuthor(null)} aria-label="Закрыть диалог" style={{border:0,background:"transparent",fontSize:24,lineHeight:1,cursor:"pointer",color:"var(--muted)"}}>×</button></div>
            <div className="messages-history" style={{height:300,overflowY:"auto",padding:18,display:"grid",alignContent:"start",gap:10,background:"#fff",overscrollBehavior:"contain"}}>
              {history.map((item, index) => <div key={`${item.text}-${index}`} style={{justifySelf:item.own ? "end" : "start",maxWidth:"82%",padding:"10px 13px",borderRadius:item.own ? "14px 14px 3px 14px" : "14px 14px 14px 3px",background:item.own ? "var(--green)" : "#edf3e8",color:item.own ? "#fff" : "var(--ink)",lineHeight:1.45}}>{item.text}</div>)}
            </div>
            <form onSubmit={sendMessage} style={{padding:14,borderTop:"1px solid var(--line)"}}>
            <textarea value={messageText} onChange={event => { setMessageText(event.target.value); if (error) setError(""); }} onKeyDown={handleMessageKeyDown} maxLength={1000} rows={3} className="input" style={{height:"auto",padding:"12px 14px",resize:"vertical"}} placeholder="Напишите сообщение..." />
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,marginTop:8}}><span className="muted" style={{fontSize:12}}>{messageText.length}/1000</span><button className="btn btn-primary" type="submit"><Send size={16}/> Отправить</button></div>
            {error && <p role="alert" style={{margin:"10px 0 0",color:"#b42318",fontSize:13,fontWeight:700}}>{error}</p>}
            </form>
          </section>
        </div>}
      </div>
    </div>
  </DashboardLayout>;
}

  export default function Messages() {
    return <Suspense fallback={<DashboardLayout><div className="card" style={{padding:24}}>Загрузка сообщений...</div></DashboardLayout>}><MessagesContent/></Suspense>;
  }
