"use client";

import DashboardLayout from "@/components/DashboardLayout";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { Send, Star } from "lucide-react";

const RATING_VIEWED_KEY = "dashboard-rating-viewed";

type Review = { author: string; rating: number; comment: string };
type Replies = Record<string, string>;

const reviews: Review[] = [
  { author: "ООО «АгроСнаб»", rating: 5, comment: "Отличный поставщик, быстрая доставка!" },
  { author: "КФХ Петров", rating: 4.5, comment: "Хорошее качество товара, рекомендуем" },
  { author: "Фермерское хозяйство Сидорова", rating: 5, comment: "Профессиональный подход, честные цены" }
];

const forbiddenWordPattern = /(?:бляд|бля|блят|еба|ебл|ебан|ебу|ебат|пизд|пизж|хуй|хуйн|хуес|сук|сука|сучк|муд|мудак|гандон|шлюх|дроч|залуп|пидор|пидар|выеб|ёб|еб)/iu;
const confidentialDataPattern = /(?:\+?\d[\d\s().-]{7,}\d|[\w.+-]+@[\w.-]+\.[a-zа-я]{2,}|(?:https?:\/\/|www\.)\S+|\b(?:инн|паспорт|снилс|карта|карт[а-я]*|код|пароль|адрес)\b)/iu;
const moderationMessage = "В сообщении используется нецензурное выражение или конфиденциальная информация!";

export default function Reviews() {
  const [replies, setReplies] = useState<Replies>({});
  const [replyText, setReplyText] = useState<Replies>({});
  const [replyErrors, setReplyErrors] = useState<Replies>({});

  useEffect(() => {
    localStorage.setItem(RATING_VIEWED_KEY, "true");
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("review-replies");
    if (saved) {
      try { setReplies(JSON.parse(saved)); } catch { setReplies({}); }
    }
  }, []);

  const submitReply = (event: FormEvent<HTMLFormElement>, author: string) => {
    event.preventDefault();
    const text = replyText[author]?.trim();
    if (!text) return;
    if (text.length > 1000 || forbiddenWordPattern.test(text) || confidentialDataPattern.test(text)) {
      setReplyErrors(previous => ({ ...previous, [author]: moderationMessage }));
      return;
    }
    const updatedReplies = { ...replies, [author]: text };
    setReplies(updatedReplies);
    localStorage.setItem("review-replies", JSON.stringify(updatedReplies));
    setReplyText(previous => ({ ...previous, [author]: "" }));
    setReplyErrors(previous => ({ ...previous, [author]: "" }));
  };

  return <DashboardLayout>
    <style>{`.reviews-list { max-height: min(620px, calc(100vh - 330px)); overflow-y: auto; overscroll-behavior: contain; padding: 2px 8px 8px 2px; } .reviews-list::-webkit-scrollbar { width: 8px; } .reviews-list::-webkit-scrollbar-thumb { background: #c6d5c2; border-radius: 8px; } @media (max-width: 700px) { .reviews-list { max-height: 520px; } }`}</style>
    <div className="card" style={{padding:24}}>
      <h2 style={{marginTop:0,fontWeight:900,color:"var(--green)"}}>Отзывы</h2>
      <p className="muted">Отзывы о вас от других пользователей платформы.</p>
      <div className="reviews-list" style={{display:"grid",gap:14,marginTop:20}}>
        {reviews.map(review => <article id={review.author === "ООО «АгроСнаб»" ? "review-agrosnab" : undefined} key={review.author} className="card" style={{padding:20,background:"#f7f8f2",border:"1px solid var(--line)"}}>
          <Link href={`/organizations/${encodeURIComponent(review.author)}`} style={{fontWeight:900,color:"var(--green)",textDecoration:"underline",textUnderlineOffset:4}}>{review.author}</Link>
          <div style={{display:"flex",gap:4,alignItems:"center",marginTop:7}}>{[...Array(5)].map((_, index) => <Star key={index} size={14} fill={index < Math.floor(review.rating) ? "var(--green)" : "#ddd"} color={index < Math.floor(review.rating) ? "var(--green)" : "#ddd"}/>)}<span className="muted" style={{fontSize:12,marginLeft:8}}>{review.rating}</span></div>
          <p style={{margin:"12px 0 0",fontSize:14,lineHeight:1.5}}>{review.comment}</p>
          {replies[review.author] && <div style={{marginTop:14,padding:"12px 14px",background:"#fff",borderRadius:12,border:"1px solid var(--line)"}}><div className="muted" style={{fontSize:12,fontWeight:800}}>Ваш ответ</div><div style={{marginTop:5,lineHeight:1.45}}>{replies[review.author]}</div></div>}
          <form onSubmit={event => submitReply(event, review.author)} style={{display:"grid",gap:8,marginTop:16}}><div style={{display:"flex",gap:10}}><input value={replyText[review.author] ?? ""} maxLength={1000} onChange={event => { setReplyText(previous => ({ ...previous, [review.author]: event.target.value })); setReplyErrors(previous => ({ ...previous, [review.author]: "" })); }} className="input" placeholder="Ответить на отзыв..." aria-label={`Ответить пользователю ${review.author}`}/><button type="submit" className="btn btn-primary" aria-label="Отправить ответ" title="Отправить ответ"><Send size={16}/></button></div>{replyErrors[review.author] && <div role="alert" style={{color:"#b42318",fontSize:13,fontWeight:700}}>{replyErrors[review.author]}</div>}</form>
        </article>)}
      </div>
    </div>
  </DashboardLayout>;
}
