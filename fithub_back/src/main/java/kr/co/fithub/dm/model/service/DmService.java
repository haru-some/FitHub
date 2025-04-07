package kr.co.fithub.dm.model.service;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.fithub.dm.model.dao.DmDao;
import kr.co.fithub.dm.model.dto.DmDto;
import kr.co.fithub.dm.model.dto.DmMessage;

@Service
public class DmService {
	@Autowired
	private DmDao dmDao;
	
	public int existRoom(HashMap<String, Integer> memberNoMap) {
		int existRoom = dmDao.existRoom(memberNoMap);
		return existRoom;
	}
	
	@Transactional
	public int createRoom(HashMap<String, Integer> memberNoMap) {
		int result = dmDao.createRoom(memberNoMap);
		return result;
	}
	
	@Transactional
	public int insertMessage(DmDto dm) {
		HashMap<String, Integer> memberNoMap = new HashMap<>();
    	memberNoMap.put("memberNo1", Math.min(dm.getSenderNo(), dm.getReceiverNo()));
    	memberNoMap.put("memberNo2", Math.max(dm.getSenderNo(), dm.getReceiverNo()));
		int dmRoomNo = dmDao.selectDmRoomNo(memberNoMap);
		
		DmMessage message = new DmMessage();
		int dmMessageNo = dmDao.selectNewMessageNo();
		message.setDmMessageNo(dmMessageNo);
		message.setDmRoomNo(dmRoomNo);
		message.setSenderNo(dm.getSenderNo());
		message.setDmContent(dm.getMessage());
		
		int result = dmDao.insertMessage(message);
		return dmMessageNo;
	}

	public List selectDmList(int memberNo) {
		List list = dmDao.selectDmList(memberNo);
		
		return list;
	}

	public List selectDmContent(int senderNo, int receiverNo) {
		HashMap<String, Integer> memberNoMap = new HashMap<>();
    	memberNoMap.put("memberNo1", Math.min(senderNo, receiverNo));
    	memberNoMap.put("memberNo2", Math.max(senderNo, receiverNo));
    	int dmRoomNo = dmDao.selectDmRoomNo(memberNoMap);
		List list = dmDao.selectDmContent(dmRoomNo);
		return list;
	}

	public DmMessage selectOneMessage(int dmMessageNo) {
		DmMessage msg = dmDao.selectOneMessage(dmMessageNo);
		return msg;
	}

}
