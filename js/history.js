
$(function() {
    $('#items').on('click', '.delete', function(e) {
        e.preventDefault();
        var s = $(this).closest('.snippet');
        chrome.extension.getBackgroundPage().archive.deleteItem(s.data('snippet').ID, function() {
            s.remove();
        });
    });

    $('#items').on('click', '.edit', function(e) {
        e.preventDefault();
        loadSnippet($(this).closest('.snippet').data('snippet'));
    });

    loadItems();
});

function loadSnippet(data) {
    var snippet = new Snippet(data.lang, data.code, data.output, data.link);
    chrome.browserAction.setBadgeText({text:'Done'});
    chrome.browserAction.setBadgeBackgroundColor({color:[255,0,0,255]});
}



function loadItems() {
    $('#items').empty();
    chrome.extension.getBackgroundPage().archive.getAllItems(function(tx, rs) {
        var rowOutput = [];
        var rows = rs.rows;
        var history = $('#items');
        for (var i=0; i < rows.length; i++) {
            history.append(renderItem(rows.item(i)));
        }

    }); 

}


function renderItem(item) {
    var row = $('#snippetTemplate').clone().find('.snippet');
    row.data('snippet', item);

    row.find('.lang').text(languages[item.lang].display).end()
    .find('.date').text($.timeago(new Date(item.time))).end()
    .find('.output').text(item.output).end()
    .find('.link a').prop('href', item.link).text(item.link);

    CodeMirror.runMode(item.code, languages[item.lang].mode, row.find('.code')[0]);

    row.show().appendTo('#items');

    return row;
}
