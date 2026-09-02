import ListingCard from "@/components/ListingCard";
import { listings, organizations } from "@/lib/data";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, MapPin, Star } from "lucide-react";
import { notFound } from "next/navigation";

export default async function OrganizationProfile({params}:{params:Promise<{author:string}>}) {
 const { author } = await params;
 const authorName = decodeURIComponent(author);
 const authorListings = listings.filter(item => item.author === authorName);
 const organization = organizations.find(item => item.name === authorName);
 if (!authorListings.length && !organization) return notFound();
 const profile = organization ?? {
   name: authorName,
   region: authorListings[0].region,
   rating: authorListings[0].rating,
   type: "Участник рынка",
 };
 const isVerified = authorListings.some(item => item.verified);

 return <main className="container" style={{padding:"45px 0 70px"}}>
  <Link href="/announcements" className="btn btn-primary"><ArrowLeft size={15}/> Все объявления</Link>
  <section className="card" style={{padding:30,marginTop:22}}>
   <div style={{display:"flex",justifyContent:"space-between",gap:20,alignItems:"start"}}>
    <div style={{display:"flex",gap:16,alignItems:"center"}}>
     <div style={{width:58,height:58,borderRadius:18,background:"#edf3e8",display:"grid",placeItems:"center",color:"var(--green)",fontWeight:900,fontSize:22}}>{profile.name[0]}</div>
     <div>
      <div className="muted" style={{fontSize:13,fontWeight:800}}>ПРОФИЛЬ УЧАСТНИКА</div>
      <h1 style={{fontSize:30,margin:"5px 0"}}>{profile.name} {isVerified && <CheckCircle2 size={18} color="var(--green)" style={{verticalAlign:"-2px"}}/>}</h1>
      <div className="muted"><MapPin size={15} style={{verticalAlign:"-3px"}}/> {profile.region} · {profile.type}</div>
     </div>
    </div>
    <div style={{display:"flex",gap:6,alignItems:"center",fontWeight:800}}><Star size={18} fill="currentColor"/> {profile.rating}</div>
   </div>
  </section>
  <section style={{marginTop:30}}>
   <h2 style={{fontSize:27,margin:"0 0 16px"}}>Объявления автора ({authorListings.length})</h2>
   <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:18}}>{authorListings.map(item => <ListingCard key={item.id} item={item}/>)}</div>
  </section>
 </main>;
}
