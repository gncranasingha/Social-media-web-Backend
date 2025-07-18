const database = require('../config/db')


class User {
  static async create({ username, email, password, profile_picture = null }) {
    const [result] = await database.execute(
      'INSERT INTO users (username, email, password, profile_picture) VALUES (?, ?, ?, ?)',
      [username, email, password, profile_picture]
    );
    return result.insertId;
  }

  static async findByEmail(email) {
    const [rows] = await database.execute('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await database.execute(
      'SELECT id, username, email, profile_picture FROM users WHERE id = ?', 
      [id]
    );
    return rows[0];
  }
}

module.exports = User;