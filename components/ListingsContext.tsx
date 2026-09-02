"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { REGIONS } from "@/lib/regions";

export type Listing = {
  id: string;
  title: string;
  author: string;
  type: "Куплю" | "Продам";
  category: string;
  variety: string;
  volume: string;
  region: string;
  price: string;
  deadline: string;
  description: string;
};

type ListingsContextType = {
  listings: Listing[];
  updateListing: (id: string, data: Partial<Listing>) => void;
  deleteListing: (id: string) => void;
  addListing: (listing: Listing) => void;
};

const ListingsContext = createContext<ListingsContextType | null>(null);

const defaultListings: Listing[] = [
  {
    id: "1",
    title: "Куплю семена подсолнечника",
    author: "ООО «АгроСнаб»",
    type: "Куплю",
    category: "Семена",
    variety: "Гибриды",
    volume: "50 тонн",
    region: "Саратовская область",
    price: "до 58 000 ₽/т",
    deadline: "до 20 сентября",
    description: "Ищем поставщика качественных семян подсолнечника. Требуется гибрид с хорошей морозостойкостью. Возможна организация доставки."
  },
  {
    id: "2",
    title: "Продам удобрения NPK",
    author: "КФХ Иванов",
    type: "Продам",
    category: "Удобрения",
    variety: "NPK 15-15-15",
    volume: "200 мешков",
    region: "Рязанская область",
    price: "от 1 200 ₽/шт",
    deadline: "-",
    description: "Высокоэффективные удобрения NPK для всех типов растений. Имеем сертификаты качества. Предоставляем скидки при оптовой закупке."
  },
  {
    id: "3",
    title: "Услуги консультирования",
    author: "ООО «ЮгАгро»",
    type: "Продам",
    category: "Услуги",
    variety: "Консультирование",
    volume: "1 сеанс",
    region: "Воронежская область",
    price: "по договору",
    deadline: "-",
    description: "Предоставляю консультации по агротехнике, выбору сортов и методам хранения урожая. Опыт работы более 15 лет в сельском хозяйстве."
  },
  {
    id: "4",
    title: "Куплю силос кукурузный",
    author: "КФХ Петров",
    type: "Куплю",
    category: "Корма",
    variety: "Силос",
    volume: "30 тонн",
    region: "Ростовская область",
    price: "до 3 500 ₽/т",
    deadline: "до конца сентября",
    description: "Требуется качественный силос кукурузный для кормления скота. Обязательна проверка влажности и наличие ветеринарных документов."
  }
];

export function ListingsProvider({ children }: { children: ReactNode }) {
  const [listings, setListings] = useState<Listing[]>(defaultListings);

  useEffect(() => {
    const saved = localStorage.getItem("listings");
    if (saved) {
      setListings(JSON.parse(saved));
    }
  }, []);

  const updateListing = (id: string, data: Partial<Listing>) => {
    setListings(prev => {
      const updated = prev.map(l => l.id === id ? {...l, ...data} : l);
      localStorage.setItem("listings", JSON.stringify(updated));
      return updated;
    });
  };

  const deleteListing = (id: string) => {
    setListings(prev => {
      const filtered = prev.filter(l => l.id !== id);
      localStorage.setItem("listings", JSON.stringify(filtered));
      return filtered;
    });
  };

  const addListing = (listing: Listing) => {
    setListings(prev => {
      const updated = [...prev, listing];
      localStorage.setItem("listings", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <ListingsContext.Provider value={{ listings, updateListing, deleteListing, addListing }}>
      {children}
    </ListingsContext.Provider>
  );
}

export function useListings() {
  const context = useContext(ListingsContext);
  if (!context) throw new Error("useListings must be used inside ListingsProvider");
  return context;
}
