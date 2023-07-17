import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

interface IProps {
  onChange?: (data: string) => void;
  editorLoaded?: boolean;
  name?: string;
  value?: string;
  showTopEditor?: boolean;
  handleSubmit?: () => void;
}

const Editor: React.FC<IProps> = ({
  onChange,
  editorLoaded,
  name,
  value,
  showTopEditor,
  handleSubmit,
}) => {
  const editorRef = useRef<any>();
  const { CKEditor, ClassicEditor } = editorRef.current || {};
  const [isFocus, setIsFocus] = useState(false);

  useEffect(() => {
    editorRef.current = {
      CKEditor: require('@ckeditor/ckeditor5-react').CKEditor,
      ClassicEditor: require('@ckeditor/ckeditor5-build-classic'),
    };

    return () => {
      editorRef.current = {};
    };
  }, []);

  const handleEnter = (event: KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit && handleSubmit();
    }
  };

  useEffect(() => {
    if (isFocus) {
      document.addEventListener('keydown', handleEnter);
    } else {
      document.removeEventListener('keydown', handleEnter);
    }

    return () => {
      document.removeEventListener('keydown', handleEnter);
    };
  });

  return (
    <>
      <div
        className={`ck-custom un-reset ${
          showTopEditor ? 'editor__top--active' : ''
        }`}>
        {editorLoaded && CKEditor && ClassicEditor ? (
          <CKEditor
            name={name}
            editor={ClassicEditor}
            onFocus={() => {
              setIsFocus(true);
            }}
            placeholder={'Some thing'}
            onBlur={() => {
              setIsFocus(false);
            }}
            data={value}
            onChange={(event: ChangeEvent<unknown>, editor: any) => {
              const data = editor.getData();
              onChange && onChange(data);
            }}
          />
        ) : (
          <div>Editor loading</div>
        )}
      </div>
    </>
  );
};

export default Editor;
