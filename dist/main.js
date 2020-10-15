var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
(function () {
    var embedHtml = function (id, time) {
        if (time === void 0) { time = 0; }
        return "\n    <iframe\n      width=\"560\"\n      height=\"315\"\n      src=\"https://www.youtube.com/embed/" + id + "?start=" + time + "\"\n      frameborder=\"0\"\n      allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\"\n      allowfullscreen\n    ></iframe>\n  ";
    };
    var newVideoHtml = "\n    <div class=\"new-container\">\n      <div class=\"new-form\">\n        <input type=\"url\" name=\"video\" id=\"video\" placeholder=\"www.youtube.com/watch?v=xWgNOCqyjJg\">\n        <button disabled>Watch</button>\n      </div>\n    </div>\n  ";
    var state = {
        newFormOpen: false
    };
    /**
     * @param {string} html
     */
    var DOM = function (html) {
        var div = document.createElement('div');
        div.innerHTML = html.trim();
        return div.childNodes;
    };
    /**
     * @param {string} url
     */
    var qs = function (url) {
        var _a = url.split('?'), _uri = _a[0], query = _a[1];
        if (!query)
            return {};
        var params = query.split('&');
        return params
            .map(function (p) { return p.split('='); })
            .reduce(function (data, _a) {
            var _b;
            var k = _a[0], v = _a[1];
            return (__assign(__assign({}, data), (_b = {}, _b[k] = v, _b)));
        }, {});
    };
    /**
     * @param {string} url
     */
    var getVideoId = function (url) {
        if (!/https?:\/\/www\.youtube\.com\/watch\/?\?(?:[\w\[\]]+=.*)*/.test(url))
            return null;
        var _a = qs(url), v = _a.v, t = _a.t;
        if (typeof v === 'string') {
            return { id: v, start: t };
        }
        return null;
    };
    var transformTime = function (time) {
        if (!time)
            return;
        if (typeof time === "number")
            return time;
        if (time.endsWith('s'))
            return Number(time.substring(0, time.length - 1));
        return Number(time);
    };
    var initNewVideoDom = function (newVideoDom) {
        if (!newVideoDom)
            return;
        var button = newVideoDom.querySelector('button');
        var input = newVideoDom.querySelector('input');
        input.addEventListener('change', function () {
            button.disabled = (getVideoId(input.value) === null);
        });
        input.addEventListener('keyup', function () {
            button.disabled = (getVideoId(input.value) === null);
        });
        button.addEventListener('click', function () {
            var _a;
            var _b = getVideoId(input.value), id = _b.id, start = _b.start;
            if (id) {
                var iFrame = document.querySelector('iframe');
                var newIFrame = DOM(embedHtml(id, transformTime(start)));
                (_a = document.body).append.apply(_a, newIFrame);
                iFrame && iFrame.remove();
                toggleNewVideoForm();
            }
        });
    };
    var toggleNewVideoForm = function () {
        state.newFormOpen = !state.newFormOpen;
        if (state.newFormOpen) {
            var newVideoDom = DOM(newVideoHtml)[0];
            initNewVideoDom(newVideoDom);
            document.body.append(newVideoDom);
        }
        else {
            document.querySelector('.new-container').remove();
        }
        var newVideoBtn = document.querySelector('#new-video');
        newVideoBtn.innerHTML = state.newFormOpen ? '-' : '+';
        state.newFormOpen
            ? newVideoBtn.classList.add('close')
            : newVideoBtn.classList.remove('close');
    };
    var init = function () {
        document.querySelector('#close-window').addEventListener('click', function () {
            console.log(require('electron').ipcRenderer.send('exit'));
        });
        document.querySelector('#new-video').addEventListener('click', function () {
            toggleNewVideoForm();
        });
        toggleNewVideoForm();
    };
    document.onreadystatechange = function () {
        if (document.readyState == "complete") {
            init();
        }
    };
})();
//# sourceMappingURL=main.js.map