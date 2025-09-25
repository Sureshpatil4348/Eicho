import {
    SOCKET_CONNECTED,
    SOCKET_DISCONNECTED,
    SOCKET_ERROR,
    SOCKET_EVENT,
    SOCKET_COMMUNITY_JOIN,
    SOCKET_COMMUNITY_ADD_POST,
    SOCKET_COMMUNITY_RECEIVE_NEW_POST,
    SOCKET_COMMUNITY_ADD_COMMENT,
    SOCKET_COMMUNITY_RECEIVE_NEW_COMMENT,
    SOCKET_COMMUNITY_SEND_POST_LIKE_COUNT,
    INIT_SOCKET,
    SOCKET_COMMUNITY_SEND_COMMENT_AND_REPLY_LIKE_COUNT,
    SOCKET_COMMUNITY_SEND_POST_STATUS_UPDATE,
    SOCKET_COMMUNITY_SEND_COMMENT_AND_REPLY_DELETION,
    SOCKET_COMMUNITY_SEND_POLL_VOTE,
    SOCKET_COMMUNITY_SEND_POST_VIEWS,
    SOCKET_COURSE_JOIN,
    SOCKET_COURSE_ADD_COMMENT,
    SOCKET_COURSE_SEND_COMMENT_AND_REPLY_LIKE_COUNT,
    SOCKET_COURSE_SEND_COMMENT_AND_REPLY_DELETION,
    SOCKET_COURSE_ADD_REPLY,
    SOCKET_COURSE_SEND_DELETE_LIKE_UNLIKE,
    SOCKET_LIVE_CLASS_ADD_METIRIALS,
    SOCKET_LIVE_CLASS_JOIN,
    SOCKET_LEAVE_CLASS_JOIN,
    CLOSE_SOCKET,
    INIT_DISCUSSION_SOCKET,
    CLOSE_DISCUSSION_SOCKET,
    SOCKET_LIVE_CLASS_SEND_NEW_QUESTION,
    SOCKET_LIVE_CLASS_SEND_NEW_REPLY,
    INIT_LIVE_CLASS_SOCKET,
    CLOSE_LIVE_CLASS_SOCKET,
    SOCKET_LIVE_CLASS_SEND_REACTION,
    SOCKET_LIVE_CLASS_POLL,
    SOCKET_LIVE_CLASS_POLL_STATUS_CHANGE,
    SOCKET_LIVE_CLASS_POLL_VOTE,
    SOCKET_LIVE_CLASS_POLL_EDIT,
    SOCKET_LIVE_CLASS_END_CLASS,
} from './socketActionTypes';

/* Generic Action Type */
export interface Action<T = any> {
    type: string;
    payload?: T;
}

/* BASIC SOCKET ACTIONS */
export const socketConnected: any = (): Action => ({
    type: SOCKET_CONNECTED,
});

export const socketDisconnected: any = (reason: string): Action<string> => ({
    type: SOCKET_DISCONNECTED,
    payload: reason,
});

export const socketError: any = (error: unknown): Action<unknown> => ({
    type: SOCKET_ERROR,
    payload: error,
});

export const sendSocketEvent = (
    event: string,
    payload: Record<string, unknown>
): Action<{ event: string; payload: Record<string, unknown> }> => ({
    type: SOCKET_EVENT,
    payload: { event, payload },
});

/* COMMUNITY SOCKET ACTIONS */
export const socketCommunityJoin = (communityId: string): Action<string> => ({
    type: SOCKET_COMMUNITY_JOIN,
    payload: communityId,
});

export const socketCommunityAddPost = (
    communityId: string,
    postDetails: Record<string, unknown>
): Action<{ communityId: string; postDetails: Record<string, unknown> }> => ({
    type: SOCKET_COMMUNITY_ADD_POST,
    payload: { communityId, postDetails },
});

export const socketCommunityAddComment = (
    communityId: string,
    postId: string,
    owner: string,
    comment: string,
    parentId?: string
): Action => ({
    type: SOCKET_COMMUNITY_ADD_COMMENT,
    payload: { communityId, postId, owner, comment, parentId },
});

export const socketCommunityReceiveNewPost = (
    post: Record<string, unknown>
): Action<Record<string, unknown>> => ({
    type: SOCKET_COMMUNITY_RECEIVE_NEW_POST,
    payload: post,
});

export const socketCommunityReceiveNewComment = (
    comment: Record<string, unknown>
): Action<Record<string, unknown>> => ({
    type: SOCKET_COMMUNITY_RECEIVE_NEW_COMMENT,
    payload: comment,
});

export const socketCommunitySendPostLikeCount = (
    payload: Record<string, unknown>
): Action<Record<string, unknown>> => ({
    type: SOCKET_COMMUNITY_SEND_POST_LIKE_COUNT,
    payload,
});

export const socketCommunitySendCommentAndReplyLikeCount = ({
    communityId,
    postId,
    commentId,
    likes,
    replyId = null,
}: {
    communityId: string;
    postId: string;
    commentId: string;
    likes: number;
    replyId?: string | null;
}): Action => ({
    type: SOCKET_COMMUNITY_SEND_COMMENT_AND_REPLY_LIKE_COUNT,
    payload: { communityId, postId, commentId, replyId, likes },
});

export const socketCommunitySendCommentAndReplyDeletion = ({
    communityId,
    postId,
    commentId,
    replyId = null,
}: {
    communityId: string;
    postId: string;
    commentId: string;
    replyId?: string | null;
}): Action => ({
    type: SOCKET_COMMUNITY_SEND_COMMENT_AND_REPLY_DELETION,
    payload: { communityId, postId, commentId, replyId },
});

export const socketCommunitySendPostStatusUpdate = (
    payload: Record<string, unknown>
): Action<Record<string, unknown>> => ({
    type: SOCKET_COMMUNITY_SEND_POST_STATUS_UPDATE,
    payload,
});

export const socketCommunitySendPollVoteUpdate = (
    payload: Record<string, unknown>
): Action<Record<string, unknown>> => ({
    type: SOCKET_COMMUNITY_SEND_POLL_VOTE,
    payload,
});

export const socketCommunitySendPostViewsUpdate = (
    payload: Record<string, unknown>
): Action<Record<string, unknown>> => ({
    type: SOCKET_COMMUNITY_SEND_POST_VIEWS,
    payload,
});

/* SOCKET LIFECYCLE */
export const initSocket = (userData: Record<string, unknown>): Action => ({
    type: INIT_SOCKET,
    payload: userData,
});

export const closeSocket = (): Action => ({
    type: CLOSE_SOCKET,
});

export const initDiscussionSocket = (
    userData: Record<string, unknown>
): Action => ({
    type: INIT_DISCUSSION_SOCKET,
    payload: userData,
});

export const closeDiscussionSocket = (): Action => ({
    type: CLOSE_DISCUSSION_SOCKET,
});

/* COURSE SOCKET */
export const socketCourseJoin = (courseId: string): Action<string> => ({
    type: SOCKET_COURSE_JOIN,
    payload: courseId,
});

export const socketCourseAddComment = (
    payload: Record<string, unknown>
): Action<Record<string, unknown>> => ({
    type: SOCKET_COURSE_ADD_COMMENT,
    payload,
});

export const socketCourseAddReply = (
    payload: Record<string, unknown>
): Action<Record<string, unknown>> => ({
    type: SOCKET_COURSE_ADD_REPLY,
    payload,
});

export const socketCourseSendDeleteLikeUnlike = (
    payload: Record<string, unknown>
): Action<Record<string, unknown>> => ({
    type: SOCKET_COURSE_SEND_DELETE_LIKE_UNLIKE,
    payload,
});

export const socketCourseSendCommentAndReplyLikeCount = ({
    courseId,
    postId,
    commentId,
    likes,
    replyId = null,
}: {
    courseId: string;
    postId: string;
    commentId: string;
    likes: number;
    replyId?: string | null;
}): Action => ({
    type: SOCKET_COURSE_SEND_COMMENT_AND_REPLY_LIKE_COUNT,
    payload: { courseId, postId, commentId, replyId, likes },
});

export const socketCourseSendCommentAndReplyDeletion = ({
    courseId,
    postId,
    commentId,
    replyId = null,
}: {
    courseId: string;
    postId: string;
    commentId: string;
    replyId?: string | null;
}): Action => ({
    type: SOCKET_COURSE_SEND_COMMENT_AND_REPLY_DELETION,
    payload: { courseId, postId, commentId, replyId },
});

/* LIVE CLASS SOCKET */
export const initLiveClassSocket = (
    payload: Record<string, unknown>
): Action<Record<string, unknown>> => ({
    type: INIT_LIVE_CLASS_SOCKET,
    payload,
});

export const closeLiveClassSocket = (): Action => ({
    type: CLOSE_LIVE_CLASS_SOCKET,
});

export const socketliveClassSendMeterials = ({
    liveclassId,
    payloadData,
}: {
    liveclassId: string;
    payloadData: Record<string, unknown>;
}): Action => ({
    type: SOCKET_LIVE_CLASS_ADD_METIRIALS,
    payload: { liveclassId, payloadData },
});

export const socketliveClassJoin = ({
    liveclassId,
    payloaddata,
}: {
    liveclassId: string;
    payloaddata: Record<string, unknown>;
}): Action => ({
    type: SOCKET_LIVE_CLASS_JOIN,
    payload: { liveclassId, payloaddata },
});

export const socketLeaveClassJoin = ({
    liveclassId,
    payloaddata,
}: {
    liveclassId: string;
    payloaddata: Record<string, unknown>;
}): Action => ({
    type: SOCKET_LEAVE_CLASS_JOIN,
    payload: { liveclassId, payloaddata },
});

export const socketLiveClassQNASendNewQuestion = ({
    liveClassId,
    payload,
}: {
    liveClassId: string;
    payload: Record<string, unknown>;
}): Action => ({
    type: SOCKET_LIVE_CLASS_SEND_NEW_QUESTION,
    payload: { liveClassId, payload },
});

export const socketLiveClassQNASendNewReply = ({
    liveClassId,
    payload,
}: {
    liveClassId: string;
    payload: Record<string, unknown>;
}): Action => ({
    type: SOCKET_LIVE_CLASS_SEND_NEW_REPLY,
    payload: { liveClassId, payload },
});

export const socketliveClassSendReaction = ({
    liveClassId,
    payloaddata,
    emoji,
}: {
    liveClassId: string;
    payloaddata: Record<string, unknown>;
    emoji: string;
}): Action => ({
    type: SOCKET_LIVE_CLASS_SEND_REACTION,
    payload: { liveClassId, payloaddata, emoji },
});

export const socketLiveClassPollCreate = ({
    payload,
}: {
    payload: Record<string, unknown>;
}): Action => ({
    type: SOCKET_LIVE_CLASS_POLL,
    payload,
});

export const socketLiveClassPollStatusChange = ({
    payload,
}: {
    payload: Record<string, unknown>;
}): Action => ({
    type: SOCKET_LIVE_CLASS_POLL_STATUS_CHANGE,
    payload,
});

export const socketLiveClassPollVote = ({
    payload,
}: {
    payload: Record<string, unknown>;
}): Action => ({
    type: SOCKET_LIVE_CLASS_POLL_VOTE,
    payload,
});

export const socketLiveClassPollEdit = ({
    payload,
}: {
    payload: Record<string, unknown>;
}): Action => ({
    type: SOCKET_LIVE_CLASS_POLL_EDIT,
    payload,
});

export const socketEndLiveClass = ({
    liveclassId,
    payloaddata,
}: {
    liveclassId: string;
    payloaddata: Record<string, unknown>;
}): Action => ({
    type: SOCKET_LIVE_CLASS_END_CLASS,
    payload: { liveclassId, payloaddata },
});
