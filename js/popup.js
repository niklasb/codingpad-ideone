/* utility methods */

function showElement(element) {
   element.style.display = 'block';
}

function hideElement(element) {
   element.style.display = 'none';
}


/* entities */


var Request = (function() {
    var request,
        running = false,
        timeout,
        note =  document.getElementById('note'),
        submitBtn = document.getElementById('submit');

    /* utility functions */

    function showLoader() {
        submitBtn.innerHTML = '<img src="loader.gif" /> Loading...Click to abort';
    }

    function hideLoader() {
        submitBtn.innerHTML = "Run";
    }

    function getSnippetFromResponse(response, language, code) {
        var  result = "No errors or program output.",
             link = '',
             tmp = document.createElement('div'),
             output, textContainer, text;

        tmp.innerHTML = response;

        var linkEl = tmp.querySelector("#link_presentation");
        if(linkEl)  {
            link = linkEl.value;

            var id = link.split('/').pop();
            var r = new XMLHttpRequest();
            var result_code;
            var json;
            var retries = 20;
            while (retries >= 0) {
                r.open("POST",
                       "http://ideone.com/ideone/Index/view/id/"
                                           + id + "/ajax/1/lp/1",
                       false);
                r.send();
                json = JSON.parse(r.responseText);
                if (json.status !== "0") {
                    retries--;
                    continue;
                }

                var inouterr = document.createElement('div');
                inouterr.innerHTML = json.inouterr;
                var outputEl = inouterr.querySelector('pre');
                if (outputEl) {
                    result = outputEl.innerHTML;
                }
                break;
            }
        }

        return new Snippet(language, code, result, link);
    }

    /* event handlers */

    function onload() {
        if(timeout) {
            clearTimeout(timeout);
            hideElement(note);
        }

        var snippet = getSnippetFromResponse(request.responseText, Editor.getLanguage(), Editor.getCode());
        Editor.setSnippet(snippet);
        snippet.save();
        hideLoader();
    }

    function onerror() {
        Editor.showError('An unkown error occured.');
    }

    function ontimeout() {
        Editor.showError('Could not reach ideone.com');
    }

    function onloadstart() {
         showLoader();
    }

    function onabort() {
         hideLoader();
    }

    /* object methods */

    function start() {
        this.abort();
        if(running) {
            return;
        }
        running = true;
        request = new XMLHttpRequest();
        request.onloadstart = onloadstart;
        request.onload = onload;
        request.onerror = onerror;
        request.ontimeout = ontimeout;
        request.onabort = onabort;

        request.open("POST", "http://ideone.com/ideone/Index/submit/", true);
        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

        request.send([
            'lang=' + encodeURIComponent(languages[Editor.getLanguage()].value),
            'run=1',
            'file=' + encodeURIComponent(Editor.getCode()),
        ].join('&'));

        timeout = setTimeout(function() {
            showElement(note);
        }, 3000);
        showLoader();
    }

    function abort() {
        running = false;
        if(request) {
            request.abort();
        }
        if(timeout) {
            clearTimeout(timeout);
            hideElement(note);
        }
    }

    return {
        abort: abort,
        start: start
    }
}());



var Editor = (function() {
    /* DOM elements */
    var submitBtn = document.getElementById('submit'),
        resultArea =  document.getElementById('result'),
        outputArea = document.getElementById('output'),
        langSel = document.getElementById('lang'),
        resultLink = document.getElementById('result_link'),
        error = document.getElementById('error');


    var editor, snippet, language = '';

    editor = CodeMirror.fromTextArea(document.getElementById('code'), {
        lineNumbers: true,
    });


    function showError(msg) {
        hideElement(resultArea);
        error.innerHTML = msg;
        showElement(error);
    }


    function showResult(snippet) {
        outputArea.innerHTML = snippet.result;
        showElement(resultArea);
        if(snippet.link) {
            resultLink.innerHTML = snippet.link;
            resultLink.href = snippet.link;
            showElement(resultLink);
        }
        else {
            hideElement(resultLink);
        }
    }

    function updateCode(code) {
        if(editor.getValue() !== code) {
            editor.setValue(code);
        }
    }

    function setSnippet(s) {
        snippet = s;
        updateCode(snippet.code);
        setLanguage(snippet.language);
        if(snippet.result) {
            showResult(snippet);
        }
    }

    function clear() {
        snippet.clear();
        editor.setValue('');
        hideElement(resultArea);
    }

    function focus() {
        editor.focus();
    }

    function getCode() {
        return editor.getValue();
    }

    function save() {
        if(editor.getValue() !== snippet.code) {
            // create a new snippet
            setSnippet(new Snippet(language, editor.getValue()));
        }
    }

    function getLanguage() {
        return language;
    }

    function setLanguage(lang) {
        language = lang;
        langSel.value = lang;
        editor.setOption('mode', languages[lang] && languages[lang].mode || '');
    }

    return {
        showError: showError,
        showResult: showResult,
        clear: clear,
        getCode: getCode,
        save: save,
        getLanguage: getLanguage,
        setLanguage: setLanguage,
        focus: focus,
        setSnippet: setSnippet
    };

}());


/* init */

(function() {

    /* set up language list */
    var select = document.getElementById('lang');
    for(var i = 0, len = language_order.length; i < len; i++) {
        var lang = languages[language_order[i]];
        var option = document.createElement('option');
        option.innerHTML = lang.display;
        option.value = language_order[i];
        select.add(option);
    }

    // Load active snippet
    Editor.setSnippet(chrome.extension.getBackgroundPage().getCurrentSnippet());
    Editor.focus();

    // Load last used language
    var lang = localStorage.getItem('lang') || language_order[0];
    document.getElementById('lang').value = lang;
    Editor.setLanguage(lang);

    
    // Clear badge text (in case the snippet it was loaded from history)
    chrome.browserAction.setBadgeText({text:''});

    // Set history link properly
    document.getElementById('history').href = chrome.extension.getURL('archive.html')


    /* set up event handlers */

    // store code temporarily
    window.addEventListener('unload', function(e) {
        Editor.save();
    }, false);

    // open new tab when link is clicked
    window.addEventListener('click', function(e) {
        if(e.target.nodeName == 'A') {
            e.preventDefault();
            window.close();
            chrome.tabs.create({url: e.target.href});
        } 
    }, false);

    document.getElementById('clear').addEventListener('click', function(e) {
        e.stopPropagation();
        Editor.clear();
        Editor.focus();
    }, false);

    document.getElementById('submit').addEventListener('click', function() {
         Request.start();
    }, false);

    document.getElementById('lang').addEventListener('change', function() {
        localStorage.setItem('lang', this.value);
        Editor.setLanguage(this.value);
    }, false);


}());

