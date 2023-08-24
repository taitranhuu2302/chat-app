import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {useAppDispatch} from "@/redux/hooks";
import {onDisabledHotkey} from "@/redux/features/HotkeySlice";

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
  const editorRef = useRef<any>(null);
  const { CKEditor, ClassicEditor } = editorRef.current || {};
  const [isFocus, setIsFocus] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (editorRef.current && Object.keys(editorRef.current).length > 0) return;
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
              dispatch(onDisabledHotkey(true))
            }}
            placeholder={'Some thing'}
            onBlur={() => {
              setIsFocus(false);
              dispatch(onDisabledHotkey(false))
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
