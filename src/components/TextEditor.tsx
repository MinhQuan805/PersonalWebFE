'use client';

// EditorComponent.tsx
import { Editor } from '@tinymce/tinymce-react';

function TextEditor(props: any) {
  const { editorRef, defaultValue } = props;
  return (
      <Editor
        tinymceScriptSrc='/tinymce/tinymce.min.js'
        licenseKey='gpl'
        onInit={(_evt, editor) => editorRef.current = editor as any}
        value={defaultValue}
        init={{
          height: 700,
          menubar: false,
          plugins:
            'visualchars visualblocks table searchreplace preview pagebreak nonbreaking media lists advlist lists link insertdatetime image help fullscreen emoticons directionality code codesample charmap accordion anchor autolink autosave',
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

              input.addEventListener('change', (e: any) => {
                const file = e.target.files[0];

                const reader = new FileReader();
                reader.addEventListener('load', () => {
                  const id = 'blobid' + new Date().getTime();
                  const blobCache = (window as any).tinymce.activeEditor.editorUpload.blobCache;
                  const base64 = (reader.result as string).split(',')[1];
                  const blobInfo = blobCache.create(id, file, base64);
                  blobCache.add(blobInfo);

                  cb(blobInfo.blobUri(), { title: file.name });
                });

                reader.readAsDataURL(file);
              });

              input.click();
            }
          }
        }}
      />
  );
}

export default TextEditor; 