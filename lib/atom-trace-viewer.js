'use babel';
import AtomTraceViewerView from './atom-trace-viewer-view'
import { CompositeDisposable } from 'atom'

export default {
   subscriptions: null,

   deactivate() {
      this.html.destroy();
      this.subscriptions.dispose();
   },

   activate(state) {
      this.view = new AtomTraceViewerView(state.AtomTraceViewerViewState)
      this.setUpTheKeyBinds()
      this.listen()
   },
   /*------------------------------------------------------------------------*/
   /*--------------------------| Keyboard Binds |----------------------------*/
   /*------------------------------------------------------------------------*/
   setUpTheKeyBinds(){
      this.subscriptions = new CompositeDisposable();
      this.subscriptions.add(atom.commands.add('atom-workspace', {
         'atom-trace-viewer:preview': () => this.preview(),
         'atom-trace-viewer:devtools': () => this.devtools(),
         'atom-trace-viewer:showHide': () => this.showHide(),
         'atom-trace-viewer:search': () => this.search()
      }))
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
   },

   showHide(){
      if(atom.workspace.getBottomDock().state.visible){
         atom.workspace.getBottomDock().hide()
      } else {
         atom.workspace.getBottomDock().show()
         atom.workspace.open(this.view.workspace)
      }
   },

   // frobino: select addressbar when select is called
   search(){
      var workspace = atom.workspace.open(this.view.workspace).then(() => {
         this.view.html.addressbar.select()
      })
   },

   /*------------------------------------------------------------------------*/
   /*--------------------------| Event Listeners |---------------------------*/
   /*------------------------------------------------------------------------*/
   listen: function(){
      //URL Bar
      var lastCall = Date.now()
      this.view.html.addressbar.addEventListener('paste', (e) => {
         if(Date.now() - lastCall < 100)
            e.preventDefault()
         lastCall = Date.now()
      })
      // frobino: call setURL when Enter is pressed ín the addressbar
      this.view.html.addressbar.addEventListener('keyup', (e) => {
         if(e.key == 'Enter')
            this.setURL(this.view.html.addressbar.value)
      })
   },
   /*------------------------------------------------------------------------*/
   /*-----------------------| Address Bar Functions |------------------------*/
   /*------------------------------------------------------------------------*/
   setURL: function(url){
      // frobino: make sure that each time setURL is called, the url
      // contains the path to catapult traceviewer's index.
      // If not, add it.automatically
      const catapultIndexPath = 'file:///' + __dirname + "/tracing/index.html?tracePath="
      if(!url.includes(catapultIndexPath))
         url = catapultIndexPath + encodeURIComponent(url)

      this.view.html.webview.src = ''
      this.view.html.webview.src = url
      this.view.html.addressbar.value = url;
   }
}
