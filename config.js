// Контакти: порожні поля на сайті не показуються.
window.SITE = {
  instagram: "rghostethen", telegram: "ghostethen", email: "",
  phone: "0638617438",
  hours: { weekdays: "8:00–20:00", weekend: "10:00–22:00" }
};
// Каталог: photo — шлях до файлу в assets/ (напр. "assets/audit.webp"), price — рядок або {ua,en,ru}.
// Порожньо: картка без фото (дизайнерський фон) і з написом "Індивідуально".
window.CATALOG = { audit: { photo: "", price: "" }, smm: { photo: "", price: "" }, web: { photo: "", price: "" } };
// Довіра: ТІЛЬКИ реальні дані. Порожні масиви — блок не показується.
// stats:   { value: "25+", label: { ua: "…", en: "…", ru: "…" } }
// reviews: { text: { ua: "…", en: "…", ru: "…" }, author: "Ім'я", role: { ua: "…", en: "…", ru: "…" } }
window.TRUST = { stats: [], reviews: [] };
