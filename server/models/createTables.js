const { Pool } = require('pg')
const { psql } = require('../config/')

const handleError = (err) => new Error(err)

const pool = new Pool(psql)

//DOESN'T WORK. NEED TO MANUALLY CREATE Tables. You shouldn't be dropping tables SO YOU DON'T NEED THIS

pool.on('connect', () => {
  console.log('connected to the db')
})

/**
 * Create Image Table
 */
const createImageTable = async () => {
  const queryText = `CREATE TABLE IF NOT EXISTS
		images(
			image_id SERIAL PRIMARY KEY,
			user_id integer REFERENCES users (user_id) NOT NULL,
			key varchar(150) NOT NULL UNIQUE,
			extension varchar(50) NOT NULL,
      url varchar(200) NOT NULL,
      original_url varchar(200) NOT NULL,
			geo_json_feature JSON
		);`

  const res = await pool.query(queryText).catch(handleError)

  return res
}

/**
 * Create User Table
 */
const createUserTable = async () => {
  const queryText = `CREATE TABLE IF NOT EXISTS
		users(
			user_id SERIAL PRIMARY KEY,
      email VARCHAR(128) UNIQUE NOT NULL,
      username VARCHAR(128) UNIQUE NOT NULL,
			password VARCHAR(128) NOT NULL
		);`

  const res = await pool.query(queryText).catch(handleError)
  return res
}

const createExifTable = async () => {
  const queryText = `CREATE TABLE IF NOT EXISTS
		exifs(
			exif_id SERIAL PRIMARY KEY,
      key varchar(150) REFERENCES images (key) ON DELETE CASCADE NOT NULL UNIQUE ,
			exif JSON
		);`

  const res = await pool.query(queryText).catch(handleError)
  return res
}

/**
 * Create All Tables
 */
const createAllTables = async () => {
  const users = await createUserTable()
  let images

  if (!(users instanceof Error)) {
    images = await createImageTable()
  } else {
    console.error(users)
    throw users
  }

  if (images instanceof Error) {
    console.error(images)
    throw images
  } else {
    const exifs = await createExifTable()
    if (exifs instanceof Error) throw exifs
  }

  console.log('Database tables are ready.')
  pool.end()
}

createAllTables()
