import { useEffect, useRef, useState } from "react";
import { Box, TextField } from "@mui/material";
import Swal from "sweetalert2";
import { useRecoilState } from "recoil";
import { memberState } from "../utils/RecoilData";
import axios from "axios";
import "./member.css";
import { useNavigate } from "react-router-dom";

const MemberInfo = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const navigate = useNavigate();
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
          const splitAddr = res.data.memberAddr.split(",").map((s) => s.trim());
          const addr = splitAddr[0] || "";
          const detail = splitAddr[1] || "";

          setMember({
            ...res.data,
            memberAddr: addr,
            memberAddrDetail: detail,
            memberProfile: res.data.memberProfile || "",
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
    const name = e.target.name;
    const value = e.target.value;
    let newValue = value;
    if (name === "memberAddrDetail") {
      newValue = newValue.replace(/,/g, "");
    }
    if (name === "memberPhone") {
      newValue = formatPhoneNumber(value);
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
    if (!file) return;
    e.target.value = "";

    if (file) {
      const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif|\.svg)$/i;
      if (!allowedExtensions.exec(file.name)) {
        Swal.fire({
          title: "파일 형식 오류",
          text: "jpg, jpeg, png, gif, svg 형식의 이미지 파일만 등록할 수 있습니다.",
          icon: "warning",
          confirmButtonColor: "#2f3e2f",
        });
        e.target.value = "";
        return;
      }

      if (member.memberThumb) {
        axios
          .delete(`${backServer}/member/profileimg`, {
            params: { memberId: member.memberId },
          })
          .then(() => {
            setMember((prev) => ({ ...prev, memberThumb: null }));
          })
          .catch(() => {
            Swal.fire({
              title: "이미지 삭제 실패",
              text: "기존 이미지 삭제 중 문제가 발생했습니다.",
              icon: "error",
              confirmButtonColor: "#2f3e2f",
            });
          });
      }

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
    if (!member.memberThumb && !previewUrl) {
      Swal.fire({
        title: "프로필 이미지 없음",
        text: "현재 프로필 이미지가 없습니다.",
        icon: "info",
        confirmButtonColor: "#2f3e2f",
      });
      return;
    }
    setMember((prev) => ({ ...prev, memberThumb: null }));
    setThumbnailFile(null);
    setPreviewUrl(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpdate = () => {
    const fullAddr =
      member.memberAddr +
      (member.memberAddrDetail ? `, ${member.memberAddrDetail}` : "");

    if (!member.memberName.trim()) {
      Swal.fire({
        title: "이름 입력 오류",
        text: "이름을 입력해주세요.",
        icon: "warning",
        confirmButtonColor: "#2f3e2f",
      });
      return;
    }
    if (!member.memberAddr.trim()) {
      Swal.fire({
        title: "주소 입력 오류",
        text: "주소를 입력해주세요.",
        icon: "warning",
        confirmButtonColor: "#2f3e2f",
      });
      return;
    }
    if (member.memberProfile && member.memberProfile.length > 100) {
      Swal.fire({
        title: "자기소개 입력 오류",
        text: "자기소개는 최대 100자까지 입력 가능합니다.",
        icon: "warning",
        confirmButtonColor: "#2f3e2f",
      });
      return;
    }
    const onlyNums = member.memberPhone.replace(/\D/g, "");
    if (onlyNums.length < 10 || onlyNums.length > 11) {
      Swal.fire({
        title: "전화번호 입력 오류",
        text: "전화번호는 10~11자리로 입력해주세요.",
        icon: "warning",
        confirmButtonColor: "#2f3e2f",
      });
      return;
    }

    const formData = new FormData();

    formData.append("memberId", member.memberId);
    formData.append("memberName", member.memberName);
    formData.append("memberPhone", member.memberPhone);
    formData.append("memberProfile", member.memberProfile || "");
    formData.append("memberAddr", fullAddr);

    if (thumbnailFile) {
      formData.append("thumbnail", thumbnailFile);
    } else if (!thumbnailFile && !member.memberThumb) {
      formData.append("memberThumb", "null");
    }

    axios
      .patch(`${backServer}/member`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        setLoginMember({
          ...loginMember,
          ...member,
          memberAddr: fullAddr,
          memberAddrDetail: member.memberAddrDetail,
          memberThumb: res.data.memberThumb ?? loginMember.memberThumb ?? null,
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
        axios
          .delete(`${backServer}/member/${member.memberId}`)
          .then(() => {
            Swal.fire({
              title: "탈퇴 완료",
              text: "회원 탈퇴가 완료되었습니다.",
              icon: "success",
              confirmButtonColor: "#2f3e2f",
              confirmButtonText: "확인",
            }).then(() => {
              setLoginMember(null);
              localStorage.removeItem("recoil-persist");
              setTimeout(() => {
                navigate("/");
              }, 100);
            });
          })
          .catch(() => {
            Swal.fire({
              title: "탈퇴 실패",
              text: "회원 탈퇴 중 오류가 발생했습니다.",
              icon: "error",
              confirmButtonColor: "#2f3e2f",
            });
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
              ? `${backServer}/member/profileimg/${encodeURIComponent(
                  member.memberThumb
                )}`
              : "/image/profile.png")
          }
          alt="프로필"
          className="info-profile-img"
        />
        <input
          type="file"
          accept=".jpg,.jpeg,.png,.gif,.svg"
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
            label="전화번호"
            name="memberPhone"
            value={member.memberPhone}
            onChange={handleInput}
            fullWidth
            inputProps={{
              maxLength: 13,
              inputMode: "numeric",
              pattern: "[0-9]*",
            }}
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
              style={{ height: 50, width: 140, borderRadius: 6 }}
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
