package kr.co.fithub.member.model.dao;

import java.util.HashMap;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import kr.co.fithub.member.model.dto.MemberDTO;

@Mapper
public interface MemberDao {
	int joinMember(MemberDTO member);
	int exists(String memberId);
	MemberDTO selectOneMember(String memberId);
	int updateMember(MemberDTO member);
	int deleteMember(String memberId);
	int changePw(MemberDTO member);
	int existsEmail(String memberEmail);
	MemberDTO findIdByNameAndEmail(HashMap<String, String> nameEmail);
	MemberDTO findPwByIdAndEmail(Map<String, String> idEmail);
	MemberDTO findByOauthId(String oauthId);
	void insertOauthMember(MemberDTO member);
}
