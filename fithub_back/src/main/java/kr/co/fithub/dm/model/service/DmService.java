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
	public int insertMessage(DmDto dm, int isRead) {
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
		if(isRead == 0) {
			message.setIsRead("N");
		}else {
			message.setIsRead("Y");
		}
		
		int result = dmDao.insertMessage(message);
		result += dmDao.updateLastMessageAt(dmRoomNo);
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
    	int exist = dmDao.existRoom(memberNoMap);
    	List list = null;
    	if(exist > 0) {
    		int dmRoomNo = dmDao.selectDmRoomNo(memberNoMap);
    		list = dmDao.selectDmContent(dmRoomNo);
    	}
    	
		return list;
	}

	public DmMessage selectOneMessage(int dmMessageNo) {
		DmMessage msg = dmDao.selectOneMessage(dmMessageNo);
		return msg;
	}

	@Transactional
	public void changeIsRead(int memberNo, int receiverNo) {
		HashMap<String, Integer> memberNoMap = new HashMap<>();
    	memberNoMap.put("memberNo1", Math.min(memberNo, receiverNo));
    	memberNoMap.put("memberNo2", Math.max(memberNo, receiverNo));
    	int exist = dmDao.existRoom(memberNoMap);
    	if(exist>0) {
    		
    		int dmRoomNo = dmDao.selectDmRoomNo(memberNoMap);
    		HashMap<String, Integer> map = new HashMap<>();
    		map.put("receiverNo", receiverNo);
    		map.put("dmRoomNo", dmRoomNo);
    		int result = dmDao.changeIsRead(map);
    	}
	}

	public int selectReadYetCount(int memberNo) {
		int readYetCount = dmDao.selectReadYetCount(memberNo);
		return readYetCount;
	}

}
