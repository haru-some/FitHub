package kr.co.fithub.chat.model.dao;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import kr.co.fithub.chat.model.dto.ChatDTO;

@Mapper
public interface ChatDao {
	
	void insertChatMessage(ChatDTO chatDTO);
	
    void markMessagesAsRead(@Param("chatRoomNo") String chatRoomNo);
    
    String checkUnreadMessages(@Param("chatRoomNo") String chatRoomNo);
    
    void updateMessageAlarm(@Param("chatRoomNo") String chatRoomNo, @Param("messageAlarm") String messageAlarm);
    
}
