# АгроСвязь — MVP

Концепт цифровой аграрной платформы в стиле Farmish: светлый интерфейс, природная палитра, крупная типографика, карточки, карта и сценарии marketplace.

## Стек

- Next.js 15 + App Router
- React 19
- TypeScript
- Tailwind CSS v4
- Lucide React
- На следующем этапе: Supabase/PostgreSQL, Auth.js или Supabase Auth, MapLibre/Mapbox, Zod, React Hook Form, realtime messaging, object storage.

## Запуск в VS Code

Требуется Node.js LTS.

```bash
npm install
npm run dev
```

Откройте http://localhost:3000.

## Что уже реализовано

- Главная страница
- Объявления «Куплю / Продам»
- Фильтры интерфейса
- Страница объявления
- Форма создания объявления
- Каталог услуг
- Карта с объектами и фильтрами
- Каталог организаций
- Личный кабинет
- Адаптивная визуальная система
- Единая архитектура, готовая к подключению API и мобильного клиента

## Архитектура production-версии

Web (Next.js) ↔ API/Server Actions ↔ PostgreSQL/Supabase ↔ Storage

Mobile (React Native/Expo) ↗

Основные сущности БД:
users, organizations, profiles, listings, listing_responses, services, reviews, favorites, conversations, messages, locations, verification_documents, notifications.

Для реального запуска нужно заменить mock-data на БД, добавить авторизацию, серверную валидацию, загрузку фото/документов, модерацию, realtime-сообщения и геокодирование.
