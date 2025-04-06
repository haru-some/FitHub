package kr.co.fithub.chat.model.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.co.fithub.chat.model.dao.ChatDao;

@Service
public class ChatService {
	@Autowired
	private ChatDao chatDao;
	
	public int createChatRoom(String memberId) {
		int result = chatDao.createChatRoom(memberId);
		return result;
	}

	public List chatRoomList() {
		List list = chatDao.chatRoomList();
		return list;
	}
    

}
