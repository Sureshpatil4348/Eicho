export const SOCKET_CONNECTED = 'SOCKET_CONNECTED';
export const SOCKET_DISCONNECTED = 'SOCKET_DISCONNECTED';
export const INIT_SOCKET = 'INIT_SOCKET';
export const CLOSE_SOCKET = 'CLOSE_SOCKET';
export const INIT_DISCUSSION_SOCKET = 'INIT_DISCUSSION_SOCKET';
export const CLOSE_DISCUSSION_SOCKET = 'CLOSE_DISCUSSION_SOCKET';
export const SOCKET_ERROR = 'SOCKET_ERROR';
export const SOCKET_EVENT = 'SOCKET_EVENT';


/* COMMUNITY ACTIONS */
export const SOCKET_COMMUNITY_JOIN = 'SOCKET_COMMUNITY_JOIN';
export const SOCKET_COMMUNITY_ADD_POST = 'SOCKET_COMMUNITY_ADD_POST';
export const SOCKET_COMMUNITY_RECEIVE_NEW_POST = 'SOCKET_COMMUNITY_RECEIVE_NEW_POST';
export const SOCKET_COMMUNITY_ADD_COMMENT = 'SOCKET_COMMUNITY_ADD_COMMENT';
export const SOCKET_COMMUNITY_RECEIVE_NEW_COMMENT = 'SOCKET_COMMUNITY_RECEIVE_NEW_COMMENT';
export const SOCKET_COMMUNITY_SEND_POST_LIKE_COUNT = 'sendPostLikeCount';
export const SOCKET_COMMUNITY_RECEIVE_POST_LIKE_COUNT = 'postLikeCount';
export const SOCKET_COMMUNITY_SEND_COMMENT_AND_REPLY_LIKE_COUNT = 'sendCommentLikeCount';
export const SOCKET_COMMUNITY_RECEIVE_COMMENT_AND_REPLY_LIKE_COUNT = 'commentLikeCount';
export const SOCKET_COMMUNITY_SEND_COMMENT_AND_REPLY_DELETION = 'sendCommentAndReplyDeletion';
export const SOCKET_COMMUNITY_RECEIVE_COMMENT_AND_REPLY_DELETION = 'receiveCommentAndReplyDeletion';
export const SOCKET_COMMUNITY_SEND_POLL_VOTE = 'receivedPollVote';
export const SOCKET_COMMUNITY_RECEIVE_POLL_VOTE = 'sendPollVote';
export const SOCKET_COMMUNITY_SEND_POST_VIEWS = 'sendPostViews';
export const SOCKET_COMMUNITY_RECEIVE_POST_VIEWS = 'receivedPostViews';
export const SOCKET_COMMUNITY_SEND_POST_STATUS_UPDATE = 'statusChangePostCommunity';
export const SOCKET_COMMUNITY_RECEIVE_POST_STATUS_UPDATE = 'postStatusChange';


/*COURSE DISCUSSION ACTIONS*/
export const SOCKET_COURSE_JOIN = 'joinDiscussion';
export const SOCKET_COURSE_ADD_COMMENT = 'sendDiscussion';
export const SOCKET_COURSE_ADD_REPLY = 'sendDiscussionReply';
export const SOCKET_COURSE_RECEIVE_COMMENT = 'discussion';
export const SOCKET_COURSE_SEND_DELETE_LIKE_UNLIKE = 'sendDiscussionDeleteLikeUnlike';
export const SOCKET_COURSE_RECEIVED_DELETE_LIKE_UNLIKE = 'discussionDeleteLikeUnlike';


export const SOCKET_COURSE_SEND_COMMENT_AND_REPLY_LIKE_COUNT = 'sendCourseCommentLikeCount';
export const SOCKET_COURSE_RECEIVE_COMMENT_AND_REPLY_LIKE_COUNT = 'courseCommentLikeCount';
export const SOCKET_COURSE_SEND_COMMENT_AND_REPLY_DELETION = 'sendCourseCommentAndReplyDeletion';
export const SOCKET_COURSE_RECEIVE_COMMENT_AND_REPLY_DELETION = 'receiveCourseCommentAndReplyDeletion';

// LIVE CLASS ACTIONS
export const INIT_LIVE_CLASS_SOCKET = 'INIT_LIVE_CLASS_SOCKET';
export const CLOSE_LIVE_CLASS_SOCKET = 'CLOSE_LIVE_CLASS_SOCKET';
export const SOCKET_LIVE_CLASS_JOIN = 'joinLiveClass';
export const SOCKET_LEAVE_CLASS_JOIN = 'leaveLiveClass'
export const SOCKET_LIVE_CLASS_ADD_METIRIALS = 'broadCastClassMaterials';
export const SOCKET_LIVE_CLASS_GET_METIRIALS = 'classMaterials';
export const SOCKET_LIVE_CLASS_SEND_NEW_QUESTION = 'broadCastQNA';
export const SOCKET_LIVE_CLASS_RECEIVED_NEW_QUESTION = 'classNewQNA';

export const SOCKET_LIVE_CLASS_SEND_NEW_REPLY = 'broadCastQNAReply';
export const SOCKET_LIVE_CLASS_RECEIVED_NEW_REPLY = 'classNewQNAReply';

export const SOCKET_LIVE_CLASS_SEND_REACTION = 'broadCastReaction';

export const SOCKET_LIVE_CLASS_POLL = 'broadCastPoll';
export const SOCKET_LIVE_CLASS_POLL_STATUS_CHANGE = 'broadCastPollStatus';
export const SOCKET_LIVE_CLASS_POLL_VOTE = 'broadCastPollAnswerSubmit';
export const SOCKET_LIVE_CLASS_POLL_EDIT = 'broadCastPollAnswerEdit';
export const SOCKET_LIVE_CLASS_END_CLASS = 'broadCastEndClass';





