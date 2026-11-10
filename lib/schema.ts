export const restaurantJsonLd = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  "@id": "https://michisushigranada.es/#restaurant",
  name: "Michi Sushi Granada",
  description:
    "Bienvenido a Michi Sushi, tu destino para disfrutar del auténtico sushi y tapeo en Granada.",
  url: "https://michisushigranada.es",
  logo: "https://michisushigranada.es/icon.png",
  image: "https://michisushigranada.es/portada.jpg",
  telephone: "+34673821148",
  priceRange: "10€ - 20€",
  currenciesAccepted: "EUR",
  paymentAccepted: "Efectivo, Tarjeta de crédito, Tarjeta de débito, NFC",
  servesCuisine: ["Asiática", "Japonesa", "Sushi", "Tapas", "Fusión", "Nikkei"],
  acceptsReservations: "True",
  menu: "https://michisushigranada.es/product",
  hasMap: "https://maps.google.com/?q=Michi+Sushi+Granada",
  sameAs: ["https://www.instagram.com/michisushigranada"],
  amenityFeature: [
    {
      "@type": "LocationFeatureSpecification",
      name: "Terraza exterior",
      value: true,
    },
  ],
  address: {
    "@type": "PostalAddress",
    streetAddress: "C/ Gutierre Tibón, Santiago Lozano, 8, Local 2",
    addressLocality: "Granada",
    addressRegion: "Granada",
    postalCode: "18011",
    addressCountry: "ES",
  },
  areaServed: {
    "@type": "City",
    name: "Granada",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 37.197459,
    longitude: -3.601981,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday"],
      opens: "20:00",
      closes: "23:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "08:00",
      closes: "16:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "20:00",
      closes: "23:00",
    },
  ],
  potentialAction: {
    "@type": "ReserveAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://michisushigranada.es/reservar",
      inLanguage: "es-ES",
      actionPlatform: [
        "http://schema.org/DesktopWebPlatform",
        "http://schema.org/MobileWebPlatform",
      ],
    },
    result: {
      "@type": "FoodEstablishmentReservation",
      name: "Reserva de mesa",
    },
  },
};
