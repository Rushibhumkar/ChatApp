import {useEffect} from 'react';
import {MsgDataType} from '../../../utils/typescriptInterfaces';
import {showSuccessToast} from '../../../utils/toastModalFunction';

type Props = {
  forwardedMessages: MsgDataType[];
  forwardedToUserId: string;
  senderId: string;
  socket: any; // Replace `any` with `Socket` type if imported
};

const ForwardedMessageEmitter = ({
  forwardedMessages,
  forwardedToUserId,
  senderId,
  socket,
}: Props) => {
  useEffect(() => {
    if (forwardedMessages && forwardedToUserId && socket) {
      forwardedMessages.forEach(msg => {
        const forwardMsg: MsgDataType = {
          sender: senderId,
          receiver: forwardedToUserId,
          text: msg.text,
          ...(msg.attachments?.length ? {attachments: msg.attachments} : {}),
        };
        socket.emit('sendMessage', forwardMsg);
      });

      showSuccessToast({description: 'Message forwarded successfully!'});
    }
  }, [forwardedMessages, forwardedToUserId, senderId, socket]);

  return null;
};

export default ForwardedMessageEmitter;
