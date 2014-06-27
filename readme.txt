PGMAutoSheet4design
------------------------------------------

介绍

1.可拓展成跨平台的自动构建/编辑/追踪项目进度的app
2.编辑、设计、制作可以随时任意更新自己的进度
3.整合整个制作流程的各个步骤，方便多方交流


使用技术

1.nodejs 负责文件，字符处理，http 服务，模拟登陆获取cms 数据
2.nodejs-webkit 封装成app //http://www.baidufe.com/item/1fd388d6246c29c1368c.html
3.html js css 负责GUI，构建友好界面
4.Enigma Virtual Box 把项目封装成单一文件，方便传播



历史 History
2014.05.27
1.增加说明文档
2.修复使用ip 的bug

2014.05.26
1.增加“标配”，“活动” 等分类
2.增加自定义文章
3.修改“修改超链接“功能

2014.05.19
1.文件路由 app.exe 目录下
2.区分app 内部和外部资源//http://cnodejs.org/topic/5333dc3fd9b2aea031000a38
3.简单 GUI
4.局域网任意访问
5.使用Enigma Virtual Box 把项目封装成单一文件//https://github.com/rogerwang/node-webkit/wiki/How-to-package-and-distribute-your-apps
6.增加系统托盘（tray）//http://www.xuanhun521.com/Blog/2014/4/21/node-webkit%E6%95%99%E7%A8%8B9native-api-%E4%B9%8Btray%E6%89%98%E7%9B%98
7.点击文章直接跳转cms 文章页
8.模拟登录获取数据//http://www.poised-flw.com/node.js/2013/06/15/first-touch-nodejs-and-written-an-small-application/
10.增加部分说明文字
11.可以和其他服务器并存
//11.素材检查
//12.hfs 功能
//13.外加链接（newstand 图）

2014.05.17
开始，编写功能
1.在线下载cms 数据，初始化/刷新汇总表。（刷新后被删除的文章的数据和标题数据会丢失）
2.在线任意修改期刊标题，设计师，设计稿，素材，制作人，备注，logo。
3.自动计算进度
//4.文件路由
//5.静态脚本的绝对路径
//6.nodejs-webkit 封装GUI

2014.05.16
1.有个想法，如果有个软件可以自动根据cms 自动生成目录，并可以自动更新，那么设计就可以减少新建/修改html 的时间，
制作也可以更及时看到最新的设计稿和素材地址。编辑可以直接在上面写意见。
2.（如果有hfs 功能，那么界面可以更加自定义。）
3.经过分析，使用nodejs-webkit 的方法实现根据cms 数据自动初始化，允许任何人二次编辑，自动计算当前进度和估计整体情况的综合webapp。


安装参考：http://www.baidufe.com/item/1fd388d6246c29c1368c.html
