package kr.co.fithub.chat.model.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.co.fithub.chat.model.dto.ChatDTO;
import kr.co.fithub.util.ChatMessageEntity;
import kr.co.fithub.util.ChatMessageRepository;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class ChatService {

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    public void saveMessage(ChatDTO message) {
        ChatMessageEntity entity = new ChatMessageEntity();
        entity.setChatRoomNo(message.getChatRoomNo());
        entity.setUserId(message.getMemberId());
        entity.setContent(message.getMessageContent());
        entity.setMessageType(message.getMessageType());
        entity.setSentAt(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        chatMessageRepository.save(entity);
    }

    public List<ChatMessageEntity> getMessages(Long chatRoomNo) {
        return chatMessageRepository.findByChatRoomNoOrderBySentAt(chatRoomNo);
    }
}