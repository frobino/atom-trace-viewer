# Architecture

Atom-trace-viewer enables the usage of Google's Chrome Trace-Viewer inside of the Atom editor.
Trace-Viewer can be executed in a browser.
The Atom-trace-viewer package just creates a browser "wrapper" around the Trace-Viewer code.
The browser "wrapper" is inspired from [atom-browser](https://github.com/sean-codes/atom-browser).

## Atom browser

The atom-browser package source code has been used to write atom-trace-viewer.js, e atom-trace-viewer-view.js,
so that the browser is redirected to the Trace-viewer standalone index.html file.
Parameters are also provided to the web address to give the json trace as input to the Trace-viewer app.

## Trace-Viewer

Trace-Viewer is the javascript frontend for Chrome about:tracing and Android systrace.
The Trace-Viewer source code is available in [project catapult](https://github.com/catapult-project/catapult).
Trace-Viewer is provided as standalone index.html page, and is is copies *as is* in the lib/ folder.
