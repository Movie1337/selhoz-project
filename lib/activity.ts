export type ActivityItem = {
  id: string;
  text: string;
  time: string;
  href: string;
  kind: "favorite" | "message" | "response" | "review";
};

export const ACTIVITY_KEY = "dashboard-activity";
export const ACTIVITY_EVENT = "dashboard-activity-updated";
export const ACTIVITY_READ_KEY = "dashboard-activity-read";

export const defaultActivity: ActivityItem[] = [
  {id:"default-response",text:"Новый отклик на «Куплю семена подсолнечника»",time:"1 ч. назад",href:"/dashboard/messages?with=%D0%9E%D0%9E%D0%9E%20%C2%AB%D0%90%D0%B3%D1%80%D0%BE%D0%A1%D0%BD%D0%B0%D0%B1%C2%BB",kind:"response"},
  {id:"default-review",text:"Вы получили новый отзыв",time:"2 ч. назад",href:"/dashboard/reviews#review-agrosnab",kind:"review"},
  {id:"default-listing",text:"КФХ Петров добавил объявление",time:"3 ч. назад",href:"/announcements/4",kind:"favorite"}
];

export const readActivity = (): ActivityItem[] => {
  const saved = localStorage.getItem(ACTIVITY_KEY);
  if (!saved) return [];
  try {
    return JSON.parse(saved) as ActivityItem[];
  } catch {
    return [];
  }
};

export const addActivity = (activity: ActivityItem) => {
  const nextActivity = [activity, ...readActivity().filter(item => item.id !== activity.id)].slice(0, 10);
  localStorage.setItem(ACTIVITY_KEY, JSON.stringify(nextActivity));
  window.dispatchEvent(new Event(ACTIVITY_EVENT));
};

export const removeActivity = (id: string) => {
  localStorage.setItem(ACTIVITY_KEY, JSON.stringify(readActivity().filter(item => item.id !== id)));
  window.dispatchEvent(new Event(ACTIVITY_EVENT));
};

export const readAllActivity = () => [...readActivity(), ...defaultActivity.filter(defaultItem => !readActivity().some(item => item.id === defaultItem.id))];

export const readUnreadActivity = () => {
  const readIds = JSON.parse(localStorage.getItem(ACTIVITY_READ_KEY) ?? "[]") as string[];
  return readAllActivity().filter(item => !readIds.includes(item.id));
};

export const markActivityViewed = () => {
  localStorage.setItem(ACTIVITY_READ_KEY, JSON.stringify(readAllActivity().map(item => item.id)));
  window.dispatchEvent(new Event(ACTIVITY_EVENT));
};
