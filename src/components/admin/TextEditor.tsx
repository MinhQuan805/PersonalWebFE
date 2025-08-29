import { Editor } from '@tinymce/tinymce-react';
import { useRef } from 'react';

interface TextEditorProps {
  value: string;
  onContentChange: (content: string) => void;
  editorRef: React.MutableRefObject<any>;
}

function TextEditor({ value, onContentChange, editorRef }: TextEditorProps) {
  return (
    <Editor
      tinymceScriptSrc="/tinymce/tinymce.min.js"
      licenseKey="gpl"
      onInit={(_evt, editor) => (editorRef.current = editor)}
      value={value}
      onEditorChange={(newContent) => onContentChange(newContent)}
      init={{
        height: 700,
        menubar: false,
        plugins:
          'visualchars visualblocks table searchreplace preview pagebreak nonbreaking media lists advlist link insertdatetime image help fullscreen emoticons directionality code codesample charmap accordion anchor autolink autosave',
        toolbar: `
          undo redo | formatselect fontselect fontsizeselect | bold italic underline strikethrough forecolor backcolor |
          align | outdent indent |
          code codesample |
          numlist bullist | link image media insertdatetime emoticons charmap |
          table | visualchars visualblocks |
          searchreplace preview pagebreak nonbreaking |
          accordion anchor restoredraft |
          ltr rtl | fullscreen help
        `,
        file_picker_types: 'image',
        file_picker_callback: (cb, _value, meta) => {
          if (meta.filetype === 'image') {
            const input = document.createElement('input');
            input.setAttribute('type', 'file');
            input.setAttribute('accept', 'image/*');

            input.addEventListener('change', (e: Event) => {
              const target = e.target as HTMLInputElement;
              const file = target.files?.[0];
              if (!file) return;

              const reader = new FileReader();
              reader.addEventListener('load', () => {
                const id = 'blobid' + new Date().getTime();
                const blobCache = (window as any).tinymce.activeEditor.editorUpload.blobCache;
                const base64 = (reader.result as string).split(',')[1];
                const blobInfo = blobCache.create(id, file, base64);
                blobCache.add(blobInfo);

                // Áp dụng lớp responsive-img cho ảnh
                cb(blobInfo.blobUri(), { title: file.name, class: 'responsive-img' });
              });

              reader.readAsDataURL(file);
            });

            input.click();
          }
        },
        content_style: `
          img.responsive-img {
            max-width: 100%;
            height: auto;
            display: block;
            margin: 0 auto;
          }
        `,
        image_class_list: [
          { title: 'Responsive Image', value: 'responsive-img' },
        ],
      }}
    />
  );
}

export default TextEditor;