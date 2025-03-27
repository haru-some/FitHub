package kr.co.fithub.myfit.model.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.co.fithub.myfit.model.dao.MyfitDao;
import kr.co.fithub.myfit.model.dto.Record;
import kr.co.fithub.myfit.model.dto.Routine;

@Service
public class MyfitService {
	@Autowired
	private MyfitDao myfitDao;

	public Record selectRecord(Record record) {
		Record r = myfitDao.selectRecord(record);
		System.out.println("서비스임: "+record.getRecordDate());
		return r;
	}

	public Routine selectRoutine(Routine routine) {
		Routine r = myfitDao.selectRoutine(routine);
		System.out.println("서비스임"+r);
		return r;
	}

}
