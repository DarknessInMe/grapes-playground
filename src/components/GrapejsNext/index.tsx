"use client";

import { FC, useRef, memo, useMemo, useEffect } from 'react';
import grapesjs, { Editor } from 'grapesjs';
import GjsEditor, { Canvas } from '@grapesjs/react';
import classes from './grape.module.css';
import { OPTIONS } from './constants';
import { InMemoryStorage } from '@/db/ImMemoryStorage';

const storage = new InMemoryStorage();

const inMemoryStoragePlugin = (editor: Editor) => {
   // As sessionStorage is not an asynchronous API,
   // the `async` keyword could be skipped
   editor.Storage.add('in-memory', {
     async load(options = {}) {
         console.log('load');
         return JSON.parse(storage.load() ?? '{}');
     },
 
     async store(data, options = {}) {
         console.log('store.data', data)
         storage.save(JSON.stringify(data));
     },
   });
 };

export const GrapesjsNext: FC = memo(() => {
   const editorRef = useRef<Editor | null>(null);

   const onLogDataAsObject = () => {
      if (!editorRef.current) {
         return;
      }

      console.log('getProjectData', editorRef.current.getProjectData())
   }

   const onLogDataAsHTML = () => {
      if (!editorRef.current) {
         return;
      }

      const pagesHtml = editorRef.current.Pages.getAll().map(page => {
         const component = page.getMainComponent();
         return {
           html: editorRef.current!.getHtml({ component }),
           css: editorRef.current!.getCss({ component })
         }
       });

      console.log('pagesHtml', pagesHtml)
   }

   const onLodSavedData = () => {
      console.log(JSON.parse(storage.load() ?? '{}'))
   }

   const onEditor = (editor: Editor) => {
      editorRef.current = editor;
      editor.Components.addType('custom-button-type', {
         // how it renders in total html
         model: {
            defaults: {
               script: function() {
                  console.log('model.script')
               },
               tagName: 'button',
               components: 'Custom Button',
               attributes: {
                  'data-custom-btn': true
               },
            }
         },
         // how it looks in canvas
         view: {
            tagName: () => 'div',
            events() {
               return {
                  click: 'clickOnElement',
               }
            },
            clickOnElement: function(event: PointerEvent) {
               console.log('event', event);
               console.log('events.click')
            }
         }
      });
      editor.Components.addType('to-do-list', {
         model: {
            defaults: {
               tagName: 'div',
               attributes: {
                  'data-todo': true
               },
               components: `
                  <div class="container">
                     <input type="checkbox" />
                     <p>Type</p>
                  </div>
               `,
               styles: `
                  .container { display: flex }
               `,
            }
         }
      })
   };

   return (
      <div className={classes.container}>
         <GjsEditor
            grapesjs={grapesjs}
            options={{
               ...OPTIONS,
               plugins: [inMemoryStoragePlugin],
               storageManager: {
                  type: 'in-memory',
                  options: {
                     'in-memory': {
                        onStore: (data: any, editor: Editor) => {
                           const pagesHtml = editor.Pages.getAll().map(page => {
                             const component = page.getMainComponent();
                             return {
                               html: editor.getHtml({ component }),
                               css: editor.getCss({ component })
                             }
                           });
                           console.log('onStore.data', data)
                           return { data, pagesHtml };
                        },
                        onLoad: (result: any) => {
                           console.log('onLoad', result)
                           return result.data;
                        }
                     }
                  }
               }
            }}
            onEditor={onEditor}
         >
            <div className={classes.content}>
               <div className={classes.tools}>
                  <button onClick={onLogDataAsObject}>Log data as obj</button>
                  <button onClick={onLogDataAsHTML}>Log data as html</button>
                  <button onClick={onLodSavedData}>Log saved data</button>
               </div>
               <Canvas className={classes.canvas}/>
            </div>
         </GjsEditor>
         <div id="blocks" className={classes.blocks}/>
      </div>
   )
});