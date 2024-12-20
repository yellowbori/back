package com.app.ggumteo.mapper.audition;

import com.app.ggumteo.constant.PostType;
import com.app.ggumteo.domain.audition.AuditionDTO;
import com.app.ggumteo.domain.audition.AuditionVO;
import com.app.ggumteo.domain.file.PostFileDTO;
import com.app.ggumteo.pagination.AuditionPagination;
import com.app.ggumteo.pagination.MyAuditionPagination;
import com.app.ggumteo.pagination.MyWorkAndFundingPagination;
import com.app.ggumteo.search.Search;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Optional;

@Mapper
public interface AuditionMapper {

    // 작품 삽입
    void insert(AuditionVO auditionVO);

    // 총 작품 수 조회
    int selectTotal(@Param("postType") PostType postType);


    // 작품 ID로 작품 조회
    AuditionDTO selectById(Long id);

    // 작품 정보 수정 (tbl_work 및 tbl_post 업데이트)
    void updateAudition(AuditionDTO auditionDTO);
    void updatePost(AuditionDTO auditionDTO);

    // 모집 삭제
    void deleteById(Long id);

    // post 삭제
    void deletePostById(Long id);

    // 전체목록 조회
    List<AuditionDTO> selectAll(
            @Param("postType") PostType postType,
            @Param("search") Search search,
            @Param("pagination") AuditionPagination pagination
    );

    // 검색 조건이 포함된 총 작품 수 조회
    int selectTotalWithSearch(
            @Param("postType") PostType postType,
            @Param("search") Search search
    );

    // 상세페이지에서 다중 파일 조회
    List<PostFileDTO> selectFilesByPostId(@Param("postId")  Long postId);


//************ 마이페이지 **************

    // 내 작품 게시물 전체 조회
    public List<AuditionDTO> selectByMemberId(@Param("myAuditionPagination") MyAuditionPagination myAuditionPagination
            , @Param("memberId") Long memberId, @Param("postType") String postType);

    // 내 작품 게시물 전체 갯수
    public int selectCount(@Param("memberId") Long memberId, @Param("postType") String postType);

    // 작품 정보 조회
    public Optional<AuditionDTO> selectByIdAndPostType(@Param("id") Long id, @Param("postType") String postType);


    //메인페이지
    List<AuditionDTO> selectLatestTextAuditionsForMainPage();
    List<AuditionDTO> selectLatestVideoAuditionsForMainPage();
}
