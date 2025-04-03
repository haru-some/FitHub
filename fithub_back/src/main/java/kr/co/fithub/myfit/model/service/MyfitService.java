package kr.co.fithub.myfit.model.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.fithub.member.model.dto.MemberDTO;
import kr.co.fithub.myfit.model.dao.MyfitDao;
import kr.co.fithub.myfit.model.dto.ActMember;
import kr.co.fithub.myfit.model.dto.Graph;
import kr.co.fithub.myfit.model.dto.Record;
import kr.co.fithub.myfit.model.dto.Routine;

@Service
public class MyfitService {
	@Autowired
	private MyfitDao myfitDao;

	public Record selectRecord(Record record) {
		Record r = myfitDao.selectRecord(record);
		return r;
	}

	public Routine selectRoutine(Routine routine) {
		Routine r = myfitDao.selectRoutine(routine);
		return r;
	}

	public HashMap<String, Routine> selectRoutineList(int memberNo) {
		List<Routine> list = myfitDao.selectRoutineList(memberNo);
		HashMap<String, Routine> map = new HashMap<>();
//		map.put("월", 0);
//		map.put("화", 1);
//		map.put("수", 2);
//		map.put("목", 3);
//		map.put("금", 4);
//		map.put("토", 5);
//		map.put("일", 6);
		
//		return list.stream().sorted((a,b) -> map.get(a.getRoutineDay()) - map.get(b.getRoutineDay())).toList();
		list.stream().forEach(i -> map.put(i.getRoutineDay(), i));
		return map;
	}
	
	
	@Transactional
	public int updateRoutine(int memberNo, Map<String, String> routineMap) {
		int result = 0;
		for (Map.Entry<String, String> entry : routineMap.entrySet()) {
		    String day = entry.getKey();
		    String content = entry.getValue();
		    
		    if (content != null && !content.replace("<p>", "").replace("</p>", "").replace("<br>", "").trim().isEmpty()) {
		    	Routine r = new Routine();
		    	r.setMemberNo(memberNo);
		    	r.setRoutineDay(day);
		    	r.setRoutineContent(content);
		        int exist = myfitDao.existRoutine(r);
		        
		        if (exist > 0) {
		        	result += myfitDao.updateRoutine(r);
		        } else {
		        	result += myfitDao.insertRoutine(r);
		        }
		    }
		}
		return result;
	}

	@Transactional
	public int updateRecord(Record record) {
		int result = 0;
		
		String content = record.getRecordContent();
		 if (content != null && !content.replace("<p>", "").replace("</p>", "").replace("<br>", "").isBlank()) {
			 if(record.getRecordNo() == 0) {
				result += myfitDao.insertRecord(record);
			}else {
				result += myfitDao.updateRecord(record);
			}
		 }
		
		return result;
	}

	public ActMember selectActMember(int memberNo, int loginMemberNo) {
		HashMap<String, Integer> map = new HashMap<>();
		map.put("memberNo", memberNo);
		map.put("loginMemberNo", loginMemberNo);
		ActMember m = myfitDao.selectActMember(map);
		return m;
	}

	public List<Graph> graph(int memberNo) {
		List<Graph> list = myfitDao.graph(memberNo);
		return list;
	}

	public List selectRecordDays(int memberNo) {
		List list = myfitDao.selectRecordDays(memberNo);
		return list;
	}

	public List<MemberDTO> selectFollowList(int memberNo, int type) {
		List<MemberDTO> list = null;
		if(type == 1) {
			//팔로워 조회
			list = myfitDao.selectFollowerList(memberNo);
		}else {
			//팔로잉 조회
			list = myfitDao.selectFollowingList(memberNo);
		}
		return list;
	}

}
