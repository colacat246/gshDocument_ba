const express = require('express');
const config = require('config');
const fs = require('fs');
const path = require('path');
const cp = require('child_process');
const encoding = require('encoding');

const app = express();
const articlePath = config.get('articlePath');
const port = config.get('port');

app.use('/', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // 允许跨域的前端地址
  res.header('Access-Control-Allow-Headers', '*'); // 允许前端发送的请求头
  res.header('Access-Control-Expose-Headers', '*'); // 可以被前端获取的头信息
  next();
});

app.use(express.static('public/dist'));
// 获取文章列表
app.get('/api/articlelist', (req, res) => {
  const data = [];
  if (!fs.existsSync(articlePath)) {
    res.send(data);
    return;
  }
  fs.readdir(articlePath, (err, files) => {
    if (!files) {
      res.send(data);
      return;
    }
    files
      .filter((i) => i !== 'flushArticles.js')
      .forEach((i) => {
        const curPath = path.resolve(articlePath, i, 'article');
        // 判断路径是否存在
        if (!fs.existsSync(curPath)) {
          return;
        }
        const files = fs.readdirSync(curPath);
        // 判断文件是否存在
        if (!files || !/\.html$/.test(files[0])) {
          return;
        }
        data.push({ id: i, title: files[0].split('.')[0] });
      });
    res.send(data);
  });
});
// 获取文章html文件
app.get('/api/articleSrc/:id', (req, res) => {
  const id = req.params.id;
  const path = `${articlePath}/${id}/article`;
  if (!fs.existsSync(path)) {
    console.log('toggle');
    res.status(404).send('no resources');
    return;
  }
  fs.readdir(path, (err, files) => {
    const file = files.find((i) => /\.pdf/.test(i));
    if (!file) {
      res.status(404).send('no resources');
      return;
    }
    res.sendFile(`${path}/${file}`);
  });
});
// 获取源代码
app.get('/api/sourcecodeSrc/:id', (req, res) => {
  const id = req.params.id;
  const curPath = path.resolve(articlePath, id, 'sourceCode');
  const data = [];
  // 判断是否存在sourceCode文件夹
  if (!curPath) {
    res.send(data);
    return;
  }
  fs.readdir(curPath, (err, files) => {
    // 判断是否存在文件
    if (!files) {
      res.send(data);
      return;
    }
    files.forEach((i) => {
      const code = fs.readFileSync(`${articlePath}/${id}/sourceCode/${i}`);
      data.push({
        id: i.split('__')[0],
        title: i.split('__')[1],
        content: encoding.convert(code, 'utf-8', 'gb2312').toString(),
      });
    });
    res.send(data);
  });
});

// 下载文章
app.get('/api/downloadArticle/:id', (req, res) => {
  const id = req.params.id;
  const filePath = `${articlePath}/${id}/article`;
  if (!fs.existsSync(filePath)) {
    res.status(404).send('no resources');
    return;
  }
  fs.readdir(filePath, (err, files) => {
    const file = files.find((i) => /\.pdf/.test(i));
    if (!file) {
      res.status(404).send('no resources');
      return;
    }
    res.sendFile(path.resolve(filePath, file));
  });
});

app.listen(port, () => {
  console.log(`started on port ${port}`);
});

// TODO 服务器挂了发送邮件
