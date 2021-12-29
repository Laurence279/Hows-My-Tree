import pg from "pg";
import * as config from "../config.js"
const pool = new pg.Pool({
    port: config.dbPort,
    host: config.databaseHost,
    database: config.databaseName,
    user: config.username,
    password: config.password
})

export function query(text, params) {
    //exposing the pool.query method so we can use it elsewhere
    return pool.query(text, params)
    //returns a promise unless we are using a callback (we are not)
}