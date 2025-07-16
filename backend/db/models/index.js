'use strict';

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import process from 'process';
import Sequelize from 'sequelize';
import configFile from '../config/config.js'; // .json이 아니라 .js로 바꿈
import PostModel from './post.js';
import TagModel from './tag.js';
import MemoModel from './memo.js';
import ScheduleModel from './schedule.js';

// __dirname 대체
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 환경 설정
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'dev';
const config = configFile[env];

const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// models 폴더의 모든 .js 파일 import 후 등록
const files = fs.readdirSync(__dirname).filter(file => {
  return (
    file.indexOf('.') !== 0 &&
    file !== basename &&
    file.slice(-3) === '.js' &&
    !file.endsWith('.test.js')
  );
});

// 동적 import (ESM에선 require 대신 import)
for (const file of files) {
  const { default: modelDefiner } = await import(path.join(__dirname, file));
  const model = modelDefiner(sequelize, Sequelize.DataTypes);
  db[model.name] = model;
}

// 관계 설정
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});


// 다대 다 관계 표현
const Post = PostModel(sequelize, Sequelize.DataTypes);
const Tag = TagModel(sequelize, Sequelize.DataTypes);
const Memo = MemoModel(sequelize, Sequelize.DataTypes);
const Schedule = ScheduleModel(sequelize, Sequelize.DataTypes);

Post.belongsToMany(Tag, { through: 'post_tags', foreignKey: 'post_id', onDelete: 'CASCADE' });
Tag.belongsToMany(Post, { through: 'post_tags', foreignKey: 'tag_id', onDelete: 'CASCADE' });

Memo.belongsToMany(Tag, { through: 'memo_tags', foreignKey: 'memo_id', onDelete: 'CASCADE' });
Tag.belongsToMany(Memo, { through: 'memo_tags', foreignKey: 'tag_id', onDelete: 'CASCADE' });

Schedule.belongsToMany(Tag, { through: 'schedule_tags', foreignKey: 'schedule_id', onDelete: 'CASCADE' });
Tag.belongsToMany(Schedule, { through: 'schedule_tags', foreignKey: 'tag_id', onDelete: 'CASCADE' });

User.belongsToMany(User, {
  as: 'Followers',
  through: 'user_relations',
  foreignKey: 'following_id',
  otherKey: 'follower_id',
});
User.belongsToMany(User, {
  as: 'Followings',
  through: 'user_relations',
  foreignKey: 'follower_id',
  otherKey: 'following_id',
});

User.belongsToMany(Post, {
  through: 'post_likes',
  foreignKey: 'user_id',
  otherKey: 'post_id',
  as: 'LikedPosts',
});
Post.belongsToMany(User, {
  through: 'post_likes',
  foreignKey: 'post_id',
  otherKey: 'user_id',
  as: 'PostLikers',
});

User.belongsToMany(Comment, {
  through: 'comment_likes',
  foreignKey: 'user_id',
  otherKey: 'comment_id',
  as: 'LikedComments',
});
Comment.belongsToMany(User, {
  through: 'comment_likes',
  foreignKey: 'comment_id',
  otherKey: 'user_id',
  as: 'CommentLikers',
});

// 내보내기
export { sequelize };
export default { ...db, sequelize, Sequelize };
