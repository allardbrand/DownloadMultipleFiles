/*global define, logger, mx, mxui*/
/*jslint nomen:true*/

define([
    "dojo/_base/declare",
    "mxui/widget/_WidgetBase",

    "dojo/dom-style",
    "dojo/_base/array",
    "dojo/_base/lang",
    "DownloadMultipleFiles/lib/multi-download"

], function (declare, _WidgetBase, dojoStyle, dojoArray, lang, downloadMultiple) {
    "use strict";

    return declare("DownloadMultipleFiles.widget.DownloadMultipleFiles", [ _WidgetBase ], {

        // Internal variables.
        _contextObj: null,

        constructor: function () {
            this._handles = [];
        },

        postCreate: function () {
            logger.debug(this.id + ".postCreate");

            var downloadButton = new mxui.widget._Button({
                caption: (this.buttonCaption || "Download"),
                onClick: lang.hitch(this, this._downloadFiles)
            });

            this.domNode.appendChild(downloadButton.domNode);
        },

        _downloadFiles: function () {
            if (this._contextObj) {
                if (this.sourceType === 'microflow') {
                    logger.debug(this.id + "._downloadFiles - method: Microflow");

                    // Retrieve files by microflow
                    this._execMf(this.sourceMicroflow, this._contextObj.getGuid(), lang.hitch(this, this._startDownload));
                } else {
                    logger.debug(this.id + "._downloadFiles - method: XPath");

                    // Retrieve files by XPath
                    mx.data.get({
                        xpath: "//" + this.returnEntity + this.returnEntityConstraint.replace(/\[\%CurrentObject\%\]/gi, this._contextObj.getGuid()),
                        callback: lang.hitch(this, this._startDownload)
                    });
                }
            }
        },

        _startDownload: function (objs) {
            logger.debug(this.id + "._startDownload - received " + objs.length + " MxObjects");

            var urls = [],
                _widgetId = this.id;

            dojoArray.forEach(objs, function (obj) {
                logger.debug(_widgetId + "._startDownload - object GUID: " + obj.getGuid());

                if (obj.get("HasContents")) {
                    var url = "/file?guid=" + obj.getGuid() + "&target=internal";
                    urls.push(url);
                } else {
                    logger.debug(_widgetId + "._startDownload - no content for file with GUID " + obj.getGUID());
                }
            });

            downloadMultiple.startDownload(urls);
        },

        update: function (obj, callback) {
            logger.debug(this.id + ".update");

            this._contextObj = obj;

            // If enabled, automatically start downloading files on update
            if (this.autoDownload) {
                logger.debug(this.id + ".update - auto download enabled, starting download");
                this._downloadFiles();
            }

            this._updateRendering(callback);
        },

        uninitialize: function () {
            logger.debug(this.id + ".uninitialize");
        },

        _updateRendering: function (callback) {
            logger.debug(this.id + "._updateRendering");

            if (this._contextObj !== null) {
                dojoStyle.set(this.domNode, "display", "block");
            } else {
                dojoStyle.set(this.domNode, "display", "none");
            }

            this._executeCallback(callback, "_updateRendering");
        },

        // Shorthand for running a microflow
        _execMf: function (mf, guid, cb) {
            logger.debug(this.id + "._execMf");
            if (mf && guid) {
                mx.ui.action(mf, {
                    params: {
                        applyto: "selection",
                        guids: [guid]
                    },
                    callback: lang.hitch(this, function (objs) {
                        if (cb && typeof cb === "function") {
                            cb(objs);
                        }
                    }),
                    error: function (error) {
                        console.debug(error.description);
                    }
                }, this);
            }
        },

        // Shorthand for executing a callback, adds logging to your inspector
        _executeCallback: function (cb, from) {
            logger.debug(this.id + "._executeCallback" + (from ? " from " + from : ""));
            if (cb && typeof cb === "function") {
                cb();
            }
        }
    });
});

require(["DownloadMultipleFiles/widget/DownloadMultipleFiles"]);
