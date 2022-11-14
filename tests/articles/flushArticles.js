// 用于更新pdf对应的html文件，拷贝指文章存放目录使用
const cp = require('child_process');
const path = require('path');
const fs = require('fs');

function warn(info) {
  console.log(`\x1B[31m${info}\x1B[0m`);
}

const curDir = path.dirname(__filename);
const files = fs
  .readdirSync(curDir)
  .filter((i) => i !== path.basename(__filename));

let processNum = 0;

for (const i of files) {
  const articlePath = path.resolve(curDir, i, 'article');
  if (!fs.existsSync(articlePath)) {
    warn(`there is no content in ID ${i}`);
    continue;
  }
  const articleFiles = fs.readdirSync(articlePath);
  if (articleFiles.length === 0) {
    warn(`there is no content in ID ${i}`);
    continue;
  }
  const articleName = path.basename(articleFiles[0]).split('.')[0];
  if (articleFiles.includes(`${articleName}.html`)) {
    continue;
  }
  let child;
  child = cp.exec(
    `cd ${articlePath} && docker run --rm -v $(pwd):/pdf bwits/pdf2htmlex pdf2htmlEX --fit-width 1200 ${articleName}.pdf`,
    (err, stdout, stderr) => {
      if (err) {
        console.log(err);
        return;
      }
      child.emit('done', articleName);
    }
  );
  processNum++;
  // child.on('exit', (code, sig) => { //子进程退出时的退出码和导致退出的信号，若无信号，则sig = null
  child.on('done', (name) => {
    console.log(`${name} converted`);
    processNum--;
    if (processNum === 0) {
      console.log('\x1B[32mAll conversion finished\x1B[0m');
    }
  });
}

if (processNum === 0) {
  warn('no files to be converted');
}
