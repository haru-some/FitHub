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

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "07. 운동기록 & 활동 API", description = "운동관리와 회원활동 관련 기능")
public class MyfitController {
	@Autowired
	private MyfitService myfitService;
	@Autowired
	private DmService dmService;
	
	@Operation(summary = "운동 기록 조회", description = "회원 번호와 날짜로 해당 날짜의 운동 기록을 조회합니다.")
    @ApiResponses({ @ApiResponse(responseCode = "200", description = "조회 성공") })
    @GetMapping("/record/{memberNo}")
    public ResponseEntity<Record> selectRecord(@PathVariable int memberNo, @RequestParam String recordDate) {
        Record record = new Record();
        record.setMemberNo(memberNo);
        record.setRecordDate(recordDate);
        Record r = myfitService.selectRecord(record);
        return ResponseEntity.ok(r);
    }

    @Operation(summary = "루틴 조회", description = "회원 번호와 요일로 루틴을 조회합니다. 요일이 없으면 전체 루틴을 반환합니다.")
    @ApiResponses({ @ApiResponse(responseCode = "200", description = "조회 성공") })
    @GetMapping("/routine/{memberNo}")
    public ResponseEntity<Object> selectRoutine(@PathVariable int memberNo, @RequestParam(required = false, defaultValue = "none") String routineDay) {
        if (routineDay.equals("none")) {
            HashMap<String, Routine> map = myfitService.selectRoutineList(memberNo);
            return ResponseEntity.ok(map);
        } else {
            Routine routine = new Routine();
            routine.setMemberNo(memberNo);
            routine.setRoutineDay(routineDay);
            Routine r = myfitService.selectRoutine(routine);
            return ResponseEntity.ok(r);
        }
    }

    @Operation(summary = "루틴 수정", description = "회원 번호와 루틴 맵 데이터를 이용해 루틴을 수정합니다.")
    @ApiResponses({ @ApiResponse(responseCode = "200", description = "수정 성공") })
    @PutMapping("/routine/{memberNo}")
    public ResponseEntity<Integer> updateRoutine(@PathVariable int memberNo, @RequestBody Map<String, String> routineMap) {
        int result = myfitService.updateRoutine(memberNo, routineMap);
        return ResponseEntity.ok(result);
    }

    @Operation(summary = "운동 기록 수정", description = "회원 번호와 운동 기록 정보를 이용해 운동 기록을 수정합니다.")
    @ApiResponses({ @ApiResponse(responseCode = "200", description = "수정 성공") })
    @PutMapping("/record/{memberNo}")
    public ResponseEntity<Integer> updateRecord(@PathVariable int memberNo, @RequestBody Record record) {
        record.setMemberNo(memberNo);
        int result = myfitService.updateRecord(record);
        return ResponseEntity.ok(result);
    }

    @Operation(summary = "활동 멤버 정보 조회", description = "회원 번호와 로그인한 회원 번호를 기반으로 활동 정보를 조회합니다.")
    @ApiResponses({ @ApiResponse(responseCode = "200", description = "조회 성공") })
    @GetMapping("/activity/{memberNo}")
    public ResponseEntity<ActMember> selectActMember(@PathVariable int memberNo, @RequestParam int loginMemberNo) {
        ActMember m = myfitService.selectActMember(memberNo, loginMemberNo);
        return ResponseEntity.ok(m);
    }

    @Operation(summary = "운동 통계 그래프 데이터 조회", description = "회원 번호로 운동 통계 그래프 데이터를 조회합니다.")
    @ApiResponses({ @ApiResponse(responseCode = "200", description = "조회 성공") })
    @GetMapping("/activity/graph/{memberNo}")
    public ResponseEntity<List<Graph>> graph(@PathVariable int memberNo) {
        List<Graph> list = myfitService.graph(memberNo);
        return ResponseEntity.ok(list);
    }

    @Operation(summary = "운동 기록 날짜 리스트 조회", description = "운동 기록이 존재하는 날짜 리스트를 반환합니다.")
    @ApiResponses({ @ApiResponse(responseCode = "200", description = "조회 성공") })
    @GetMapping("/record/days/{memberNo}")
    public ResponseEntity<List> selectRecordDays(@PathVariable int memberNo) {
        List list = myfitService.selectRecordDays(memberNo);
        return ResponseEntity.ok(list);
    }

    @Operation(summary = "팔로우 리스트 조회", description = "회원 번호와 타입에 따라 팔로우(1:팔로워, 2:팔로잉) 리스트를 조회합니다.")
    @ApiResponses({ @ApiResponse(responseCode = "200", description = "조회 성공") })
    @GetMapping("/follow/{loginMemberNo}")
    public ResponseEntity<List<MemberDTO>> selectFollowList(@PathVariable int loginMemberNo, @RequestParam int type, @RequestParam int memberNo) {
        List<MemberDTO> list = myfitService.selectFollowList(loginMemberNo, type, memberNo);
        return ResponseEntity.ok(list);
    }

    @Operation(summary = "DM 리스트 조회", description = "회원 번호로 해당 회원의 DM 리스트를 조회합니다.")
    @ApiResponses({ @ApiResponse(responseCode = "200", description = "조회 성공") })
    @GetMapping("/dm/{memberNo}")
    public ResponseEntity<List> selectDmList(@PathVariable int memberNo) {
        List list = dmService.selectDmList(memberNo);
        return ResponseEntity.ok(list);
    }

    @Operation(summary = "DM 내용 조회", description = "보낸 사람과 받은 사람 번호로 1:1 DM 내용을 조회합니다.")
    @ApiResponses({ @ApiResponse(responseCode = "200", description = "조회 성공") })
    @GetMapping("/dm")
    public ResponseEntity<List> selectDmContent(@RequestParam int senderNo, @RequestParam int receiverNo) {
        List list = dmService.selectDmContent(senderNo, receiverNo);
        return ResponseEntity.ok(list);
    }

}
