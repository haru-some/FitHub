package kr.co.fithub.member.model.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import kr.co.fithub.member.model.dto.DelMemberDTO;
import kr.co.fithub.member.model.dto.MemberDTO;

@Mapper
public interface MemberDao {
	int joinMember(MemberDTO member);
	int existsId(String memberId);
	MemberDTO selectOneMember(String memberId);
	int updateMember(MemberDTO member);
	int changePw(MemberDTO member);
	int existsEmail(String memberEmail);
	List<MemberDTO> findIdsByNameAndEmail(Map<String, String> map);
	MemberDTO findPwByIdAndEmail(Map<String, String> idEmail);
	MemberDTO findByOauthId(String oauthId);
	int insertOauthMember(MemberDTO member);
	int updateOauthMemberInfo(MemberDTO member);
	int deactivateMember(Map<String, Object> idUpdateMap);
	int insertDelMember(DelMemberDTO delMember);
}
