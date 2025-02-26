import express from "express";
import cors from "cors";
import mysql from 'mysql2/promise'

const app = express();

app.use(cors());
app.use(express.json());

// Uppkoppling mot databasen
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "banksajt2025",
  port: 8889 // Mac 8889, Windows 3306
});



// Helper function
async function query(sql:string, params: any[]) {
       const [ result] = await pool.execute(sql, params)
      return result;
}


app.get("/", (req, res) => {
  res.send("Node.js and Express.js with TypeScript");
});






app.listen(3000, () => {
  console.log("Server is running on port 3000");
});



