/*global define,document,navigator,location*/

define(function () {
    'use strict';

    return {
        fallback: function (urls) {
            var i = 0;

            (function createIframe() {
                var frame = document.createElement('iframe');
                frame.style.display = 'none';
                frame.src = urls[i++];
                document.documentElement.appendChild(frame);

                // the download init has to be sequential otherwise IE only use the first
                var interval = setInterval(function () {
                    if (frame.contentWindow.document.readyState === 'complete'
                    || frame.contentWindow.document.readyState === 'interactive') {
                        clearInterval(interval);

                        // Safari needs a timeout
                        setTimeout(function () {
                            frame.parentNode.removeChild(frame);
                        }, 1000);

                        if (i < urls.length) {
                            createIframe();
                        }
                    }
                }, 100);
            })();
        },

        isFirefox: function () {
            // sad panda :(
            return /Firefox\//i.test(navigator.userAgent);
        },

        sameDomain: function (url) {
            var a = document.createElement('a');
            a.href = url;

            return location.hostname === a.hostname && location.protocol === a.protocol;
        },

        download: function (url) {
            var a = document.createElement('a');
            a.download = '';
            a.href = url;
            // firefox doesn't support `a.click()`...
            a.dispatchEvent(new MouseEvent('click'));
        },

        startDownload: function (urls) {
            if (!urls) {
                throw new Error('`urls` required');
            }

            if (typeof document.createElement('a').download === 'undefined') {
                return this.fallback(urls);
            }

            var delay = 0;

            urls.forEach(function (url) {
                // the download init has to be sequential for firefox if the urls are not on the same domain
                if (this.isFirefox() && !this.sameDomain(url)) {
                    return setTimeout(this.download.bind(null, url), 100 * ++delay);
                }

                this.download(url);
            }, this);
        }
    }
});
