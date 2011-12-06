function Snippet(language, code, result, link) {
   this.language = language || '';
   this.code = code || '';
   this.result = result || '';
   this.link = link || '';
   this.dirty = false;
   this.session.current_snippet = this;
}

Snippet.prototype.markDirty = function() {
    this.dirty = true;
};

Snippet.prototype.db = chrome.extension.getBackgroundPage().archive;
Snippet.prototype.session = chrome.extension.getBackgroundPage();

Snippet.prototype.set = function(prop, value) {
    if(!this[prop]  || this[prop] && value !== this[prop]) {
        this[prop] = value;
        this.dirty = true;
    }
};

Snippet.prototype.clear = function() {
    this.language = '';
    this.code = '';
    this.result = '';
    this.link = '';
};

Snippet.prototype.save = function() {
    this.db.addItem(this);
    this.dirty = false;
};


