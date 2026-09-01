export type Role = "Компания" | "Фермер" | "Бюджетное учреждение" | "Другое";
export type ListingType = "Куплю" | "Продам";

export const listings = [
  { id: "1", type: "Куплю" as ListingType, title: "Куплю семена подсолнечника", category: "Семена", variety: "Гибриды", volume: "50 тонн", region: "Саратовская область", price: "до 58 000 ₽/т", deadline: "до 20 сентября", author: "ООО «АгроСнаб»", rating: 4.8, verified: true },
  { id: "2", type: "Продам" as ListingType, title: "Пшеница продовольственная 3 класса", category: "Зерновые", variety: "Московская 56", volume: "120 тонн", region: "Воронежская область", price: "от 17 500 ₽/т", deadline: "сентябрь", author: "КФХ Иванов", rating: 4.9, verified: true },
  { id: "3", type: "Куплю" as ListingType, title: "Закупка кукурузы на зерно", category: "Зерновые", variety: "Не принципиально", volume: "300 тонн", region: "Ростовская область", price: "обсуждается", deadline: "до 5 октября", author: "ООО «ЮгАгро»", rating: 4.6, verified: true },
  { id: "4", type: "Продам" as ListingType, title: "Подсолнечник урожая 2026", category: "Масличные", variety: "ЛГ 5580", volume: "80 тонн", region: "Саратовская область", price: "56 500 ₽/т", deadline: "октябрь", author: "КФХ Петров", rating: 5.0, verified: false }
];

export const services = [
  { id: "s1", title: "Агрохимический анализ почвы", organization: "ФГБУ «Саратовская МИС»", category: "Лабораторные исследования", region: "Саратовская область", price: "от 1 200 ₽", term: "3–5 рабочих дней", rating: 4.8, reviews: 127, verified: true },
  { id: "s2", title: "Анализ семян на посевные качества", organization: "Центр аграрных исследований", category: "Анализ семян", region: "Самарская область", price: "от 900 ₽", term: "2–4 рабочих дня", rating: 4.7, reviews: 86, verified: true },
  { id: "s3", title: "Обработка полей с БПЛА", organization: "ООО «АгроДрон»", category: "Обработка полей", region: "Саратовская область", price: "от 650 ₽/га", term: "по графику", rating: 4.9, reviews: 54, verified: true }
];

export const organizations = [
  {
    name: "ООО «АгроСнаб»",
    type: "Покупатель",
    region: "Саратовская область",
    category: "Семена",
    rating: 4.8,
    reviews: 127,
    verified: true,
    offers: ["Закупка семян подсолнечника", "Закупка семян зерновых"],
    coordinates: [46.0342, 51.5336] as [number, number],
  },
  {
    name: "КФХ Иванов",
    type: "Поставщик",
    region: "Воронежская область",
    category: "Зерновые",
    rating: 4.9,
    reviews: 86,
    verified: true,
    offers: ["Пшеница 3 класса", "Семена пшеницы", "Кукуруза"],
    coordinates: [39.2003, 51.6608] as [number, number],
  },
  {
    name: "ФГБУ «Саратовская МИС»",
    type: "Учреждение",
    region: "Саратовская область",
    category: "Лабораторные исследования",
    rating: 4.8,
    reviews: 127,
    verified: true,
    offers: ["Агрохимический анализ почвы", "Анализ качества семян"],
    coordinates: [46.0703, 51.5686] as [number, number],
  },
  {
    name: "ООО «АгроДрон»",
    type: "Услуги",
    region: "Саратовская область",
    category: "Обработка полей",
    rating: 4.9,
    reviews: 54,
    verified: true,
    offers: ["Обработка полей с БПЛА", "Мониторинг посевов"],
    coordinates: [46.0208, 51.4952] as [number, number],
  },
  {
    name: "КФХ Петров",
    type: "Поставщик",
    region: "Саратовская область",
    category: "Масличные",
    rating: 5.0,
    reviews: 39,
    verified: false,
    offers: ["Подсолнечник", "Семена подсолнечника"],
    coordinates: [45.9521, 51.6025] as [number, number],
  },
];