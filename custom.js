var $editLink = $('.editLink');
var $editText = $('.editText');
var $cmsdata = $('#cmsdata');
var $cmstable = $('#cmstable');
var $editOrNot = $('#editOrNot');
var $detail = $('#detail');
var $logo = $('#logo');
var $comment = $('#comment');
var $mtitle = $('#mtitle');
var $createCustom = $('#createCustom');
var $cmstbody = $('#cmstbody');
var $refreshIndex = $('#refreshIndex');
var g_editOrNot = 0;
var g_editOrNotText = ['进入修改状态', '关闭修改状态'];
// http://www.baidu.com

function _saveLinkData(e, a_index) {
    if (!g_editOrNot) return;
    var _$e = $(e.target);
    var _text = prompt('请输入网址',(_$e.attr('href')||""));
    if (_text || _$e.attr('href')) {
        _$e.attr('href', _text).parent().siblings('.article').addClass('edited');
        // console.log('encodeURIComponent(_text) is:'+encodeURIComponent(_text))
        _localSaveData('editLink', a_index, encodeURIComponent(_text));
    }

    e.preventDefault();

}

function _saveTextData(e, a_index) {
    if (!g_editOrNot) return;
    // console.log('this is:',e.target);
    var _text = e.target.value;
    $(e.target).parent().siblings('.article').addClass('edited');
    e.preventDefault();
    _localSaveData('editText', a_index, encodeURIComponent(_text));
}

function _ajax(a_url, a_callback) {
    console.log('ajax url is:' + a_url);
    var xhr = new XMLHttpRequest();
    xhr.open("GET", a_url, true);
    xhr.onerror = function(e) {
        console.log('please check the server is running...')
    }
    xhr.onload = function(e) {
        if (a_callback) a_callback(this.responseText);
    };
    xhr.send();
}

function _localSaveData(a_type, a_index, a_string) {
    // var _url = g_localIP + 'function/' + a_type + '/' + a_index + '/' + a_string;
    var _url = g_localIP + location.pathname + '?func=' + a_type + '&index=' + a_index + '&str=' + a_string;
    _ajax(_url);
}

// function _localSaveTextData(a_index, a_href) {
//   var _url = g_localIP + 'editText/' + a_index + '/' + a_href;
//   _ajax(_url);
// }
function countSheet () {
  var $article = $(".article");
  var $preview = $(".preview");
  var $material = $(".material");
  var $engineer = $(".engineer");
  var $remark = $(".remark");
  var _str = "";
  var _articleLen = $article.dom.length;
  var _previewLen = 0;
  var _materialLen = 0;
  var _engineerLen = 0;
  var _remarkLen = 0;
  var _remarkArticleLen = 0;
  var _remarkDefaultLen = 0;
  var _remarkActivityLen = 0;
  var _remarkOperatingLen = 0;
  var _remarkADLen = 0;

  $preview.each(function(a_el, a_index){
    var _$el = $(a_el);
    if(_$el.find("a").attr("href") ){_previewLen++}
  });
  $material.each(function(a_el, a_index){
    var _$el = $(a_el);
    // console.log(_$el.find("a").attr("href"))
    if(_$el.find("a").attr("href") ){_materialLen++}
  });
  $engineer.each(function(a_el, a_index){
    var _$el = $(a_el);
    if(_$el.find("input").get(0).value.match("完成") ){_engineerLen++}
  });
  $remark.each(function(a_el, a_index){
    var _$el = $(a_el);
    var _value = _$el.find("input").get(0).value;
    if(_value.match("完成") ){_remarkLen++}
    if(_value.match("文章") ){_remarkArticleLen++}
    if(_value.match("标配") ){_remarkDefaultLen++}
    if(_value.match("活动") ){_remarkActivityLen++}
    if(_value.match("运营") ){_remarkOperatingLen++}
    if(_value.match("广告") ){_remarkADLen++}
    
  });
  _remarkArticleLen = _remarkArticleLen||(_articleLen-_remarkDefaultLen-_remarkActivityLen-_remarkOperatingLen-_remarkADLen);//默认是文章
  _str = "<p>总数："+_articleLen+"篇,文章数："+_remarkArticleLen+"篇，标配数："+_remarkDefaultLen+"篇，活动数："+_remarkActivityLen+"篇，运营数："+_remarkOperatingLen+"篇，广告数："+_remarkADLen+"篇;</p><p>完成设计稿："+
  _previewLen+"篇，完成素材："+
  _materialLen+"篇，完成交互："+
  _engineerLen+"篇;总进度："+
  _remarkLen+"/"+_articleLen+";</p>";
  $comment.html(_str)
}

function initLogo(){
  var _src = "";
  if("http://192.168.11.20:8888"==g_IP){
    _src = g_localIP+"/?func=getAppFile&index=PChouse.png";
    document.title = "PChouse家居杂志";
    $mtitle.html("PChouse家居杂志");
  }else if("http://192.168.11.9:8888"==g_IP){
    _src = g_localIP+"/?func=getAppFile&index=PCauto.png";
    document.title = "PCauto汽车杂志";
    $mtitle.html("PCauto汽车杂志");
  }else{
    _src = g_localIP+"/?func=getAppFile&index=PClady.png";  
    $mtitle.html("PClady时尚杂志");
    document.title = "PClady时尚杂志";
  }
  $logo.attr("src",_src)
}
$refreshIndex.bind('click', function() {
    var _b = confirm("你确定要刷新列表？被删除的文章的数据和期刊标题不会自动保存记录，请刷新后自己再次修改。");
    if(!_b) return;
    var _editedDataJsonString = '{"cmsdata":[ ';
    $('.cmsTR .edited').each(function(a_el, a_index) {
      // console.log('a_index is:',a_index)
      var _$el = $(a_el);
      if(1){
        // console.log('_$el is:',_$el)
        // console.log('_$el.find(.designer).find(input) is:',_$el.siblings('.designer').find('input'))
        // console.log('_$el.find(.engineer).find(input) is:',_$el.siblings('.engineer').find('input'))
        // console.log('_$el.find(.remark).find(input) is:',_$el.siblings('.remark').find('input'))
        _editedDataJsonString += '{"id":"'+_$el.attr('id')+
        '","textArr":["'+_$el.siblings('.designer').find('input').get(0).value+
        '","'+encodeURIComponent((_$el.siblings('.preview').find('a').attr('href'))||'')+
        '","'+encodeURIComponent((_$el.siblings('.material').find('a').attr('href'))||'')+
        '","'+_$el.siblings('.engineer').find('input').get(0).value+
        '","'+_$el.siblings('.remark').find('input').get(0).value+'"]},';
        
      }else{

        console.error('no match:',a_el.className);
      }
      
    });
    _editedDataJsonString = _editedDataJsonString.slice(0,-1);
    _editedDataJsonString += '],"customdata":[ ';
    $(".customTR").each(function(a_el, a_index) {
        var _$el = $(a_el);
        _editedDataJsonString += '{"id":"cur'+_$el.attr('id')+
        '","textArr":["'+encodeURIComponent(_$el.find(".articleName .editText").get(0).value)+
        '","'+encodeURIComponent(_$el.find(".designer .editText").get(0).value)+
        '","'+encodeURIComponent((_$el.find(".preview a").attr('href')||''))+
        '","'+encodeURIComponent((_$el.find(".material a").attr('href')||''))+
        '","'+encodeURIComponent(_$el.find(".engineer .editText").get(0).value)+
        '","'+encodeURIComponent(_$el.find(".remark .editText").get(0).value)+'"]},';
    })
    _editedDataJsonString = _editedDataJsonString.slice(0,-1);
    _editedDataJsonString += ']}';

    var _url = g_localIP + location.pathname + '?func=refresh' + '&index=' + g_IP+"|"+g_issueID + '&str=' + _editedDataJsonString;
    console.log('_editedDataJsonString is:',_editedDataJsonString);
    _ajax(_url,function(){
      window.location.reload();
    });
})
$createCustom.bind('click', function(e) {
    var _textArr = [];
    var _aArr = [];
    e.preventDefault();
    var _tr = document.createElement("tr");
    _tr.id = "cur"+$(".customTR").dom.length;
    _tr.bgColor = "#ffffff";
    _tr.className = "customTR";
    var _td0 = document.createElement("td");
    _td0.className = "column"
    _td0.rowSpan = "1"
    _td0.innerHTML = "自定义";
    var _td1 = document.createElement("td");
    _td1.className = "articleName";
    var _input1 = document.createElement("input");
    _input1.className = "editText";
    _input1.type = "text";
    _input1.value = "？";
    _textArr.push(_input1.className);
    _td1.appendChild(_input1);
    var _td2 = document.createElement("td");
    _td2.className = "designer";
    var _input2 = document.createElement("input");
    _input2.className = "editText";
    _input2.type = "text";
    _input2.value = "？";
    _td2.appendChild(_input2);
    _textArr.push(_input2);
    var _td3 = document.createElement("td");
    _td3.className = "preview";
    var _a1 = document.createElement("a");
    _a1.className = "editLink";
    _a1.target = "_blank";
    _a1.innerHTML = "查看";
    _td3.appendChild(_a1);
    _aArr.push(_a1);
    var _td4 = document.createElement("td");
    _td4.className = "material";
    var _a2 = document.createElement("a");
    _a2.className = "editLink";
    _a2.target = "_blank";
    _a2.innerHTML = "查看";
    _td4.appendChild(_a2);
    _aArr.push(_a2);
    var _td5 = document.createElement("td");
    _td5.className = "engineer";
    var _input3 = document.createElement("input");
    _input3.className = "editText";
    _input3.type = "text";
    _input3.value = "？";
    _td5.appendChild(_input3);
    _textArr.push(_input3);
    var _td6 = document.createElement("td");
    _td6.className = "remark";
    var _input4 = document.createElement("input");
    _input4.className = "editText";
    _input4.type = "text";
    _input4.value = "？";
    _td6.appendChild(_input4);
    _textArr.push(_input4);

    _tr.appendChild(_td0);
    _tr.appendChild(_td1);
    _tr.appendChild(_td2);
    _tr.appendChild(_td3);
    _tr.appendChild(_td4);
    _tr.appendChild(_td5);
    _tr.appendChild(_td6);
    $cmstbody.get(0).appendChild(_tr);
    $("#"+_tr.id+" .editText").each(function(a_el, a_index) {
        var _$el = $(a_el);
        _$el.bind('blur', function(e) {
            _saveTextData(e, _tr.id+","+a_index );
        });
        _$el.bind('focus', function(e) {
            $detail.html(this.value);
            if (!g_editOrNot) e.target.blur();
        });
    })
    $("#"+_tr.id+" .editLink").each(function(a_el, a_index) {
        var _$el = $(a_el);
        _$el.bind('click', function(e) {
          _saveLinkData(e, _tr.id+","+a_index);
      });
    })
})
$logo.bind('click', function(e) {

  if (!g_editOrNot) return;
    var _text = prompt('请输入网址');
    if (_text) {
        $logo.attr('src', _text);
    }

    e.preventDefault();
})
$editOrNot.bind('click', function() {
    g_editOrNot = g_editOrNot ? 0 : 1;
    $cmstable.toggle('edit')
    $editOrNot.html(g_editOrNotText[g_editOrNot])
})
$editLink.each(function(a_el, a_index) {
    var _$el = $(a_el);
    _$el.bind('click', function(e) {
        _saveLinkData(e, a_index);
    });
})
$editText.each(function(a_el, a_index) {
    var _$el = $(a_el);
    _$el.bind('blur', function(e) {
        _saveTextData(e, a_index);
    });
    _$el.bind('focus', function(e) {
        $detail.html(this.value);
        if (!g_editOrNot) e.target.blur();
    });
})
countSheet();
initLogo()
