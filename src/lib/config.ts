export const site = {
  name: "GARAGE",
  fullName: "Garage Clothing Boutique",
  tagline: "Moda masculina premium a un clic: marcas originales de EE. UU. con la confianza de siempre y entrega directa.",
  years: 30,
  whatsapp: "593999999999",
  whatsappDisplay: "+593 99 999 9999",
  email: "ventas@garageclothing.com",
  stores: [
    {
      city: "Ambato",
      address: "Av. Cevallos y calle Bosco (local físico)",
      hours: "Lun a Sáb: 9h00 - 19h00",
    },
    {
      city: "Riobamba",
      address: "Centro histórico, local físico",
      hours: "Lun a Sáb: 9h00 - 19h00",
    },
  ],
  provinces: [
    { name: "Tungurahua", note: "Entrega en 24-48 horas" },
    { name: "Chimborazo", note: "Entrega en 24-48 horas" },
    { name: "Bolívar", note: "Coordinado por asesor" },
    { name: "Cotopaxi", note: "Coordinado por asesor" },
    { name: "Pastaza", note: "Coordinado por asesor" },
  ],
  social: {
    tiktok: "https://www.tiktok.com/@garageclothing",
    instagram: "https://www.instagram.com/garageclothing",
    facebook: "https://www.facebook.com/garageclothing",
  },
};

export function waLink(message: string): string {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}
