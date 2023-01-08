const sqlite = require('sqlite-async');

class Database {
	constructor(db_file) {
		this.db_file = db_file;
		this.db = undefined;
	}
	
	async connect() {
		this.db = await sqlite.open(this.db_file);
	}

	async migrate() {
		return this.db.exec(`

			CREATE TABLE IF NOT EXISTS users (
				id         INTEGER      NOT NULL PRIMARY KEY AUTOINCREMENT,
				username   VARCHAR(255) NOT NULL UNIQUE,
				password   VARCHAR(255) NOT NULL,
				is_admin   INTEGER      NOT NULL
			);

			INSERT OR IGNORE INTO users (username, password, is_admin) VALUES ('admin', 'changeme101', 1);

			DROP TABLE posts;
			CREATE TABLE posts (
				id            INTEGER      NOT NULL PRIMARY KEY AUTOINCREMENT,
				title         VARCHAR(255) NOT NULL,
				description   TEXT         NOT NULL,
				author        VARCHAR(255) NOT NULL,
				created       VARCHAR(255) DEFAULT CURRENT_TIMESTAMP
			);

			INSERT INTO posts (id, title, description, author) VALUES
			    (1, 'Biff Tannen as the new community moderator', 'I am super delighted to takeover the role of community moderator of this forum!', 'Biff Tannen'),
			    (2, 'The hero of Hill Valley you probably never heard of', 'Buford Tannen, was regarded as a hero for catching the thieves who robbed the Pine City Stage back in 1885.', 'Biff Tannen'),
				(3, 'The McFly are chickens', 'They do not want to admit it but if you see them on the road, Scream "Chicken!"!!!', 'Biff Tannen');

				DROP TABLE comments;
			CREATE TABLE comments (
				id            INTEGER      NOT NULL PRIMARY KEY AUTOINCREMENT,
				post_id         INTEGER NOT NULL,
				comment   TEXT         NOT NULL,
				user        VARCHAR(255) NOT NULL,
				created       VARCHAR(255) DEFAULT CURRENT_TIMESTAMP
			);
			INSERT INTO comments (id, post_id, comment, user) VALUES
				(1, 1, 'Go Tannen!!!', 'Rafe Unger'),
				(2, 1, 'This is ridiculous! Nobody made you the moderator, you stole it!', 'Marty McFly'),
				(3, 1, 'Shut up, McFly', 'Biff Tannen'),
				(4, 2, 'Mad Respect for the man!', 'Leslie Spike'),
				(5, 2, 'We should make a memorial website for him!', 'Chester Whitey'),
				(6, 3, 'Delete this! I am reporting this post!', 'Marty McFly'),
				(7, 3, 'Go ahead, try! I am the forum moderator now!!!', 'Biff Tannen');
		`);
	}
	async listPosts() {
		return new Promise(async (resolve, reject) => {
			try {
				let stmt = await this.db.prepare('SELECT * FROM posts order by id desc');
				resolve(await stmt.all());
			} catch(e) {
				reject(e);
			}
		});
	}
	async getPost(id) {
		return new Promise(async (resolve, reject) => {
			try {
				let stmt = await this.db.prepare('SELECT * FROM posts WHERE id = ?');
				resolve(await stmt.get(id));
			} catch(e) {
				reject(e);
			}
		});
	}
	async getComments(id) {
		return new Promise(async (resolve, reject) => {
			try {
				let stmt = await this.db.prepare('SELECT * FROM comments WHERE post_id = ?');
				resolve(await stmt.all(id));
			} catch(e) {
				reject(e);
			}
		});
	}
}

module.exports = Database;