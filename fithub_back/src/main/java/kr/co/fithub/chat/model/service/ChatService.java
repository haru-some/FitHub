package kr.co.fithub.chat.model.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.fithub.chat.model.dao.ChatDao;
import kr.co.fithub.chat.model.dto.ChatMessageDTO;
import kr.co.fithub.chat.model.dto.ChatRoomDTO;

@Service
public class ChatService {
	@Autowired
	private ChatDao chatDao;
	
	@Transactional
	public int createChatRoom(String memberId) {
		int result = chatDao.createChatRoom(memberId);
		return result;
	}

	public List chatRoomList() {
		List list = chatDao.chatRoomList();
		return list;
	}

	public List loadChatMessage(int chatRoomNo) {
		List list = chatDao.loadChatMessage(chatRoomNo);
		return list;
	}

	public List loadChatMember(String memberId) {
		List list = chatDao.loadChatMember(memberId);
		return list;
	}

	public ChatRoomDTO getRoomId(String memberId) {
		ChatRoomDTO cr = chatDao.selectChatRoom(memberId);
		return cr;
	}
	
	@Transactional
	public int viewOk(int chatRoomNo, String chatMemberId) {
		int r = chatDao.viewOk(chatRoomNo, chatMemberId);
		return r;
	}
	
	@Transactional
	public int inputChatMessage(ChatMessageDTO message) {
		int r = chatDao.inputChatMessage(message);
		return r;
	}
	


}
