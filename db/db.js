import pg from "pg";
import * as config from "../config.js"
const pool = new pg.Pool({
    port: config.dbPort,
    host: config.dbHost,
    database: config.dbName,
    user: config.dbUser,
    password: config.dbPass,
    ssl: {
        rejectUnauthorized: false,
    }
})

export function query(text, params) {

    //exposing the pool.query method so we can use it elsewhere
    return pool.query(text, params)
    //returns a promise unless we are using a callback (we are not)
}