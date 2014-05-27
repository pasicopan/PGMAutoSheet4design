var http = require('http'),
    url = require('url'),
    path = require('path'),
    cheerio = require('./cheerio/index.js'),
    os = require('os'),
    fs = require('fs');

// The URL has moved <a href="http://192.168.11.20:8888/admin/login.do">here</a>

// var jsonUrl = "http://127.0.0.1:8080/_data.json";
var g_localIP = getLocalIP();// 本机IP
var packageDir = process.cwd();//app 运行的虚拟路径
var appDir = path.dirname(process.execPath);// exe 所在目录
var fileName = packageDir + "\\" + "_index.html";//模板路径
function _fDecodeURIComponent(a_string){
    console.log("_fDecodeURIComponent function,a_string is:",a_string)
    try{
        return decodeURIComponent(a_string);
    }catch(e){
        console.log("_decodeURIComponent error,ignore.");
        return "";
    }
}
// 获取相对于exe 文件的相对路径。
function getFilePath() {
    return appDir + _fDecodeURIComponent(urlpathname);
}
// 构建cms 文章页网址
function getArticleLink(a_id) {
    return g_IP + "/content.do?issueId=" + g_issueID + "&articleId=" + a_id;
}

// 保存服务的函数
var saveFunction = {
    "editLink": editLink,
    "editText": editText,
    "getAppFile": getAppFile,
    "refresh": refresh
};
console.log("g_localIP is:" + g_localIP);
console.log("process.cwd() is:" + process.cwd());
console.log("process.execPath is:" + process.execPath);
console.log("path.dirname(process.execPath) is:" + path.dirname(process.execPath));

// 打开exe 后马上创建http服务
http.createServer(function(req, res) {
    // 解释 路径
    try{
        urlpathname = url.parse(req.url).pathname;
        var pathname = appDir + "\\" + _fDecodeURIComponent(urlpathname);
        var urlArgJSON = url.parse(req.url, true).query;
    }catch(e){
        console.log("url.parse error,ignore");
        return;
    }
    console.log('pathname is:' + pathname);
    console.log('urlpathname is:' + urlpathname);
    console.log('urlArgJSON is:' , urlArgJSON);
    console.log('urlArgJSON.func is:' + urlArgJSON.func);
    // console.log('urlArgJSON.func is:' + urlArgJSON.index);
    var resultText = "";

    // 区分文件服务和其他功能的服务
    if (urlArgJSON.func) {
        console.log('urlArgJSON.index is:' + urlArgJSON.index+" &_fDecodeURIComponent(urlArgJSON.str) is:"+_fDecodeURIComponent(urlArgJSON.str));
        saveFunction[urlArgJSON.func](urlArgJSON.index, _fDecodeURIComponent(urlArgJSON.str), function(a_data, a_tpye) {
            resultText = a_data;
            _writeHead(a_data, a_tpye);
        });
    } else {

        // console.log('url.parse(req.url) is:'+url.parse(req.url));
        if (path.extname(pathname) == '') {
            pathname += '/';
        }
        if (pathname.charAt(pathname.length - 1) == '/') {
            pathname += 'index.html';
        }
        if (!pathname.indexOf("/favicon.ico")) {
            return;
        };
        _writeHead(pathname, 1);
    }

    // 编写http 协议头
    function _writeHead(pathname, a_isFileName) {
        var _extname = path.extname(pathname)
        if (a_isFileName) {
            switch (_extname) {
                case '.html':
                    res.writeHead(200, {
                        'Content-Type': 'text/html'
                    });
                    break;
                case '.js':
                    res.writeHead(200, {
                        'Content-Type': 'text/javascript'
                    });
                    break;
                case '.css':
                    res.writeHead(200, {
                        'Content-Type': 'text/css'
                    });
                    break;
                case '.gif':
                    res.writeHead(200, {
                        'Content-Type': 'image/gif'
                    });
                    break;
                case '.jpg':
                    res.writeHead(200, {
                        'Content-Type': 'image/jpeg'
                    });
                    break;
                case '.png':
                    res.writeHead(200, {
                        'Content-Type': 'image/png'
                    });
                    break;
                default:
                    res.writeHead(200, {
                        'Content-Type': 'application/octet-stream'
                    });
            }
            fs.exists(pathname, function(exists) {
                if (exists) {
                    fs.readFile(pathname, function(err, data) {
                        res.end(data);
                    });
                } else {
                    res.writeHead(404, {
                        'Content-Type': 'text/html'
                    });
                    res.end('<h1>404 Not Found</h1>');
                }
            });
        } else {
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });
            res.end(resultText);
        }

    }


}).listen(g_port, g_localIP);

// 获取本地ip 地址
function getLocalIP() {
    var _ip = "";
    var ifaces = os.networkInterfaces();
    for (var dev in ifaces) {
        var alias = 0;
        ifaces[dev].forEach(function(details) {
            if (details.family == 'IPv4') {
                console.log(dev + (alias ? ':' + alias : ''), details.address);
                if (details.address.match("192")) {
                    console.log("details.address is:"+details.address);
                    _ip = details.address;
                }
                ++alias;
            }
        });
    }
    $ip4test.html(_ip);
    return _ip;
}

// 更新列表后，重新记录上一次的数据
function resetData(a_dataJson, a_callback) {
    fs.readFile(getFilePath(), "utf8", function(err, data) {
        if (err) {
            console.error(err);
        } else {
            console.log('replace cmsdata');
            try{

                console.log('a_dataJson.cmsdata is:' , a_dataJson.cmsdata);
            }catch(e){
                console.log("a_dataJson is:",a_dataJson);
                console.log("error is:",e.message);
                return;
            }
            var $ = cheerio.load(data);
            // console.log("$('#'+a_dataJson.cmsdata[i].id).siblings is:",$('#'+a_dataJson.cmsdata[i].id).siblings('.designer').html());
            for (var i = a_dataJson.cmsdata.length - 1; i >= 0; i--) {
                var _$e = $('#' + a_dataJson.cmsdata[i].id);
                _$e.addClass("edited");
                _$e.siblings('.designer').find('input').attr('value', a_dataJson.cmsdata[i].textArr[0])
                if ("" != a_dataJson.cmsdata[i].textArr[1])
                    _$e.siblings('.preview').find('a').attr('href', _fDecodeURIComponent(a_dataJson.cmsdata[i].textArr[1]))
                if ("" != a_dataJson.cmsdata[i].textArr[1])
                    _$e.siblings('.material').find('a').attr('href', _fDecodeURIComponent(a_dataJson.cmsdata[i].textArr[2]))
                _$e.siblings('.engineer').find('input').attr('value', a_dataJson.cmsdata[i].textArr[3])
                _$e.siblings('.remark').find('input').attr('value', a_dataJson.cmsdata[i].textArr[4]);
            };
            $cmstbody = $("#cmstbody");
            if(0==$(".customTR").length){
                $cmstbody.append(createCustomHTMLString(a_dataJson.customdata) );
            }else{
                console.log('a_dataJson.customdata is:' + a_dataJson.customdata);
                for (var i = a_dataJson.customdata.length - 1; i >= 0; i--) {
                    var _$e = $('#' + a_dataJson.customdata[i].id);
                    _$e.addClass("edited");
                    _$e.siblings('.designer').find('input').attr('value', a_dataJson.customdata[i].textArr[0])
                    if ("" != a_dataJson.customdata[i].textArr[1])
                        _$e.siblings('.preview').find('a').attr('href', _fDecodeURIComponent(a_dataJson.customdata[i].textArr[1]))
                    if ("" != a_dataJson.customdata[i].textArr[1])
                        _$e.siblings('.material').find('a').attr('href', _fDecodeURIComponent(a_dataJson.customdata[i].textArr[2]))
                    _$e.siblings('.engineer').find('input').attr('value', a_dataJson.customdata[i].textArr[3])
                    _$e.siblings('.remark').find('input').attr('value', a_dataJson.customdata[i].textArr[4]);
                };
            }
            var newHTML = $.html();
            fs.open(getFilePath(), 'w', 0644, function(e, fd) {
                if (e) throw e;
                fs.write(fd, newHTML, 0, "utf8", function(e) {
                    if (e) throw e;
                    fs.closeSync(fd);
                    console.log('write data');
                })
            });
        }
    })
}

// 刷新列表
function refresh(a_ipAndissueid, a_dataJson) {
    // cmsDateJson = getCMSData();
    var _arr = a_ipAndissueid.split("|");
    getCMSData(_arr[0],_arr[1],function(a_data) {
        insertHTMLFile(createHTMLString(a_data), _arr,  function() {
            try{
                var _dataJson = JSON.parse(a_dataJson);
                resetData(_dataJson);
            }catch(e){
                console.warn("refresh ,JSON.parse() warning.")
            }
        });
    })
}

// 模拟登录cms，获取期刊列表的数据
function getCMSData(a_ip,a_issueid, a_callback) {
    var _h = a_ip.replace("http://","");
    // 模拟协议头
    var options = {
        // host: "192.168.11.20",
        // port: 8888,
        host: _h.split(":")[0],
        port: parseInt(_h.split(":")[1]),
        path: "/section/listTree.do?id="+a_issueid,
        method: "GET",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Content-Length": 0,
            "Accept": "text/plain, */*; q=0.01",
            "Cookie": g_cookie,
            "Accept-Language": "zh-cn",
            "Cache-Control": "no-cache",
            "Connection": "Keep-Alive",
            "Host": _h,
            "Referer": a_ip+"/section/listTree.do?id="+a_issueid,
            "User-Agent": "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0; BOIE9;ZHCN)",
            "X-Requested-With": "XMLHttpRequest"
        }
    };

    var req = http.request(options, function(res) {
        var body = "";
        res.setEncoding("utf8");
        res.on("data", function(data) {
            body += data
            // console.log(data);
        });
        res.on("end", function() {
            // console.log("body is:" + body);
            try {
                var cmsDateJson = JSON.parse(body);
                $seccess.show();
                $fail.hide();
                // console.log('Got response: ', cmsDateJson);
                if (a_callback) {
                    a_callback(cmsDateJson);
                    return true;
                }
                return cmsDateJson;
            } catch (e) {
                $fail.show();
                $seccess.hide();
                console.log("error is:" + e.message);
            }
        });
    }).on("error", function(e) {
        console.log('Got error: ', e);
    });;


    req.write("");
    req.end();
}

// 获取app 包里面的文件
function getAppFile(a_name, a_, a_callback) {
    console.log("getAppFile");
    a_callback(packageDir + "\\" + a_name, 1);
    return false;
}
// 编辑文本
function editText(a_index, a_text, a_callback) {
    console.log('editText, a_index is:'+a_index+" &a_text is:"+a_text);
    fs.readFile(getFilePath(), "utf8", function(err, data) {
        if (err) {
            console.error(err);
        } else {
            console.log('replace data');
            var $ = cheerio.load(data);
            console.log("typeof(a_index) is:",typeof(a_index));
            if(!a_index.match(",")){
                $('.editText').each(function(i, e) {
                    if (i == a_index) {
                        $(e).attr('value', a_text).parent().siblings('.article').addClass('edited');
                        console.log('replace value to ' + a_text);
                    }
                });
            }else{
                var _arr = a_index.split(",");
                var _tdnameArr = ["articleName","designer","engineer","remark"];
                var _ID = _arr[0];
                var _className = _tdnameArr[_arr[1]];
                if(0==$("#"+_ID).length){
                    var _arr = a_index.split(",");
                    var _ID = _arr[0];
                    var _index = _arr[1]>1?parseInt(_arr[1])+2:_arr[1];
                    var _textArr = [{id:_ID,textArr: ["","","","","",""]}]
                    _textArr[0].textArr[_index] = a_text;
                    var _string = createCustomHTMLString(_textArr);
                    $("#cmstbody").append(_string);
                    console.log("cmstbody append :",_string);
                }else{
                    $("#"+_ID+" ."+_className).find("input").attr("value",a_text);
                }
            }
            var newHTML = $.html();
            fs.open(getFilePath(), 'w', 0644, function(e, fd) {
                if (e) throw e;
                fs.write(fd, newHTML, 0, "utf8", function(e) {
                    if (e) throw e;
                    fs.closeSync(fd);
                    console.log('write data');
                    if(a_callback) a_callback("editText",0,"ok");
                })
            });
        }
    })
}
//编辑超链接
function editLink(a_index, a_text, a_callback) {
    console.log('editLink, a_index is:'+a_index+" &a_text is:"+a_text);
    fs.readFile(getFilePath(), "utf8", function(err, data) {
        if (err) {
            console.error(err);
        } else {
            console.log('replace data');
            var $ = cheerio.load(data);
            if(!a_index.match(",")){
                $('.editLink').each(function(i, e) {
                    if (i == a_index) {
                        if(a_text){
                            $(e).attr('href', a_text).parent().siblings('.article').addClass('edited');                        
                        }else{
                            $(e).removeAttr('href');
                        }
                        console.log('replace href to ' + a_text);
                    }

                });
            }else{
                var _arr = a_index.split(",");
                var _tdnameArr = ["preview","material"];
                var _ID = _arr[0];
                var _className = _tdnameArr[_arr[1]];
                if(0==$("#"+_ID).length){        
                    var _index = parseInt(_arr[1])+2;
                    var _textArr = [{id:_ID,textArr: ["","","","","",""]}]
                    _textArr[0].textArr[_index] = a_text;
                    var _string = createCustomHTMLString(_textArr);
                    $("#cmstbody").append(_string);
                    console.log("cmstbody append :",_string);
                }else{
                    $("#"+_ID+" ."+_className).find("a").attr("href",a_text);
                }
            }
            var newHTML = $.html();
            fs.open(getFilePath(), 'w', 0644, function(e, fd) {
                if (e) throw e;
                fs.write(fd, newHTML, 0, "utf8", function(e) {
                    if (e) throw e;
                    fs.closeSync(fd);
                    console.log('write data');
                    if(a_callback) a_callback("editLink",0,"ok");
                })
            });
        }
    })
}
// （根据cms 数据）构建html 格式化的数据
function createHTMLString(a_json) {
    var _sectionlen = a_json.sections.length;
    var _trString = '';
    for (var i = _sectionlen - 1; i >= 0; i--) {
        var _articleLen = a_json.sections[i].children.length;
        var _tdColumn = '<TR id="c' + a_json.sections[i].id + '" bgColor=#ffffff class="cmsTR" ><TD rowspan="' + _articleLen + '" class="column">' + a_json.sections[i].name + '</TD>';
        var _tdString = ''
        for (var j = _articleLen - 1; j >= 0; j--) {
            var _tdHead = 0 == j ? '' : "<TR bgColor=#ffffff>";
            var _tdArticle = "<TD id='a" + a_json.sections[i].children[j].id + "'class='article '><a target='_blank' href='" + getArticleLink(a_json.sections[i].children[j].id) + "' >" + a_json.sections[i].children[j].name + "</a></TD>";
            var _tdDesigner = "<TD class='designer '><input class='editText' type='text' value='？' /></TD>";
            var _tdPreview = "<TD class='preview '><a  target='_blank' class='editLink'>查看</a></TD>";
            var _tdMaterial = "<TD class='material '><a  target='_blank' class='editLink'>查看</a></TD>";
            var _tdEngineer = "<TD class='engineer'><input class='editText' type='text' value='？' /></TD>";
            var _tdRemark = "<TD class='remark'><input class='editText' type='text' value='？' /></TD>";
            var _tdFoot = "</TR>";
            _tdString = _tdHead + _tdArticle + _tdDesigner + _tdPreview + _tdMaterial + _tdEngineer + _tdRemark + _tdFoot + _tdString;
        };
        _trString = _tdColumn + _tdString + _trString;
    };
    return _trString;
}
// （根据用户自定义数据）构建html 格式化的数据
function createCustomHTMLString(a_arr) {
    var _sectionlen = a_arr.length;
    var _trString = '';
    console.log("createCustomHTMLString arr is:",a_arr);
    for (var i = _sectionlen - 1; i >= 0; i--) {
        // var _articleLen = a_json.sections[i].children.length;
        var _tdColumn = '<TR id="' + a_arr[i].id + '" bgColor="#ffffff" class="customTR" ><TD rowspan="1" class="column">自定义</TD>';
        var _tdString = ''
        // for (var j = _articleLen - 1; j >= 0; j--) {
            var _tdArticle = "<TD id='c"+ a_arr[i].id +"' class='article'><input class='editText' type='text' value='" + a_arr[i].textArr[0] + "' /></TD>";
            var _tdDesigner = "<TD class='designer '><input class='editText' type='text' value='"+a_arr[i].textArr[1]+"' /></TD>";
            if(a_arr[i].textArr[2]){
                var _tdPreview = "<TD class='preview '><a href='"+a_arr[i].textArr[2]+"' target='_blank' class='editLink'>查看</a></TD>";
            }else{
                var _tdPreview = "<TD class='preview '><a target='_blank' class='editLink'>查看</a></TD>";
            }
            if(a_arr[i].textArr[3]){
                var _tdMaterial = "<TD class='material '><a href='"+a_arr[i].textArr[3]+"' target='_blank' class='editLink'>查看</a></TD>";
            }else{
                var _tdMaterial = "<TD class='material '><a target='_blank' class='editLink'>查看</a></TD>";
            }
            var _tdEngineer = "<TD class='engineer'><input class='editText' type='text' value='"+a_arr[i].textArr[4]+"' /></TD>";
            var _tdRemark = "<TD class='remark'><input class='editText' type='text' value='"+a_arr[i].textArr[5]+"' /></TD>";
            var _tdFoot = "</TR>";
            _tdString =  _tdArticle + _tdDesigner + _tdPreview + _tdMaterial + _tdEngineer + _tdRemark + _tdFoot + _tdString;
        // };
        _trString = _tdColumn + _tdString + _trString;
    };
    return _trString;
}
// 复制并修改模板页，生成最终html 文件
function insertHTMLFile(a_string, a_ipAndissueidArr, a_callback) {
    fs.readFile(fileName, "utf8", function(err, data) {
        if (err) {
            console.error(err);
        } else {
            console.log('replace data');
            var cmsdata = data.replace('{{cmsdata}}', a_string).replace('{{IP}}', a_ipAndissueidArr[0]).replace('{{g_issueID}}', a_ipAndissueidArr[1]).replace(new RegExp("{{localIP}}","gm"),g_localIP+":"+g_port);
            // cmsdata = cmsdata.replace('{{IP}}', g_IP);
            fs.open(getFilePath(), 'w', 0644, function(e, fd) {
                if (e) throw e;
                fs.write(fd, cmsdata, 0, "utf8", function(e) {
                    if (e) throw e;
                    fs.closeSync(fd);
                    console.log('write data');
                    if (a_callback) a_callback();
                })
            });
        }
    })

}

console.log('Server running at '+g_localIP+':'+g_port);
