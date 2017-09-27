'use babel';

const fs = require('fs')
const pathPackage = atom.packages.resolvePackagePath('atom-trace-viewer')

const viewSettings = [
   {
      name: 'atom-trace-viewer.viewShowBackground',
      element: 'webview',
      class: 'showBackground'
   }
]

export default class AtomGoogleView {

   /*------------------------------------------------------------------------*/
   /*---------------------------| CONSTRUCTOR |------------------------------*/
   /*------------------------------------------------------------------------*/
   constructor(serializedState) {
      //Get the html templates
      this.elements = {
         webview : this.loadTemplate('webview')[0]
      }

      // Load settings
      this.loadAndWatchViewSettings()

      //Create the view
      this.view = document.createElement('div')
      this.view.setAttribute('id', 'atomtraceviewer-view')

      //Append the html and make a workspace
      this.view.appendChild(this.elements.webview)

      //view.innerHTML += tabs
      this.workspace = {
         element: this.view,
         getTitle: () => 'Atom Trace Viewer',
         getURI: () => 'atom://atom-web/webview',
         getDefaultLocation: () => 'bottom'
      }

      //Select this html for later
      this.setHTML()
   }

   /*------------------------------------------------------------------------*/
   /*-----------------| CONSTRUCTOR HELPERS / METHODS|-----------------------*/
   /*------------------------------------------------------------------------*/
   setHTML(){
      this.html = {
         webview: this.view.querySelector('#atomtraceviewer-webview')
      }
   }
   loadAndWatchViewSettings(){
      // Loop the settings and toggle on or off
      for(var setting of viewSettings){
            if(!setting.listening) this.watchSetting(setting)

            var value = atom.config.get(setting.name)
            var element = this.elements[setting.element]
            element.classList.toggle(setting.class, value)
      }
   }

   watchSetting(setting){
      atom.config.onDidChange(setting.name, () => { this.loadAndWatchViewSettings() })
      setting.listening = true
   }

   loadTemplate(name){
      var path = pathPackage + `/templates/${name}.json`
      var template = JSON.parse(fs.readFileSync(path, "utf8"))
      return this.parseTemplate(template)
   }

   parseTemplate(template){
      var newElements = []
      for(var ele of template){
         var newElement = document.createElement(ele.type)

         // Set the attributes
         if(!ele.attributes) ele.attributes = {}
         for(var attributeName of Object.keys(ele.attributes)){
            var value = ele.attributes[attributeName]
            newElement.setAttribute(attributeName, value)
         }

         // Set the innerHTML
         if(ele.innerHTML === undefined) ele.innerHTML = ''
         if(typeof ele.innerHTML === 'string'){
            newElement.innerHTML = ele.innerHTML
         } else {
            var innerHTMLElements = this.parseTemplate(ele.innerHTML)
            for(var innerEle of innerHTMLElements)
               newElement.appendChild(innerEle)
         }

         newElements.push(newElement)
      }
      return newElements
   }
}
