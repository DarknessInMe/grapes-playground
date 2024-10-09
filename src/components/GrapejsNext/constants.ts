import { EditorConfig, BlockManagerConfig } from 'grapesjs';

export const BLOCK_MANAGER: BlockManagerConfig = {
   appendTo: '#blocks',
   blocks: [
      {
         id: 'section', // id is mandatory
         label: '<b>Section</b>', // You can use HTML/SVG inside labels
         attributes: { class:'gjs-block-section' },
         content: `<section>
         <h1>This is a simple title</h1>
         <div>This is just a Lorem text: Lorem ipsum dolor sit amet</div>
         </section>`,
      }, {
         id: 'text',
         label: 'Text',
         content: '<div>Insert your text here</div>',
      }, {
         id: 'image',
         label: 'Image',
         // Select the component once it's dropped
         select: true,
         // You can pass components as a JSON instead of a simple HTML string,
         // in this case we also use a defined component type `image`
         content: { type: 'image' },
         // This triggers `active` event on dropped components and the `image`
         // reacts by opening the AssetManager
         activate: true,
      },
      {
         id: 'custom-button',
         label: 'Custom',
         content: { type: 'custom-button-type' },
      },
      {
         id: 'to-do-list',
         label: 'To do',
         content: { type: 'to-do-list' },
      }
   ]
};

export const OPTIONS: EditorConfig = {
   height: '100vh',
   width: '100%',
   storageManager: false,
   blockManager: BLOCK_MANAGER,
}