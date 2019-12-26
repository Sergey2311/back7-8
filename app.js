const express = require('express');
const cors = require('cors');

const errorNotFound = {error:'id.not_found'} 
let nextId = 1
const posts = [
    {
        id: nextId++,
        type: 'regular',
        value: 'First post',
        likes: 3,
    },
    {
        id: nextId++,
        type: 'regular',
        value: 'Second post',
        likes: 0,
    },
];

const app = express();
app.use(express.json());
app.use(cors());

app.get('/posts', (req, res) => res.send(posts));


app.post('/posts', (req, res) => {
    const body = req.body;
    if (body.id === 0) {
        posts.push({
            id: nextId++,
            type: body.type,
            value: body.value,
            likes: 0,
        });
        res.send(posts);
         return;
    }

    const index = posts.findIndex(o => o.id === body.id)
    if (index === -1) {
        res.status(404).send(errorNotFound);
        return;
    }
    posts[index].value = body.value;
    res.send(posts);
});



app.delete('/posts/:id', (req, res) => {
    const id = Number(req.params['id']);
    const index = posts.findIndex(o => o.id === id);

    if (index === -1) {
        res.status(404).send(errorNotFound);
        return
    }
    const removed = posts.splice(index, 1);
    res.send(removed);
});

app.post('/posts/:id/likes', (req, res) => {
    const id = Number(req.params['id']);
    const index = posts.findIndex(o => o.id === id)
 
    if (index === -1) {
        res.status(404).send(errorNotFound);
        return
    };
    
    posts[index].likes++;
    res.send(posts);
});

app.delete('/posts/:id/dislikes', (req, res) => {
    const id = Number(req.params['id']);
    const index = posts.findIndex(o => o.id === id)

    if (index === -1) {
        res.status(404).send(errorNotFound);
        return
    };

    posts[index].likes--;
    res.send(posts);
});


const port = 9999;
app.listen(process.env.PORT || `${port}`);