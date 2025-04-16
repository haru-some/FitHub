package kr.co.fithub.dm.model.dto;

import org.apache.ibatis.type.Alias;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value = "dmRoom")
@Schema(description = "1:1 DM 방 정보 DTO")
public class DmRoom {

    @Schema(description = "DM 방 번호", example = "3001")
    private int dmRoomNo;

    @Schema(description = "회원 1 번호", example = "101")
    private String member1No;

    @Schema(description = "회원 2 번호", example = "102")
    private String member2No;

    @Schema(description = "DM 방 생성일 (yyyy-MM-dd HH:mm:ss)", example = "2025-04-01 10:00:00")
    private String createdAt;

    @Schema(description = "마지막 메시지 시간 (yyyy-MM-dd HH:mm:ss)", example = "2025-04-10 21:45:00")
    private String lastMessageAt;

    @Schema(description = "상대방 회원 번호", example = "102")
    private int otherMemberNo;

    @Schema(description = "상대방 회원 ID", example = "fituser22")
    private String otherMemberId;

    @Schema(description = "상대방 이름", example = "이운동")
    private String otherMemberName;

    @Schema(description = "상대방 프로필 이미지 파일명", example = "profile2.png")
    private String otherMemberThumb;

    @Schema(description = "마지막 메시지 내용", example = "내일 같이 운동하자")
    private String lastMessageContent;
    
    private String otherMemberDelStatus;

    @Schema(description = "마지막 메시지 보낸 시간 (yyyy-MM-dd HH:mm:ss)", example = "2025-04-10 21:45:00")
    private String lastMessageSentAt;

    @Schema(description = "읽지 않은 메시지 수", example = "2")
    private int unreadCount;
}
