package kr.co.fithub.myfit.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.co.fithub.myfit.model.dto.Record;
import kr.co.fithub.myfit.model.dto.Routine;
import kr.co.fithub.myfit.model.service.MyfitService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PutMapping;



@CrossOrigin("*")
@RestController
@RequestMapping(value="/myfit")
public class MyfitController {
	@Autowired
	private MyfitService myfitService;
	
	@GetMapping(value="/record/{memberNo}")
	public ResponseEntity<Record> selectRecord(@PathVariable int memberNo, @RequestParam String recordDate) {
		Record record = new Record();
		record.setMemberNo(memberNo);
		record.setRecordDate(recordDate);
		Record r = myfitService.selectRecord(record);
		
		return ResponseEntity.ok(r);
	}
	
	@GetMapping(value="/routine/{memberNo}")
	public ResponseEntity<Object> selectRoutine(@PathVariable int memberNo, @RequestParam(required = false, defaultValue = "none") String routineDay) {
		if(routineDay.equals("none")) {
			HashMap<String, Routine> map = myfitService.selectRoutineList(memberNo);
			return ResponseEntity.ok(map);
		}else {
			Routine routine = new Routine();
			routine.setMemberNo(memberNo);
			routine.setRoutineDay(routineDay);
			Routine r = myfitService.selectRoutine(routine);
			return ResponseEntity.ok(r);
		}
	}
	
	@PutMapping("/routine/{memberNo}")
	public ResponseEntity<Integer> putMethodName(@PathVariable int memberNo, @RequestBody Map<String, String> routineMap) {
		int result = myfitService.updateRoutine(memberNo,routineMap);
		
		
		return ResponseEntity.ok(result);
	}
	

}
