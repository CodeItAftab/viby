const formatMessages = (messages) => {
  const processedMessages = [];
  let lastDate = null;
  const allMessages = [...messages].reverse();
  allMessages.forEach((message) => {
    const messageDate = new Date(message?.createdAt);
    if (messageDate.getDate() !== lastDate) {
      processedMessages.push({
        type: "date",
        date: messageDate,
      });
    }
    processedMessages.push(message);
    lastDate = messageDate.getDate();
  });
  return processedMessages;
};

export { formatMessages };
