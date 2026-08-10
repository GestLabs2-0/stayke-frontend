import type { Hosting, ProfileData, Propiedad, Reserva } from "@/types/profile";

export const profileMock: ProfileData = {
  name: "Carlos",
  lastName: "Rodríguez",
  email: "carlos.r@email.com",
  avatar: "https://api.dicebear.com/9x/avataaars/svg?seed=carlos",
  isVerified: true,
  reputation: { host: 4.8, guest: 4.5 },
  treasuryUsd: 1250.0,
};

export const hostingsMock: Hosting[] = [
  {
    id: "h1",
    propertyName: "Casa Boutique en Medellín",
    location: "Medellín, Antioquia",
    active: true,
    checkIn: "15 jun",
    checkOut: "18 jun",
    guest: "Ana Martínez",
    image:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
  },
  {
    id: "h2",
    propertyName: "Apartamento de Lujo Bogotá",
    location: "Bogotá, Cundinamarca",
    active: true,
    checkIn: "10 jul",
    checkOut: "15 jul",
    guest: "Luis Fernández",
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop",
  },
  {
    id: "h3",
    propertyName: "Cabaña Andina en Páez",
    location: "Páez, Huila",
    active: false,
    checkIn: "20 abr",
    checkOut: "25 abr",
    guest: "María González",
    image:
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=400&h=300&fit=crop",
  },
];

export const propertiesMock: Propiedad[] = [
  {
    id: "p1",
    name: "Casa Sierra Bucaramanga",
    location: "Bucaramanga, Santander",
    published: true,
    image:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop",
  },
  {
    id: "p2",
    name: "Apartamento Moderno Medellín",
    location: "Medellín, Antioquia",
    published: true,
    image:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
  },
  {
    id: "p3",
    name: "Cabaña de Lujo en Salento",
    location: "Salento, Quindío",
    published: false,
    image:
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=400&h=300&fit=crop",
  },
];

export const reservationsMock: Reserva[] = [
  {
    id: "r1",
    propertyName: "Casa Sierra Bucaramanga",
    location: "Bucaramanga, Santander",
    active: true,
    checkIn: "5 ago",
    checkOut: "10 ago",
    host: "Luis Hernández",
    totalUsd: 560,
    image:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop",
  },
  {
    id: "r2",
    propertyName: "Hotel Boutique Cartagena",
    location: "Cartagena, Bolívar",
    active: false,
    checkIn: "14 feb",
    checkOut: "18 feb",
    host: "María Gómez",
    totalUsd: 1200,
    image:
      "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=400&h=300&fit=crop",
  },
  {
    id: "r3",
    propertyName: "Resort en Pasto",
    location: "Pasto, Nariño",
    active: false,
    checkIn: "20 ene",
    checkOut: "25 ene",
    host: "Carlos Méndez",
    totalUsd: 400,
    image:
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop",
  },
];
