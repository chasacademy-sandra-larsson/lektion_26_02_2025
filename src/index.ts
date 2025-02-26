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

type User = {
  id: number;
  username: string;
  password: string;
}


// Helper function
async function query(sql:string, params: any[]) {
       const [ result] = await pool.execute(sql, params)
      return result as User[] ;
}


// Route - Skapa användare och lösenord i users-tabellen
app.post("/users", async (req, res) => {

  const { username, password } = req.body;

  try {
    const result = await query(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [username, password]
    );

    console.log(result);
    res.status(201).send("User created")

  } catch(error) {
    console.log("Error creating user", error);
    res.status(500).send("Error creating user");
  }

});

// Login med användare och lösenord och se om det matchar i databasen
app.post("/login", async (req, res) => {

  const { username, password } = req.body;
  try {

    // Hämta användare i db
    const result = await query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    )

    const user = result[0];

    if(user.password === password) {
      res.status(200).send("Login successfull")
    } else {
      res.status(401).send("invalid username or password")
    }

  } catch(error) {

  }
});

app.put("/new-password", async(req, res) => {

  const {username, newPassword} = req.body;

  try {

    const result = await query(
       "SELECT * FROM users WHERE username = ?",
       [username]
    )

    const user = result[0];

    const updatedResult = await query(
      "UPDATE users SET password = ? WHERE id = ?",
      [newPassword, user.id]
    )

    console.log("updatedResult", updatedResult);
    res.status(204).send("User created");


  } catch {
    res.status(500).send("Error updating user")
  }

})

// Ta bort en användare
app.delete("/users", async(req, res) => {
      const { username } = req.body;


      try {

        const result = await query(
          "DELETE FROM users WHERE username = ?",
            [username]
        )

        res.send("User deleted");

      } catch(error) {
        res.status(500).send("Error deleting  user")

      }
})



app.listen(3000, () => {
  console.log("Server is running on port 3000");
});



