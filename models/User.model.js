const database = require('../configs/db.config');

class User {
  static async create({ username, email, password, profile_picture = null }) {
    try {
      const [result] = await database.execute(
        'INSERT INTO users (username, email, password, profile_picture) VALUES (?, ?, ?, ?)',
        [username, email, password, profile_picture]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  static async findByEmail(email) {
    try {
      const [rows] = await database.execute('SELECT * FROM users WHERE email = ?', [email]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      const [rows] = await database.execute(
        'SELECT id, username, email, profile_picture FROM users WHERE id = ?', 
        [id]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

static async update(id, { username, email, profile_picture }) {
  
  const updates = [];
  const params = [];
  
  if (username !== undefined) {
    updates.push('username = ?');
    params.push(username);
  }
  
  if (email !== undefined) {
    updates.push('email = ?');
    params.push(email);
  }
  
  if (profile_picture !== undefined) {
    updates.push('profile_picture = ?');
    params.push(profile_picture);
  }
  
  if (updates.length === 0) {
    return; 
  }
  
  const query = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;
  params.push(id);
  
  await database.execute(query, params);
}

}

module.exports = User;