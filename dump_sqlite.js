const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./prisma/dev.db');

db.serialize(() => {
  db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log("Tables:");
    tables.forEach(table => console.log(table.name));
    
    // Dump WebsiteSettings just in case
    db.all("SELECT * FROM WebsiteSettings", (err, rows) => {
        console.log("WebsiteSettings:", rows);
    });
    // Let's dump all data from all tables to see if gurjar is there
    tables.forEach(table => {
        db.all(`SELECT * FROM ${table.name}`, (err, rows) => {
            if (rows && rows.length > 0) {
                const jsonStr = JSON.stringify(rows);
                if (jsonStr.includes("gurjar")) {
                    console.log(`FOUND IN ${table.name}:`, jsonStr);
                }
            }
        });
    });
  });
});
db.close();
