package kr.co.fithub.util;

import org.springframework.stereotype.Component;

@Component
public class PageInfoUtil {
	public PageInfo getPageInfo(int reqPage, int numPerPage, int pageNaviSize, int totalCount) {
		int end = reqPage * numPerPage;
		int start = end - numPerPage + 1;
		int totalPage = (totalCount%numPerPage == 0 ? totalCount/numPerPage : totalCount/numPerPage+1);
		int pageNo = ((reqPage-1)/pageNaviSize)*pageNaviSize + 1;
		PageInfo pi = new PageInfo(start, end, pageNo, pageNaviSize, totalPage);
		return pi;
	}
}
