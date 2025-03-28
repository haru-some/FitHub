package kr.co.fithub.admin.model.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.co.fithub.member.model.dto.MemberDTO;

@Mapper
public interface AdminDao {

	List memberList();

	int adminMemberChange(MemberDTO memberData);

}
