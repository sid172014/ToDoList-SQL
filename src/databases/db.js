import mysql from 'mysql2'

// Creating the pool for the MYSQL server
const pool = mysql.createPool({
    host : process.env.MYSQL_HOST,
    user : process.env.MYSQL_USER,
    password : process.env.MYSQL_PASSWORD,
    database : process.env.MYSQL_DATABASE  
}).promise();



// This function will return all the rows that exists within our 'todolist' database inside the 'tasks' table
export const rows = async () =>{    // For exporting the functions that we right here we are using 'exports' keyword rather than the 'modules.exports' object because we have specified the 'type : module' inside the 'package.json' file
    const result = await pool.query("SELECT * FROM tasks");
    return result[0];
}


// This function will return the row which has the id that we would have passed in the function below
export const row = async(id) => {
    const result = await pool.query(`SELECT * FROM tasks WHERE id = ?` , [id])
    return result[0];
} 


// Creating a new entry or row 
export const createNote = async(task) => {
    const result = await pool.query(`INSERT INTO tasks(task) VALUES (?)`,[task]);   // This is for inserting the values of new tasks that we create into the database table
    const id = result[0].insertId;
    return await row(id);
}

// Updating the completion of a row or task
export const completeTask = async(id , completionStatus) => {
    const result =    await pool.query(`UPDATE tasks SET completed = ? WHERE id = ?`,[completionStatus,id]);
    return row(id);
}

export const deleteTask = async (id) => {
    const result  = await pool.query(`DELETE FROM tasks WHERE id = ?`, [id]);
    return row(id);
}

