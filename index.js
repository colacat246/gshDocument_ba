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

app.get('/api/articlelist', (req, res) => {
  const data = [];
  fs.readdir(articlePath, (err, files) => {
    files.forEach((i) => {
      const files = fs.readdirSync(`${articlePath}/${i}/article`);
      data.push({ id: i, title: files[0].split('.')[0] });
    });
    res.send(data);
  });
});

app.get('/api/articleSrc/:id/:areaWidth', (req, res) => {
  const id = req.params.id;
  const width = req.params.areaWidth;
  fs.readdir(`${articlePath}/${id}/article`, (err, files) => {
    cp.exec(
      `docker run --rm -v \`pwd\`:/pdf bwits/pdf2htmlex pdf2htmlEX --dest-dir ./output --fit-width ${
        width - 20
      } ${articlePath}/${id}/article/${files[0]}`,
      (err, stdout, stderr) => {
        res.sendFile(
          `${__dirname}/output/${files[0].replace('.pdf', '.html')}`
        );
      }
    );
  });
});

app.get('/api/sourcecodeSrc/:id', (req, res) => {
  const id = req.params.id;
  fs.readdir(`${articlePath}/${id}/sourceCode`, (err, files) => {
    const data = [];
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

app.get('/api/downloadArticle/:id', (req, res) => {
  const id = req.params.id;
  const filePath = `${articlePath}/${id}/article`;
  fs.readdir(filePath, (err, files) => {
    res.sendFile(path.resolve(filePath, files[0]));
  });

});

app.listen(port, () => {
  console.log(`started on port ${port}`);
});
