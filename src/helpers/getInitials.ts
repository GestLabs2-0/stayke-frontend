export const getInitials = (name: string, lastName: string) =>
  `${name.trim().charAt(0)}${lastName.trim().charAt(0)}`.toUpperCase();
