(function (w, d) {
    if (!w.XMLHttpRequest) return false;
    w.addEventListener('DOMContentLoaded', function () {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', '{loaderPath}', true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                var el = d.createElement('div');
                el.style.display = 'none';
                el.innerHTML = xhr.responseText;
                d.body.appendChild(el);
            }
        };
        xhr.send();
    });
})(window, document);
