import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import { logoutState, memberState } from "../utils/RecoilData";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import ImageResize from "quill-image-resize-module-react";
import axios from "axios";
import Swal from "sweetalert2";
Quill.register("modules/ImageResize", ImageResize);

const CommunityUpdate = () => {
  const params = useParams();
  const communityNo = params.communityNo;
  const [member, setMember] = useRecoilState(memberState);
  const navigate = useNavigate();
  const [text, setText] = useState("");

  useEffect(() => {
    axios
      .get(
        `${
          process.env.REACT_APP_BACK_SERVER
        }/community/${communityNo}?memberNo=${member ? member.memberNo : 0}`
      )
      .then((res) => {
        setText(res.data.communityContent);
      });
  }, []);

  const update = () => {
    const community = {
      communityNo: communityNo,
      communityContent: text,
    };
    axios
      .patch(`${process.env.REACT_APP_BACK_SERVER}/community`, community)
      .then((res) => {
        Swal.fire({
          title: "수정완료",
          icon: "success",
        }).then((res) => {
          navigate("/community/view/" + communityNo);
        });
      });
  };

  return (
    <>
      {member && (
        <div className="community-write">
          <div className="community-write-wrap">
            <div className="community-head-title">
              <p className="community-title">커뮤니티 수정</p>
              <ExitToAppIcon
                onClick={() => {
                  navigate("/community/list");
                }}
              />
            </div>
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
              <div className="write-memberId">{member?.memberId}</div>
            </div>
            <div className="community-content">
              <TextEditor data={text} setData={setText} />
            </div>
            <div className="write-btn-zone">
              <button className="write-btn" type="button" onClick={update}>
                수정
              </button>
            </div>
          </div>
        </div>
      )}
    </>
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
      onChange={(value) => {
        setData(value);
      }}
      theme="snow"
      modules={modules}
    />
  );
};
export default CommunityUpdate;
