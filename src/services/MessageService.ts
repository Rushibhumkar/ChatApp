import SQLite from 'react-native-sqlite-storage';
import {MsgDataType} from '../utils/typescriptInterfaces';

SQLite.enablePromise(true);

let db: SQLite.SQLiteDatabase;

export const initDB = async () => {
  try {
    db = await SQLite.openDatabase({name: 'chat.db', location: 'default'});

    await db.executeSql(`
      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        msgId TEXT UNIQUE,
        chatId TEXT,
        senderId TEXT,
        receiverId TEXT,
        text TEXT,
        attachments TEXT,
        timestamp INTEGER,
        isSynced INTEGER,
        isDeleted INTEGER DEFAULT 0
      );
    `);
    console.log('✅ SQLite DB initialized');
  } catch (error) {
    console.error('❌ Failed to initialize DB:', error);
  }
};

export const insertMessage = async (msg: MsgDataType) => {
  if (!db) return;

  try {
    await db.executeSql(
      `
      INSERT OR REPLACE INTO messages 
      (msgId, chatId, senderId, receiverId, text, attachments, timestamp, isSynced, isDeleted)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
      `,
      [
        msg._id,
        msg.receiver || msg.receiverId || '',
        msg.sender || msg.senderId || '',
        msg.receiver || msg.receiverId || '',
        msg.text || '',
        JSON.stringify(msg.attachments || []),
        new Date(msg.createdAt || msg.timestamp || Date.now()).getTime(),
        msg.isSynced ? 1 : 0,
        msg.isDeleted ? 1 : 0,
      ],
    );
  } catch (error) {
    console.error('❌ Error inserting message:', error);
  }
};

export const getMessagesByChatId = async (
  chatId: string,
): Promise<MsgDataType[]> => {
  if (!db) return [];

  try {
    const [results] = await db.executeSql(
      `
      SELECT * FROM messages 
      WHERE chatId = ? AND isDeleted = 0 
      ORDER BY timestamp DESC 
      LIMIT 50;
      `,
      [chatId],
    );

    const rows = [];
    for (let i = 0; i < results.rows.length; i++) {
      const row = results.rows.item(i);
      rows.push({
        _id: row.msgId,
        sender: row.senderId,
        receiver: row.receiverId,
        text: row.text,
        attachments: JSON.parse(row.attachments || '[]'),
        createdAt: row.timestamp,
      });
    }
    return rows;
  } catch (error) {
    console.error('❌ Error fetching messages:', error);
    return [];
  }
};

export const deleteMessagesByIds = async (msgIds: string[]) => {
  if (!db || msgIds.length === 0) return;

  try {
    const placeholders = msgIds.map(() => '?').join(',');
    await db.executeSql(
      `UPDATE messages SET isDeleted = 1 WHERE msgId IN (${placeholders});`,
      msgIds,
    );
  } catch (error) {
    console.error('❌ Error deleting messages:', error);
  }
};

export const clearAllMessages = async () => {
  if (!db) return;
  try {
    await db.executeSql('DELETE FROM messages;');
  } catch (error) {
    console.error('❌ Error clearing messages:', error);
  }
};
