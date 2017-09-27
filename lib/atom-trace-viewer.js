'use babel';
import AtomTraceViewerView from './atom-trace-viewer-view'
import { CompositeDisposable } from 'atom'

export default {
   subscriptions: null,

   deactivate() {
      this.html.destroy();
   },

   activate(state) {
      this.view = new AtomTraceViewerView(state.AtomTraceViewerViewState)
      this.setUpTheKeyBinds();
   },
   /*------------------------------------------------------------------------*/
   /*--------------------------| Keyboard Binds |----------------------------*/
   /*------------------------------------------------------------------------*/
   setUpTheKeyBinds(){
      this.subscriptions = new CompositeDisposable();
      this.subscriptions.add(atom.commands.add('atom-workspace', {
         'atom-trace-viewer:preview': () => this.preview(),
         'atom-trace-viewer:devtools': () => this.devtools(),
         'atom-trace-viewer:showHide': () => this.showHide()
      }))
   },

   showHide(){
      if(atom.workspace.getBottomDock().state.visible){
         atom.workspace.getBottomDock().hide()
      } else {
         atom.workspace.getBottomDock().show()
         atom.workspace.open(this.view.workspace)
      }
   },

   /*------------------------------------------------------------------------*/
   /*-----------------------| Address Bar Functions |------------------------*/
   /*------------------------------------------------------------------------*/
   setURL: function(url){
      //Fix url
      //Add http://
      // frobino TODO: check if the following if is really necessary
      if(!url.includes('://'))
         if(!url.includes('https://') && !url.includes('file://'))
            url = 'http://' + url

      this.view.html.webview.src = ''
      this.view.html.webview.src = url
   },

   preview(){
      console.log('wtf')
      //Get the selected path
      var selected = document.querySelector('.atom-dock-inner .selected .name')
      var path = selected.getAttribute('data-path')

      // frobino:
      const traceFileURL = 'file:///' + path
      // const fileURL = 'file:///' + atom.packages.getPackageDirPaths()[0] + '/tracing/index.html'
      // const traceViewerFileURL = 'file:///' + __dirname + "/tracing/index.html?tracePath=trace"
      const traceViewerFileURL = 'file:///' + __dirname + "/tracing/index.html?tracePath=" + encodeURIComponent(path)
      this.setURL(traceViewerFileURL)

      // frobino [original]:
      // const fileURL = 'file:///'+path
      // this.setURL(fileURL)

      atom.workspace.open(this.view.workspace);
   },

   devtools(){
      if(!this.view.html.webview.getWebContents()) return

      (this.view.html.webview.isDevToolsOpened())
      ? this.view.html.webview.closeDevTools()
      : this.view.html.webview.openDevTools()
   }
}
