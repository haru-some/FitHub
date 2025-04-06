package kr.co.fithub.chat.model.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ChatDao {

	int createChatRoom(String memberId);

	List chatRoomList();
	
	
}
