import * as SQLite from 'expo-sqlite';

interface Password {
  id: number;
  name: string;
  username: string;
  password: string;
  email: string;
  note: string;
  createdAt: string;
}

class DatabaseService {
  private db: SQLite.SQLiteDatabase | null = null;
  private dbInitPromise: Promise<void>;

  constructor() {
    // 使用异步方式初始化数据库
    this.dbInitPromise = this.initialize();
  }

  private async initialize() {
    try {
      // 使用异步方法打开数据库
      this.db = await SQLite.openDatabaseAsync('myapp.db');
      await this.initDatabase();
    } catch (error) {
      console.error('数据库初始化失败:', error);
    }
  }

  private async initDatabase() {
    if (!this.db) return;
    
    try {
      // 使用 execAsync 方法直接执行 SQL 语句
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS passwords (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          username TEXT NOT NULL,
          password TEXT NOT NULL,
          email TEXT,
          note TEXT,
          createdAt TEXT NOT NULL
        );
      `);
    } catch (error) {
      console.error('数据库表创建失败:', error);
    }
  }

  // 确保数据库初始化完成的辅助方法
  private async ensureDb() {
    await this.dbInitPromise;
    if (!this.db) {
      throw new Error('数据库未初始化');
    }
    return this.db;
  }

  async addPassword(password: Omit<Password, 'id' | 'createdAt'>): Promise<number> {
    const db = await this.ensureDb();
    const createdAt = new Date().toISOString();

    try {
      const result = await db.runAsync(
        `INSERT INTO passwords (name, username, password, email, note, createdAt) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [password.name, password.username, password.password, password.email || '', password.note || '', createdAt]
      );
      return result.lastInsertRowId;
    } catch (error) {
      console.error('添加密码失败:', error);
      throw error;
    }
  }

  async getAllPasswords(): Promise<Password[]> {
    const db = await this.ensureDb();
    
    try {
      return await db.getAllAsync<Password>(
        'SELECT * FROM passwords ORDER BY createdAt ASC'
      );
    } catch (error) {
      console.error('获取密码列表失败:', error);
      throw error;
    }
  }

  async searchPasswords(query: string): Promise<Password[]> {
    const db = await this.ensureDb();
    
    try {
      return await db.getAllAsync<Password>(
        'SELECT * FROM passwords WHERE name LIKE ? ORDER BY createdAt ASC',
        [`%${query}%`]
      );
    } catch (error) {
      console.error('搜索密码失败:', error);
      throw error;
    }
  }

  async deletePassword(id: number): Promise<void> {
    const db = await this.ensureDb();
    
    try {
      await db.runAsync(
        'DELETE FROM passwords WHERE id = ?',
        [id]
      );
    } catch (error) {
      console.error('删除密码失败:', error);
      throw error;
    }
  }

  async updatePassword(id: number, password: Omit<Password, 'id' | 'createdAt'>): Promise<void> {
    const db = await this.ensureDb();
    
    try {
      await db.runAsync(
        `UPDATE passwords 
         SET name = ?, username = ?, password = ?, email = ?, note = ?
         WHERE id = ?`,
        [password.name, password.username, password.password, password.email || '', password.note || '', id]
      );
    } catch (error) {
      console.error('更新密码失败:', error);
      throw error;
    }
  }
}

// 导出单例实例
export const databaseService = new DatabaseService();
export type { Password }; 