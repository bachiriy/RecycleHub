constructor() {
  // Initialize collectors if not exists
  if (!localStorage.getItem(this.USERS_KEY)) {
    const initialCollectors: User[] = [
      {
        id: '1',
        email: 'collector1@recyclehub.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Collector',
        address: '123 Recycling St',
        city: 'Casablanca',
        phone: '0600000000',
        birthDate: new Date('1990-01-01'),
        role: 'COLLECTOR',
        points: 0
      },
      {
        id: '2',
        email: 'collector2@recyclehub.com',
        password: 'password123',
        firstName: 'Jane',
        lastName: 'Collector',
        address: '456 Recycling Ave',
        city: 'Rabat',
        phone: '0600000001',
        birthDate: new Date('1992-01-01'),
        role: 'COLLECTOR',
        points: 0
      }
    ];
    localStorage.setItem(this.USERS_KEY, JSON.stringify(initialCollectors));
  }
} 