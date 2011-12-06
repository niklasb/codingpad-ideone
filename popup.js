var req;
var submitBtn = document.getElementById('submit');
var resultArea =  document.getElementById('result');
var langSel = document.getElementById('lang');
var snippet = chrome.extension.getBackgroundPage().CodeSnippet;

if(snippet.output) {
    showOutput(snippet);
}


chrome.browserAction.setBadgeText({text:''});


langSel.value = snippet.lang || localStorage.getItem('lang');


var parserConfig = {
    'PHP': 'PHPHTMLMixedParser',
    'Python': 'PythonParser',
    'Scheme': 'SchemeParser',
    'default': 'DummyParser'
}
var editor = CodeMirror.fromTextArea('code', {
    path: "CodeMirror/js/",
    parserfile: ["parsedummy.js", "parsecss.js", "tokenizejavascript.js", "parsejavascript.js", "parsexml.js",
        "parsepython.js", "parsehtmlmixed.js", "tokenizescheme.js",  "parsescheme.js", "tokenizephp.js", "parsephp.js", "parsephphtmlmixed.js"],
        stylesheet: ["CodeMirror/css/csscolors.css", "CodeMirror/css/jscolors.css", "CodeMirror/css/phpcolors.css", "CodeMirror/css/pythoncolors.css", "CodeMirror/css/xmlcolors.css", "CodeMirror/css/schemecolors.css"],
        initCallback: function(e) {
            editor = e;
            updateParser();
            e.focus();
            if(snippet.code) {
                //while(editor.getCode() != snippet.code) {
                editor.setCode(snippet.code);
                //}
            }
        },
        lineNumbers: true,
        height: 'dynamic',
        width: 400,
        minHeight: 45,
});



window.addEventListener('unload', function(e) {
    var code = editor.getCode();  
    if(snippet.code != code) {
        snippet.clear();
        snippet.code = code;
    } 
}, false);

window.addEventListener('click', function(e) {
    if(e.target.nodeName == 'A') {
        chrome.tabs.create({url: e.target.href});
    } 
}, false);

document.getElementById('history').href = chrome.extension.getURL('archive.html');

document.getElementById('clear').addEventListener('click', function(e) {
    e.stopPropagation();
    snippet.clear();
    editor.setCode('');
    resultArea.style.display = 'none';
    editor.focus();
    if(req) {
        req.abort();
    }
    if(noteTimer) {
        clearTimeout(noteTimer);
        document.getElementById('note').style.display = 'none';
    }
}, false);

submitBtn.addEventListener('click', function() {
    if (req) {
        req.abort();
        req = null;
        hideLoader();
        return;
    }
    req = new XMLHttpRequest();
    req.onload = function() {
        if(noteTimer) {
            clearTimeout(noteTimer);
            document.getElementById('note').style.display = 'none';
        }

        var code = editor.getCode();
        snippet = parseResponse(req.responseText, snippet);
        snippet.code = code;
        snippet.save();
        hideLoader();
        showOutput(snippet);
        req = null;
    };

    req.onloadstart = function() {
        showLoader();
    }

    // req.onloadend = function() {
    //    hideLoader();
    // }

    req.onerror = function() {
        showOutput('<span class="error">An unkown error occured.</span>');
    }
    req.ontimeout = function() {
        showOutput('<span class="error">Could not reach codepad.org...</span>');
    }
    req.onabort = function() {
        hideLoader();
    }

    req.open( "POST", "http://codepad.org/", true);
        //req.timeout = 3000;
        req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    var params = 'submit=submit&run=True&lang='+langSel.value+'&code='+encodeURIComponent(editor.getCode());
    req.send(params);
    noteTimer = setTimeout(function() {
        document.getElementById('note').style.display = 'block';
    }, 3000);
});

langSel.addEventListener('change', updateParser);

function updateParser() {
    var lang = langSel.value;
    if(lang in parserConfig) {
        editor.setParser(parserConfig[lang]);
    }
    else {
        editor.setParser(parserConfig['default']);
    }
    snippet.lang = lang;
    localStorage.setItem('lang', lang);
}

function showLoader() {
    submitBtn.innerHTML = '<img src="loader.gif" /> Loading...Click to abort';
}

function hideLoader() {
    submitBtn.innerHTML = "Run";
}


function parseResponse(result, snippet) {
    var text = "No errors or program output.";
    var link = '';
    var tmp = document.createElement('div');
    tmp.innerHTML = result;
    var output = tmp.querySelector("a[name='output']");
    if(output) {
        var textContainer = output.nextElementSibling.querySelectorAll('pre')[1];
        if(textContainer)
            text = textContainer.innerHTML;
    }

    var linkEl = tmp.querySelector(".heading");
    if(linkEl)  {
        link = linkEl.nextElementSibling.firstElementChild.innerHTML;
    }
    snippet.link = link;
    snippet.output = text;
    return snippet;
}

function showOutput(snippet) {
    var text = "<div><p>Output:</p><pre>" + snippet.output + '</pre></div>';
    resultArea.innerHTML = text;
    resultArea.style.display = 'block';
    if(snippet.link) {
        var p = document.createElement(p);
        p.innerHTML = snippet.link.link(snippet.link);
        resultArea.appendChild(p);
    }

}
