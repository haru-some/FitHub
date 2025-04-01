package kr.co.fithub.util;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "admin_chat_message")
public class ChatMessageEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long chatRoomNo; // 채팅방 번호

    @Column(nullable = false)
    private String userId; // 보낸 사람 ID

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content; // 메시지 내용

    @Column(nullable = false)
    private String messageType; // 메시지 타입

    @Column(nullable = false)
    private String sentAt; // 보낸 시간
}