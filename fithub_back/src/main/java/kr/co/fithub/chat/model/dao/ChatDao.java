package kr.co.fithub.chat.model.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.co.fithub.chat.model.dto.ChatMessageDTO;
import kr.co.fithub.chat.model.dto.ChatRoomDTO;

@Mapper
public interface ChatDao {

	int createChatRoom(String memberId);

	List chatRoomList();

	List loadChatMessage(int chatRoomNo);

	List loadChatMember(String memberId);

	ChatRoomDTO selectChatRoom(String memberId);

	int viewOk(int chatRoomNo, String chatMemberId);

	int inputChatMessage(ChatMessageDTO message);

	int alarmChatRoom(ChatMessageDTO message);

	ChatRoomDTO selectChatRoom(int roomNo);

	
}
