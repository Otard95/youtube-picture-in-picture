(function () {
    var embedHtml = function (id) { return "\n    <iframe\n      width=\"560\"\n      height=\"315\"\n      src=\"https://www.youtube.com/embed/" + id + "\"\n      frameborder=\"0\"\n      allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\"\n      allowfullscreen\n    ></iframe>\n  "; };
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
    var getVideoId = function (url) {
        var match = url.match(/https?:\/\/www\.youtube\.com\/watch\/?\?(?:[\w\[\]]+=.*)*(v=\w+)/);
        if (!match)
            return null;
        var param = match[1];
        if (typeof param === 'string') {
            return param.substring(2);
        }
        return null;
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
            var id = getVideoId(input.value);
            if (id) {
                var iFrame = document.querySelector('iframe');
                var newIFrame = DOM(embedHtml(id));
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