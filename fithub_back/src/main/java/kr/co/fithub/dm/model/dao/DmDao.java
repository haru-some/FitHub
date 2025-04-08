package kr.co.fithub.dm.model.dao;

import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.co.fithub.dm.model.dto.DmDto;
import kr.co.fithub.dm.model.dto.DmMessage;

@Mapper
public interface DmDao {

	int existRoom(HashMap<String, Integer> memberNoMap);

	int createRoom(HashMap<String, Integer> memberNoMap);

	int selectDmRoomNo(HashMap<String, Integer> memberNoMap);

	int insertMessage(DmMessage message);

	List selectDmList(int memberNo);

	List selectDmContent(int dmRoomNo);

	int selectNewMessageNo();

	DmMessage selectOneMessage(int dmMessageNo);

	int updateLastMessageAt(int dmRoomNo);

	int changeIsRead(HashMap<String, Integer> map);

}
