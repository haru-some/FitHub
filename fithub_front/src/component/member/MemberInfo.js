import { useEffect, useRef, useState } from "react";
import { Box, TextField } from "@mui/material";
import Swal from "sweetalert2";
import { useRecoilState } from "recoil";
import { memberState } from "../utils/RecoilData";
import axios from "axios";
import "./member.css";

const MemberInfo = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [loginMember, setLoginMember] = useRecoilState(memberState);
  const [member, setMember] = useState({
    memberId: "",
    memberName: "",
    memberPhone: "",
    memberProfile: "",
    memberLevel: "",
    memberAddr: "",
    memberAddrDetail: "",
    memberThumb: "",
  });

  const [thumbnailFile, setThumbnailFile] = useState(null);
  const fileInputRef = useRef();
  const detailRef = useRef();
  const formatPhoneNumber = (value) => {
    const onlyNums = value.replace(/\D/g, "");

    if (onlyNums.length < 4) return onlyNums;
    if (onlyNums.length < 7)
      return onlyNums.replace(/(\d{3})(\d{1,3})/, "$1-$2");
    if (onlyNums.length <= 11)
      return onlyNums.replace(/(\d{3})(\d{3,4})(\d{4})/, "$1-$2-$3");

    return onlyNums;
  };

  useEffect(() => {
    if (loginMember) {
      axios
        .get(`${backServer}/member/${loginMember.memberId}`, {
          headers: {
            Authorization: loginMember.accessToken,
          },
        })
        .then((res) => {
          const [addr, detail = ""] = res.data.memberAddr
            .split(",")
            .map((s) => s.trim());
          setMember({
            ...res.data,
            memberAddr: addr,
            memberAddrDetail: detail,
          });
        })
        .catch(() => {
          Swal.fire({
            title: "불러오기 실패",
            text: "회원 정보를 불러오지 못했습니다.",
            icon: "error",
            confirmButtonColor: "#2f3e2f",
          });
        });
    }
  }, [loginMember]);

  const handleInput = (e) => {
    const { name, value } = e.target;
    let newValue = value;
    if (name === "memberPhone") {
      newValue = formatPhoneNumber(value);
    }
    if (name === "memberAddrDetail") {
      newValue = newValue.replace(/,/g, "");
    }
    setMember((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleAddressSearch = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        const fullAddress = data.address;
        setMember((prev) => ({ ...prev, memberAddr: fullAddress }));
        setTimeout(() => {
          detailRef.current?.focus();
        }, 200);
      },
    }).open();
  };
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleImageDelete = () => {
    axios
      .delete(`${backServer}/member/image`, {
        data: { memberId: member.memberId },
      })
      .then(() => {
        setMember((prev) => ({ ...prev, memberThumb: null }));
        setPreviewUrl(null);
        Swal.fire({
          title: "삭제 완료",
          text: "프로필 이미지가 삭제되었습니다.",
          icon: "success",
          confirmButtonColor: "#2f3e2f",
        });
      })
      .catch(() => {
        Swal.fire({
          title: "삭제 실패",
          text: "이미지 삭제 중 문제가 발생했습니다.",
          icon: "error",
          confirmButtonColor: "#2f3e2f",
        });
      });
  };

  const handleUpdate = () => {
    const formData = new FormData();
    const fullAddr = `${member.memberAddr}, ${member.memberAddrDetail}`;

    formData.append("memberId", member.memberId);
    formData.append("memberName", member.memberName);
    formData.append("memberPhone", member.memberPhone);
    formData.append("memberProfile", member.memberProfile);
    formData.append("memberAddr", fullAddr);

    if (thumbnailFile) {
      formData.append("thumbnail", thumbnailFile);
    }

    axios
      .put(`${backServer}/member`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          processData: false,
        },
      })
      .then(() => {
        setLoginMember({
          ...loginMember,
          ...member,
          memberAddr: fullAddr,
          accessToken: loginMember.accessToken,
        });
        Swal.fire({
          title: "정보 수정 완료",
          text: "회원 정보가 수정되었습니다.",
          icon: "success",
          confirmButtonColor: "#2f3e2f",
        });
      })
      .catch(() => {
        Swal.fire({
          title: "오류 발생",
          text: "정보 수정 중 문제가 발생했습니다.",
          icon: "error",
          confirmButtonColor: "#2f3e2f",
        });
      });
  };

  const handleDelete = () => {
    Swal.fire({
      title: "정말 탈퇴하시겠습니까?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "확인",
      cancelButtonText: "취소",
      confirmButtonColor: "#2f3e2f",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "탈퇴 완료",
          text: "회원 탈퇴가 완료되었습니다.",
          icon: "success",
          confirmButtonColor: "#2f3e2f",
        });
      }
    });
  };

  return (
    <section className="info-wrap">
      <h2 className="info-title">내 정보</h2>
      <div className="info-image-box">
        <img
          src={
            previewUrl ||
            (member.memberThumb
              ? `${backServer}/member/profileImage/${member.memberThumb}`
              : "/image/profile.png")
          }
          alt="프로필"
          className="info-profile-img"
        />
        <input
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          ref={fileInputRef}
          onChange={handleImageChange}
        />
        <div className="info-button-box">
          <button
            className="info-img-btn info-btn-select"
            onClick={() => fileInputRef.current?.click()}
          >
            이미지 등록
          </button>
          <button
            className="info-img-btn info-btn-delete"
            onClick={handleImageDelete}
          >
            이미지 삭제
          </button>
        </div>
      </div>

      <Box className="info-form">
        <div className="info-form-field">
          <TextField
            label="아이디"
            value={member.memberId}
            disabled
            fullWidth
          />
        </div>
        <div className="info-form-field">
          <TextField
            label="이름"
            name="memberName"
            value={member.memberName}
            onChange={handleInput}
            fullWidth
          />
        </div>
        <div className="info-form-field">
          <TextField
            label="휴대폰"
            name="memberPhone"
            value={member.memberPhone}
            onChange={handleInput}
            fullWidth
          />
        </div>
        <div className="info-form-field">
          <Box className="info-input-wrap">
            <TextField
              label="주소"
              name="memberAddr"
              value={member.memberAddr}
              onChange={handleInput}
              sx={{ flex: 1 }}
            />
            <button
              type="button"
              onClick={handleAddressSearch}
              className="btn-primary sm"
              style={{ height: 56 }}
            >
              주소 검색
            </button>
          </Box>
        </div>
        <div className="info-form-field">
          <TextField
            label="상세주소"
            name="memberAddrDetail"
            inputRef={detailRef}
            value={member.memberAddrDetail}
            onChange={handleInput}
            fullWidth
          />
        </div>
        <div className="info-form-field">
          <TextField
            label="회원등급"
            value={member.memberLevel === "1" ? "관리자" : "일반회원"}
            disabled
            fullWidth
          />
        </div>
        <div className="info-form-field">
          <TextField
            label="프로필(자기소개)"
            name="memberProfile"
            value={member.memberProfile || ""}
            onChange={handleInput}
            fullWidth
            multiline
            rows={3}
          />
        </div>
        <div className="info-action-box">
          <button
            className="info-action-btn info-update-btn"
            onClick={handleUpdate}
          >
            정보수정
          </button>
          <button
            className="info-action-btn info-delete-btn"
            onClick={handleDelete}
          >
            회원탈퇴
          </button>
        </div>
      </Box>
    </section>
  );
};

export default MemberInfo;
