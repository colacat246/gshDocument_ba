// 演示pdf2htmlEX的用法
const cp = require('child_process');
cp.exec(
  'docker run --rm -v `pwd`:/pdf bwits/pdf2htmlex pdf2htmlEX GSH_test.pdf',
  (err, stdout, stderr) => {
    console.log(err);
    console.log(stdout);
  }
);
