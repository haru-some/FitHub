package kr.co.fithub.myfit.model.dao;

import org.apache.ibatis.annotations.Mapper;

import kr.co.fithub.myfit.model.dto.Record;
import kr.co.fithub.myfit.model.dto.Routine;

@Mapper
public interface MyfitDao {

	Record selectRecord(Record record);

	Routine selectRoutine(Routine routine);

}
