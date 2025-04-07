import { useRecoilState } from "recoil";
import { memberState } from "../utils/RecoilData";
import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import ImageResize from "quill-image-resize-module-react";
Quill.register("modules/ImageResize", ImageResize);

const CommunityWrite = () => {
  const [member, setMember] = useRecoilState(memberState);
  const memberNo = member.memberNo;
  const [communityContent, setCommunityContent] = useState("");

  const navigate = useNavigate();

  function isBlank(str) {
    return !str || /^\s*$/.test(str);
  }

  const write = (e) => {
    if (
      !isBlank(
        communityContent
          .replace("<p>", "")
          .replace("</p>", "")
          .replace("<br>", "")
      )
    ) {
      const form = new FormData();
      form.append("communityContent", communityContent);
      form.append("memberNo", memberNo);

      axios
        .post(`${process.env.REACT_APP_BACK_SERVER}/community`, form, {
          headers: {
            contentType: "multipart/form-data",
            processData: false,
          },
        })
        .then((res) => {
          console.log(res);
          navigate("/community/list");
        });
    }
  };
  return (
    <div className="community-write">
      <div className="community-write-wrap">
        <h2 className="community-title">커뮤니티 작성</h2>
        <div className="community-write-info">
          <div className="member-img">
            <img
              src={
                member && member.memberThumb
                  ? `${process.env.REACT_APP_BACK_SERVER}/member/profileimg/${member.memberThumb}`
                  : "/image/default_img.png"
              }
            />
          </div>
          <div className="write-memberId">{member.memberId}</div>
        </div>
        <div className="community-content">
          <TextEditor data={communityContent} setData={setCommunityContent} />
        </div>
        <div className="write-btn-zone">
          <button className="write-btn" type="button" onClick={write}>
            작성
          </button>
        </div>
      </div>
    </div>
  );
};

const TextEditor = (props) => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const data = props.data;
  const setData = props.setData;
  const editorRef = useRef(null);
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
          .post(`${backServer}/community/image`, form, {
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
          });
      }
    };
  };

  const modules = useMemo(() => {
    return {
      toolbar: {
        container: [
          ["bold", "italic", "underline", "strike", "blockquote"],
          [{ size: ["smaill", false, "large", "huge"] }, { color: [] }],
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
    <ReactQuill
      ref={editorRef}
      value={data}
      onChange={setData}
      theme="snow"
      modules={modules}
    />
  );
};

export default CommunityWrite;
