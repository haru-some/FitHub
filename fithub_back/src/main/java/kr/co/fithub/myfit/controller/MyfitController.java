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

import kr.co.fithub.dm.model.service.DmService;
import kr.co.fithub.member.model.dto.MemberDTO;
import kr.co.fithub.myfit.model.dto.ActMember;
import kr.co.fithub.myfit.model.dto.Graph;
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
	@Autowired
	private DmService dmService;
	
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
	public ResponseEntity<Integer> updateRoutine(@PathVariable int memberNo, @RequestBody Map<String, String> routineMap) {
		int result = myfitService.updateRoutine(memberNo,routineMap);
		
		
		return ResponseEntity.ok(result);
	}
	
	@PutMapping("record/{memberNo}")
	public ResponseEntity<Integer> updateRecord(@PathVariable int memberNo, @RequestBody Record record) {
		record.setMemberNo(memberNo);
		int result = myfitService.updateRecord(record);
		
		return ResponseEntity.ok(result);
	}
	
	@GetMapping("/activity/{memberNo}")
	public ResponseEntity<ActMember> selectActMember(@PathVariable int memberNo, @RequestParam int loginMemberNo) {
		ActMember m = myfitService.selectActMember(memberNo,loginMemberNo);
		return ResponseEntity.ok(m);
	}
	
	@GetMapping("/activity/graph/{memberNo}")
	public ResponseEntity<List<Graph>> graph(@PathVariable int memberNo) {
		List<Graph> list = myfitService.graph(memberNo);
		
		return ResponseEntity.ok(list);
	}
	
	@GetMapping("/record/days/{memberNo}")
	public ResponseEntity<List> selectRecordDays(@PathVariable int memberNo) {
		List list = myfitService.selectRecordDays(memberNo);
		return ResponseEntity.ok(list);
	}
	
	@GetMapping("/follow/{memberNo}")
	public ResponseEntity<List<MemberDTO>> selectFollowList(@PathVariable int memberNo,@RequestParam int type) {
		List<MemberDTO> list = myfitService.selectFollowList(memberNo,type);
		return ResponseEntity.ok(list);
	}
	
	@GetMapping("/dm/{memberNo}")
	public ResponseEntity<List> selectDmList(@PathVariable int memberNo) {
		List list = dmService.selectDmList(memberNo);
		return ResponseEntity.ok(list);
	}
	
	@GetMapping("/dm")
	public ResponseEntity<List> selectDmContent(@RequestParam int senderNo, @RequestParam int receiverNo) {
		List list = dmService.selectDmContent(senderNo,receiverNo);
		return ResponseEntity.ok(list);
	}
	
	
	
	
	
	
	

}
