package kr.co.fithub.admin.model.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface AdminDao {

	List memberList();

}
