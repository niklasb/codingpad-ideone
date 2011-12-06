var path = "CodeMirror/js/";
var parsers =  ["parsedummy.js", "parsecss.js", "tokenizejavascript.js", "parsejavascript.js", "parsexml.js",
    "parsepython.js", "parsehtmlmixed.js", "tokenizescheme.js",  "parsescheme.js", "tokenizephp.js", "parsephp.js", "parsephphtmlmixed.js"];

var stylesheets = ["CodeMirror/css/csscolors.css", "CodeMirror/css/jscolors.css", "CodeMirror/css/phpcolors.css", "CodeMirror/css/pythoncolors.css", "CodeMirror/css/xmlcolors.css", "CodeMirror/css/schemecolors.css"];


var parserConfig;

$(function() {
        loadItems();
        });

function loadItems() {
    $('#items').empty();
    chrome.extension.getBackgroundPage().history.getAllItems(function(tx, rs) {
            parserConfig = {
            'PHP': PHPHTMLMixedParser,
            'Python': PythonParser,
            'Scheme': SchemeParser,
            'default': DummyParser
            };

            var rowOutput = [];
            var rows = rs.rows;
            var history = $('#items');
            for (var i=0; i < rows.length; i++) {
            history.append(renderItem(rows.item(i)));
            }

            }); 

}


function renderItem(item) {
    var row = $('<div class="snippet"/>');
    row.append('<p class="header"><span class="lang">' + item.lang + '</span>, <span class="date">' + $.timeago(new Date(item.time)) +'</span></p>');
    row.append('<div><span class="label">Code:</span> <pre class="code"/></div>');
    var parser = (parserConfig[item.lang] || parserConfig['default']);
    highlightText(item.code, row.find('> :last pre')[0], parser);
    row.append('<div><span class="label">Output:</span><pre class="output">' + item.output + '</pre></div>');
    row.append('<div class="link"><a href="' + item.link+ '">' + item.link + '</a></div>');
    row.append('<div class="action"/>');
    $('<span class="delete" title="delete">X</span>').bind('click', {item: item, row: row}, function(event) {
            chrome.extension.getBackgroundPage().history.deleteItem(event.data.item.ID, function() {
                event.data.row.remove();
                });
            }).appendTo(row.children(':last'));
    $('<span class="edit" title="edit">&#8634;</span>').bind('click', {item: item, row: row}, function(event) {
            var s = chrome.extension.getBackgroundPage().CodeSnippet;
            s.clear();
            s.code = item.code;
            s.lang = item.lang;
            chrome.browserAction.setBadgeText({text:'Done'});
            chrome.browserAction.setBadgeBackgroundColor({color:[255,0,0,255]});
            }).appendTo(row.children(':last'));
    return row;
}


function loadjscssfile(filename, filetype){
    if (filetype=="js"){ //if filename is a external JavaScript file
        var fileref=document.createElement('script')
            fileref.setAttribute("type","text/javascript")
            fileref.setAttribute("src", filename)
    }
    else if (filetype=="css"){ //if filename is an external CSS file
        var fileref=document.createElement("link")
            fileref.setAttribute("rel", "stylesheet")
            fileref.setAttribute("type", "text/css")
            fileref.setAttribute("href", filename)
    }
    if (typeof fileref!="undefined")
        document.getElementsByTagName("head")[0].appendChild(fileref)
}

