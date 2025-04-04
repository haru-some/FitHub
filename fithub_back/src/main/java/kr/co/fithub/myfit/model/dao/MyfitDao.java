package kr.co.fithub.myfit.model.dao;

import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.co.fithub.member.model.dto.MemberDTO;
import kr.co.fithub.myfit.model.dto.ActMember;
import kr.co.fithub.myfit.model.dto.Graph;
import kr.co.fithub.myfit.model.dto.Record;
import kr.co.fithub.myfit.model.dto.Routine;

@Mapper
public interface MyfitDao {

	Record selectRecord(Record record);

	Routine selectRoutine(Routine routine);

	List selectRoutineList(int memberNo);

	int existRoutine(Routine r);

	int updateRoutine(Routine r);

	int insertRoutine(Routine r);

	int deleteRoutine(Routine r);
	
	int insertRecord(Record record);

	int updateRecord(Record record);
	
	int deleteRecord(Record record);

	ActMember selectActMember(HashMap<String, Integer> map);

	List<Graph> graph(int memberNo);

	List selectRecordDays(int memberNo);

	List<MemberDTO> selectFollowerList(int memberNo);

	List<MemberDTO> selectFollowingList(int memberNo);


	

}
