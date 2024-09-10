const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// MySQL 데이터베이스 연결
const db = mysql.createConnection({
    host: 'localhost', // 데이터베이스 호스트
    user: 'root', // MySQL 사용자 이름
    password: '1234', // MySQL 사용자 비밀번호
    database: 'firstdabase' // 연결할 데이터베이스 이름
});

// 연결 확인
db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to database.');
});

app.listen(3000, function() {
    console.log('listening on 3000');
});

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/write.html', function(req, res) {
    res.sendFile(path.join(__dirname, 'write.html'));
});

app.get('/post/:id', function(req, res) {
    res.sendFile(path.join(__dirname, 'post.html'));
});

// 게시글 추가
app.post('/addPost', function(req, res) {
    const newPost = {
        title: req.body.title,
        author: req.body.author,
        content: req.body.content,
        date: new Date()
    };

    // 게시글을 데이터베이스에 추가
    db.query('INSERT INTO posts SET ?', newPost, (error, results) => {
        if (error) {
            return res.status(500).json({ success: false, error });
        }
        res.json({ success: true, id: results.insertId });
    });
});

    // 게시글 조회
    app.get('/posts', function(req, res) {
        db.query('SELECT * FROM posts', (error, results) => {
            if (error) {
                return res.status(500).json({ success: false, error });
            }
            res.json(results);
        });
    });

    // 게시글 삭제 (ID 기준)
    app.delete('/posts/:id', function(req, res) {
        const postId = parseInt(req.params.id);

    // ID가 유효한지 확인
    if (isNaN(postId)) {
        return res.status(400).json({ success: false, message: '유효하지 않은 ID입니다.' });
    }

    // 게시글을 데이터베이스에서 삭제
    db.query('DELETE FROM posts WHERE id = ?', [postId], (error, results) => {
        if (error) {
            console.error('Delete error:', error); // 오류 출력
            return res.status(500).json({ success: false, error });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ success: false, message: '게시글을 찾을 수 없습니다.' });
        }
        res.json({ success: true });
    });
});

// 게시글 수정 (ID 기준)
app.put('/posts/:id', function(req, res) {
    const postId = parseInt(req.params.id);
    const updatedPost = {
        title: req.body.title,
        author: req.body.author,
        content: req.body.content,
        date: new Date()
    };

    // ID가 유효한지 확인
    if (isNaN(postId)) {
        return res.status(400).json({ success: false, message: '유효하지 않은 ID입니다.' });
    }

    // 게시글을 데이터베이스에서 수정
    db.query('UPDATE posts SET ? WHERE id = ?', [updatedPost, postId], (error, results) => {
        if (error) {
            console.error('Update error:', error); // 오류 출력
            return res.status(500).json({ success: false, error });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ success: false, message: '게시글을 찾을 수 없습니다.' });
        }
        res.json({ success: true });
    });
});