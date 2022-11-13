const encoding = require('encoding');
const fs = require('fs');


const file = fs.readFileSync('./tests/articles/6/sourceCode/1__GSH计算技术手册1_main.c');

const res = encoding.convert(file, 'utf-8', 'gb2312');

console.log(res.toString());
