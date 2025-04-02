import axios from "axios";
import ImageResize from "quill-image-resize-module-react";
import { useMemo, useRef } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";

Quill.register("modules/ImageResize", ImageResize); // 리사이즈 추가 설정

const TextEditor = (props) => {
  const data = props.data;
  const setData = props.setData;
  const editorRef = useRef(null);
  const backServer = process.env.REACT_APP_BACK_SERVER;

  const imageHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = () => {
      const files = input.files;
      if (files.length !== 0) {
        const form = new FormData();
        form.append("image", files[0]);
        axios
          .post(`${backServer}/board/image`, form, {
            headers: {
              contentType: "multipart/form-data",
              processData: false,
            },
          })
          .then((res) => {
            console.log(res);
            const editor = editorRef.current.getEditor();
            const range = editor.getSelection();
            editor.insertEmbed(
              range.index,
              "image",
              `${backServer}/editor/${res.data}`
            );
            editor.setSelection(range.index + 1);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    };
  };

  const modules = useMemo(() => {
    return {
      toolbar: {
        container: [
          ["bold", "italic", "underline", "strike", "blockquote"],
          [{ size: ["small", false, "large", "huge"] }, { color: [] }],
          [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
            { align: [] },
          ],
          ["image"],
        ],
        handlers: {
          image: imageHandler,
        },
      },
      ImageResize: {
        parchment: Quill.import("parchment"),
        modules: ["Resize", "DisplaySize", "Toolbar"],
      },
    };
  }, []);

  return (
    <ReactQuill ref={editorRef} value={data} onChange={setData} theme="snow" />
  );
};

export default TextEditor;
