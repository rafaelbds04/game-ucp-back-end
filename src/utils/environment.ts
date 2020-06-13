export const environment = {
    server: { port: process.env.SERVER_PORT || 3333 },
    db: {url: process.env.DB_URL || 'mysql://marcelo_gay:marcelo_gay@localhost:3306/marcelo_tdm'},
  }