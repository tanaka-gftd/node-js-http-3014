'use strict';
const http = require('http');

//fsモジュール...ファイルの読み書きすをるためのモジュール
const fs = require('fs');

const server = http
  .createServer((req, res) => {
    const now = new Date();
    console.info(`[${now}] Requested by ${req.socket.remoteAddress}`);
    
    //webページを表示するので、Content-Type に text/htmlを設定
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8'
    });

    switch (req.method) {
      case 'GET':

        //createReadStream...ファイルの読み込み用ストリーム生成
        /* ここではレスポンス時に表示されるHTMLファイルを読み込んでいる */
        const rs = fs.createReadStream('./form.html');

        //pipe関数...読み込み用ストリームと書き込み用ストリームを繋げる。pipe関数使用時はend関数が不要
        /* ここでは、ファイルから読み込んだもの(変数rs)をレスポンス(変数res)へと繋げている*/
        rs.pipe(res);
        break;

      case 'POST':

        //POSTされてきたデータを格納する変数
        let rawData = '';

        req
          .on('data', chunk => { 
            rawData += chunk;   //（POSTされてきたデータはURLエンコードされている）
          })
          .on('end', () => {

            //decodeURIComponent(JavaScriptの関数)...URLエンコードされた値を元のものに直す（デコード）
            const decoded = decodeURIComponent(rawData);

            //ログとして出力
            console.info(`[${now}] 投稿: ${decoded}`);

            //最終的に画面に表示されるHTML
            res.write(`
              <!DOCTYPE html>
              <html lang="ja">
                  <body>
                      <h1>${decoded}が投稿されました</h1>
                  </body>
              </html>
            `)
            //POST時はpipe関数を使用しないので、res.end()が必要になる
            res.end();
          });
        break;
        
      default:
        break;
    } 
    //res.end();  //pipe関数を使用した場合は、end関数が不要になるので、この行では削除
  })
  .on('error', e => {
    console.error(`[${new Date()}] Server Error`, e);
  })
  .on('clientError', e => {
    console.error(`[${new Date()}] Client Error`, e);
  });
const port = 8000;
server.listen(port, () => {
  console.info(`[${new Date()}] Listening on ${port}`);
});
