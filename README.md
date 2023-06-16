# pressureAway

### (一) API 

#### API 撰寫

> 需要更改 3 個檔案:
>  * ./pressureAway/controller/controller.js
>  * ./pressureAway/model/firebase_modules.js
>  * ./pressureAway/routes/index.js

#### API 測試

>  #### GET 全部資料
>
> 平台使用的網址是透過 ngrok 轉成可外網連接的型態，如果不用平台，單純用 postman 的話可以用以下方法測試:
>  * clone 後進入 pressureAway 資料夾
>  * 打開終端機輸入:  `cd pressureAway`
>  * 終端機輸入:  `npm start`
>
>    出現下列文字代表成功執行
>    
>          > pressureaway@0.0.0 start
>          > node ./bin/www
>  * 打開瀏覽器或 postman 輸入網址 http://localhost:3000/getAllData (postman 方法選 POST)
>  * 得到 JSON 型態的資料


>  #### SET 員工 sched
>
> 測試方法同上:
>  * 打開 postman 輸入網址 http://localhost:3000/setPersonalTask
>  * Body 要填入 3 項
>    * date (要更改的日期): "yyyy/mm/dd"
>    * name (要更改的員工姓名): ""
>    * dataToChange (要更改的每日任務): [{},{}]
>    
>      ex:
>     
>          {
>            "date": "2023/06/01",
>            "name": "Alex",
>            "dataToChange": [{"complete": false,"compress_rate": 0.2,"name": "work1-1"},{"complete": false,"compress_rate": 0.9,"name": "work2-1"},{"complete": true,"compress_rate": 1,"name": "work3"},{"complete": true,"compress_rate": 1,"name": "work4-1"},{"complete": true,"compress_rate": 1.2,"name": "work5"}]
>          }
>  * 檢查資料庫資料是否已經被更改

