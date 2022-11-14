# README

## 文件管理方法

1. 在`~/publishedArticles`目录下中，以数字作为每个主题内容的ID，建立对应的文件夹
1. 以ID为文件名的每个主题的文件夹中，设置`article`和`sourceCode`两个子文件夹
   * `article`文件夹中放置pdf文件，文件名即会成为网页列表中的文件名
   * `sourceCode`文件夹中放置源代码资源，命名方式为`[ID]__[文件名].[后缀名]`，例如`1__demoCode.c`，可放置多个，ID请勿重复
1. 完成后执行命令`flush_articles`即可更新内容，会在各主题的`article`目录中生成对应的html文件，用于网页展示

放入文章并执行`flush_articles`之后的文件夹结构示例：

```
publishedArticles/
├── 1
│   ├── article
│   │   ├── cad_notes.html
│   │   └── cad_notes.pdf
│   └── sourceCode
│       ├── 1__code1-1.c
│       └── 2__code1-2.c
└── 2
    ├── article
    │   ├── git_notes.html
    │   └── git_notes.pdf
    └── sourceCode
        ├── 2__code2-1.c
        └── 2__code2-2.c
```

注意：

1. 若没有源代码，则可以不建立`sourceCode`文件夹，或保留一个空的`sourceCode`文件夹

1. 未执行`flush_articles`脚本之前，不会在前端网页中显示文章

1. `publishedArticles`下有一个`flushArticles.js`文件，用于执行上述`flush_articles`脚本，保留即可

1. 若要更新某篇文章内容，将对应主题ID下`article`文件夹中的`文件名.html`和`文件名.pdf`全部删除后，上传新的pdf文件，并执行`flush_articles`脚本即可
