const database = require('../config/db');

class Post {
  static async create({ user_id, content, image_url = null }) {
    const [result] = await database.execute(
      'INSERT INTO posts (user_id, content, image_url) VALUES (?, ?, ?)',
      [user_id, content, image_url]
    );
    return result.insertId;
  }

  static async findByUserId(user_id) {
    const [rows] = await database.execute(
      'SELECT p.*, u.username, u.profile_picture FROM posts p JOIN users u ON p.user_id = u.id WHERE p.user_id = ? ORDER BY p.created_at DESC',
      [user_id]
    );
    return rows;
  }

  static async findById(post_id) {
    const [rows] = await database.execute(
      'SELECT p.*, u.username, u.profile_picture FROM posts p JOIN users u ON p.user_id = u.id WHERE p.id = ?',
      [post_id]
    );
    return rows[0];
  }

  static async delete(post_id, user_id) {
    await database.execute(
      'DELETE FROM posts WHERE id = ? AND user_id = ?',
      [post_id, user_id]
    );
  }

  static async update(post_id, { content, image_url }) {
  await database.execute(
    'UPDATE posts SET content = ?, image_url = ? WHERE id = ?',
    [content, image_url, post_id]
  );
}
}

module.exports = Post;