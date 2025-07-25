import React, {useEffect, useRef, useState} from 'react';
import {
  FlatList,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
} from 'react-native';
import CustomModal from '../CustomModal';
import {color} from '../../const/color';
import {shadow} from '../../sharedStyles';
import CustomAvatar from '../CustomAvatar';
import CustomText from '../CustomText';
import {sizes} from '../../const';

type CommentType = {
  id: string;
  text: string;
  user: {
    name: string;
    avatar?: string;
  };
  time: string;
  liked: boolean;
  likeCount: number;
  replies?: CommentType[];
};

type Props = {
  visible: boolean;
  onClose: () => void;
};

const dummyComments: CommentType[] = [
  {
    id: '1',
    text: 'This is the first comment',
    time: '1w',
    liked: false,
    likeCount: 3,
    user: {name: 'Amit Singh', avatar: undefined},
    replies: [
      {
        id: '1-1',
        text: 'First reply',
        time: '6d',
        liked: false,
        likeCount: 0,
        user: {name: 'Nidhi Patel'},
      },
    ],
  },
  {
    id: '2',
    text: 'Another comment without reply',
    time: '1d',
    liked: true,
    likeCount: 12,
    user: {name: 'Karan Kapoor'},
  },
];

const CommentsModal = ({visible, onClose}: Props) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [replyTo, setReplyTo] = useState<CommentType | null>(null);
  const [replyText, setReplyText] = useState('');
  const inputRef = useRef<TextInput>(null);
  const lastTapRef = useRef<number | null>(null);

  useEffect(() => {
    if (!visible) {
      setReplyTo(null);
      setReplyText('');
    }
  }, [visible]);

  const getAllComments = (comments: CommentType[]): CommentType[] => {
    return comments.flatMap(comment => [
      comment,
      ...(comment.replies ? getAllComments(comment.replies) : []),
    ]);
  };

  const allComments = getAllComments(dummyComments);

  const [likes, setLikes] = useState<Record<string, boolean>>(
    Object.fromEntries(allComments.map(item => [item.id, item.liked])),
  );
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>(
    Object.fromEntries(allComments.map(item => [item.id, item.likeCount])),
  );

  const toggleExpand = (id: string) => {
    setExpanded(prev => ({...prev, [id]: !prev[id]}));
  };

  const toggleLike = (id: string) => {
    setLikes(prev => ({...prev, [id]: !prev[id]}));
    setLikeCounts(prev => ({
      ...prev,
      [id]: prev[id] + (likes[id] ? -1 : 1),
    }));
  };

  const renderComment = (item: CommentType, isReply = false) => (
    <View style={styles.commentRow}>
      {/* Avatar */}
      <CustomAvatar
        name={item.user.name}
        imgUrl={item.user.avatar}
        imgStyle={styles.avatar}
        style={isReply && styles.replyAvatar}
      />

      {/* Content */}
      <View style={styles.commentContent}>
        <TouchableOpacity onPress={() => toggleExpand(item.id)}>
          <View style={styles.headerRow}>
            <Text style={[styles.userName, isReply && styles.replyUserName]}>
              {item.user.name}
            </Text>
            <Text style={[styles.timeText, isReply && styles.replyTimeText]}>
              · {item.time}
            </Text>
          </View>
          <Text style={styles.commentText}>{item.text}</Text>
        </TouchableOpacity>

        {/* Action Row */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            onPress={() => {
              setReplyTo(item);
              setExpanded(prev => ({...prev, [item.id]: true}));
              setTimeout(() => {
                inputRef.current?.focus();
              }, 100);
            }}>
            <CustomText style={styles.replyText}>Reply</CustomText>
          </TouchableOpacity>
        </View>
      </View>

      {/* Like Button */}
      <View style={styles.likeColumn}>
        <TouchableOpacity onPress={() => toggleLike(item.id)}>
          <Image
            source={
              likes[item.id]
                ? require('../../assets/icons/heartFilled.png')
                : require('../../assets/icons/heartOutline.png')
            }
            style={styles.likeIcon}
          />
        </TouchableOpacity>
        <Text style={styles.likeCount}>{likeCounts[item.id]}</Text>
      </View>
    </View>
  );

  const renderItem = ({item}: {item: CommentType}) => (
    <View style={styles.commentWrapper}>
      {renderComment(item)}
      {expanded[item.id] &&
        item.replies?.map(reply => (
          <View key={reply.id} style={styles.replyWrapper}>
            {renderComment(reply, true)}
          </View>
        ))}
    </View>
  );

  return (
    <CustomModal
      visible={visible}
      onClose={onClose}
      containerStyle={styles.modalContent}
      customBgStyle={styles.modalBackground}>
      <Text style={styles.modalTitle}>Comments</Text>
      <FlatList
        data={dummyComments}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{paddingBottom: 40}}
        showsVerticalScrollIndicator={false}
      />
      {replyTo && expanded[replyTo.id] && (
        <View style={styles.replyInputContainer}>
          <CustomAvatar
            name={replyTo.user.name}
            imgStyle={styles.myAvatar}
            style={{height: 22, width: 22}}
          />

          <View style={styles.replyInputBox}>
            <Text style={styles.replyingToText}>
              Replying to {replyTo.user.name}
            </Text>
            <TextInput
              ref={inputRef}
              placeholder="Write a reply..."
              value={replyText}
              onChangeText={setReplyText}
              style={styles.textInput}
              placeholderTextColor={'grey'}
            />
          </View>

          <TouchableOpacity
            style={styles.sendBtn}
            onPress={() => {
              console.log('Reply:', replyText);
              setReplyText('');
              setReplyTo(null);
            }}>
            <Image
              source={require('../../assets/icons/rightArrow.png')}
              style={styles.sendIcon}
            />
          </TouchableOpacity>
        </View>
      )}
    </CustomModal>
  );
};

export default CommentsModal;

const styles = StyleSheet.create({
  modalBackground: {
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '75%',
    width: '100%',
    padding: 20,
    borderBottomEndRadius: 0,
    borderBottomStartRadius: 0,
  },
  modalTitle: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 10,
    color: color.titleColor,
    ...shadow,
    alignSelf: 'center',
  },
  commentWrapper: {
    marginBottom: 24,
  },
  commentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatar: {
    height: 36,
    width: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  commentContent: {
    flex: 1,
    marginLeft: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#111',
  },
  timeText: {
    fontSize: 12,
    color: '#888',
  },
  commentText: {
    fontSize: 13,
    color: '#333',
    marginTop: 2,
  },
  actionRow: {
    marginTop: 6,
  },
  replyText: {
    fontSize: 13,
    color: 'grey',
    fontWeight: '600',
  },
  likeColumn: {
    alignItems: 'center',
    marginLeft: 10,
  },
  likeIcon: {
    width: 20,
    height: 20,
  },
  likeCount: {
    fontSize: 12,
    marginTop: 4,
    color: '#444',
  },
  replyWrapper: {
    marginLeft: 46,
    marginTop: 16,
  },
  replyAvatar: {
    width: 22,
    height: 22,
    borderRadius: 14,
  },

  replyUserName: {
    fontSize: 13,
  },

  replyTimeText: {
    fontSize: 11,
  },
  replyInputContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ddd',
    paddingTop: 8,
  },

  myAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
  },

  replyInputBox: {
    flex: 1,
    backgroundColor: '#fff',
    width: '100%',
    marginLeft: 12,
  },

  replyingToText: {
    fontSize: 12,
    color: '#888',
    marginBottom: 2,
  },

  textInput: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 24,
    color: color.titleColor,
  },

  sendBtn: {
    paddingLeft: 10,
    justifyContent: 'center',
    backgroundColor: color.mainColor,
    marginTop: 16,
    paddingHorizontal: 10,
    borderRadius: 50,
    marginLeft: 8,
    alignItems: 'center',
  },

  sendIcon: {
    width: 20,
    height: 20,
    tintColor: '#fff',
  },
});
