package kr.co.fithub.community.model.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.co.fithub.community.model.dto.CommunityDTO;


@Mapper
public interface CommunityDao {

	List selectCommunityList();

	CommunityDTO selectOneCommunity(int communityNo);
	
}
