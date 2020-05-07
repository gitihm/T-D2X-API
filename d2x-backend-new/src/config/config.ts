const secretKey = 'iutyiyvbsdfjhvbas';

export const Config = {
  port: 8000,
  secretKey: secretKey,
  dev: false,
  expiresIn: '48h',
  ImagePath: {
    payment: '/payment',
    product: '/product',
    user: '/user',
  },
  apipath: {
    host: 'https://d2xapi.medizerva.com',
  },
  webpath: {
    host: 'https://d2x.medizerva.com',
  },
  database: {
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '',
    database: 'd2x',
  },
  ml:{
    port : 9999
  }
};
