// 레이아웃 조정 함수
const adjustLayout = () => {
    let reviewContentContainer = document.querySelector(".review-content-container");

    // 요소가 없으면 생성
    if (!reviewContentContainer) {
        console.warn(".review-content-container 요소를 찾을 수 없습니다. 새로 생성합니다.");

        // 새로운 요소 생성 및 추가
        reviewContentContainer = document.createElement("div");
        reviewContentContainer.className = "review-content-container";
        document.body.appendChild(reviewContentContainer);
    }

    // 레이아웃 조정
    if (window.innerWidth < 768) {
        reviewContentContainer.style.width = "100%";
    } else {
        reviewContentContainer.style.width = "740px";
    }
};

document.addEventListener("DOMContentLoaded", () => {
    const myReviewsList = document.querySelector(".comment-list") || createElement("div", "comment-list");
    const memberId = 15; // 사용자 ID
    let data = { replies: [] };

    // Helper function: DOM 요소 생성
    function createElement(tag, className) {
        const element = document.createElement(tag);
        if (className.startsWith("#")) {
            element.id = className.slice(1);
        } else {
            element.className = className;
        }
        // 특정 부모 요소에 추가 (예: .parent-container). 여기서는 body에 추가합니다.
        document.body.appendChild(element);
        return element;
    }

    // 댓글 데이터를 가져오는 함수
    async function fetchComments() {
        try {
            console.log("Fetching comments for memberId:", memberId);
            const response = await fetch(`http://localhost:10000/replies/${memberId}`);
            console.log("Fetch response status:", response.status);

            if (!response.ok) {
                throw new Error(`서버 응답 오류: ${response.status}`);
            }

            const responseData = await response.json();
            console.log("API 응답 데이터:", responseData);

            responseData.forEach(comment => {
                console.log(`Comment ID: ${comment.id}, Created Date: ${comment.createdDate}`);
            });

            // 데이터 매핑
            const comments = Array.isArray(responseData) ? responseData : [responseData];
            console.log(`댓글 개수: ${comments.length}`);

            if (comments.length === 0) {
                console.warn("댓글 데이터가 비어 있습니다.");
                myReviewsList.innerHTML = "<p>댓글이 없습니다.</p>";
                return;
            }

            data.replies = comments.map(comment => ({
                id: comment.id,
                replyContent: comment.replyContent,
                profileNickname: comment.profileNickname,
                profileImgUrl: comment.profileImgUrl || "/static/images/default-profile.png",
                star: comment.star,
                createdDate: comment.createdDate || "날짜 없음",
                memberId: comment.memberId,
                boardId: comment.boardId || null,
            }));
            console.log("변환된 데이터:", data.replies);

            renderComments();
        } catch (error) {
            console.error("댓글 데이터를 가져오는 중 오류 발생:", error);
            myReviewsList.innerHTML = "<p>댓글을 불러오는 중 문제가 발생했습니다.</p>";
        }
    }
    // 댓글 데이터가 없는 두 개의 댓글을 선택하여 숨기기
    const comments = document.querySelectorAll('.comment'); // .comment 클래스를 가진 모든 댓글 요소

    // 댓글 데이터가 없다면 해당 댓글을 숨김
    comments.forEach((comment, index) => {
        const commentData = comment.dataset.content; // 댓글 데이터가 들어있는 데이터 속성

        if (!commentData || commentData.trim() === '') { // 데이터가 없거나 비어 있는 경우
            comment.style.display = 'none'; // 댓글 숨기기
        }
    });

    // 댓글 렌더링 함수
    function renderComments() {
        myReviewsList.innerHTML = ""; // 기존 댓글 초기화

        if (!data.replies || data.replies.length === 0) {
            console.log("렌더링할 댓글 데이터가 없습니다.");
            return;
        }

        // 상위 5개의 댓글만 렌더링
        const topReplies = data.replies.slice(0, 5);

        console.log("렌더링할 댓글 수:", topReplies.length);

        topReplies.forEach(reply => {
            const commentHTML = `
                <div class="comment-box" data-comment-id="${reply.id}">
                    <div class="comment-wrapper">
                        <div class="write-user">
                            <img src="${reply.profileImgUrl}" class="comment-writer-img" alt="프로필 이미지"/>
                            <div class="comment-writer-name">
                                <div class="writer-name">${reply.profileNickname}</div>
                                <button class="btn-comment-delete cursor" data-comment-id="${reply.id}">삭제</button>
                            </div>
                        </div>
                    </div>
                    <div class="comment-content">${reply.replyContent}</div>
                    <span class="comment-date-created">${reply.createdDate}</span>
                    <div class="comment-review">
                        <div class="review-box">
                            <div class="star-box">
                                <img src="/static/images/member/star.png" alt="별점" class="star-img"/>
                                <span class="review-score">${reply.star}</span>
                            </div>
                        </div>
                    </div>
                    <div class="comment-board-link">
                        ${reply.boardId ? `<button class="btn-board-view cursor" data-board-id="${reply.boardId}">게시판 보러가기</button>` : ""}
                    </div>
                </div>`;
            console.log("렌더링할 댓글 HTML:", commentHTML);
            myReviewsList.insertAdjacentHTML("beforeend", commentHTML);
        });

        // 모든 댓글을 불러온 후, 내용이 없는 댓글을 DOM에서 제거
        const comments = document.querySelectorAll('.comment-box'); // .comment-box 클래스를 가진 모든 댓글 요소

        comments.forEach((comment) => {
            const commentContent = comment.querySelector('.comment-content'); // 댓글 내용 요소

            if (!commentContent || commentContent.textContent.trim() === '') { // 댓글 내용이 없으면
                comment.remove(); // 해당 댓글을 DOM에서 제거
            }
        });

        // 게시판 보러가기 버튼 이벤트 리스너 추가
        const boardButtons = myReviewsList.querySelectorAll(".btn-board-view");
        boardButtons.forEach(button => {
            button.addEventListener("click", () => {
                const boardId = button.getAttribute("data-board-id");
                console.log(`게시판 보러가기 버튼 클릭 - boardId: ${boardId}`);
                if (boardId) {
                    window.location.href = `/board/${boardId}`;
                } else {
                    console.warn("boardId가 존재하지 않습니다.");
                }
            });
        });
    }

    // 댓글 삭제 버튼 이벤트 추가
    myReviewsList.addEventListener("click", (event) => {
        if (event.target.classList.contains("btn-comment-delete")) {
            const commentId = event.target.getAttribute("data-comment-id");
            console.log(`댓글 삭제 요청: ${commentId}`);
            deleteComment(commentId);
        }
    });

    // 댓글 삭제 함수
    async function deleteComment(commentId) {
        try {
            console.log(`Deleting comment with ID: ${commentId}`);
            const response = await fetch(`http://localhost:10000/replies/${commentId}`, {
                method: "DELETE",
            });
            console.log("Delete response status:", response.status);

            if (!response.ok) {
                throw new Error(`삭제 요청 실패: ${response.status}`);
            }

            console.log("댓글 삭제 완료:", commentId);

            // 삭제 후 데이터 갱신
            data.replies = data.replies.filter(reply => reply.id !== parseInt(commentId));
            renderComments();
        } catch (error) {
            console.error("댓글 삭제 중 오류 발생:", error);
        }
    }

    // 초기 데이터 로드 및 레이아웃 조정
    fetchComments();
    adjustLayout();

    // 창 크기 변경 시 레이아웃 조정
    window.addEventListener("resize", adjustLayout);
});
