
export const validateMessage = (data) => {
  // Check if message exists and isn't empty
  if (!data.content || data.content.trim() === '') {
    return 'Message cannot be empty';
  }
  
  // Don't let people spam huge messages
  if (data.content.length > 500) {
    return 'Message too long (max 500 characters)';
  }
  
  return null; 
};

export const validatePrivateMessage = (data) => {
  // First check the message itself
  const messageError = validateMessage(data);
  if (messageError) return messageError;
  
  // Check if they specified who to send to
  if (!data.toUserId) {
    return 'Must specify recipient';
  }
  
  return null; 
};

export const validateGroupMessage = (data) => {
  // First check the message itself  
  const messageError = validateMessage(data);
  if (messageError) return messageError;
  
  // Check if they specified which group
  if (!data.groupId) {
    return 'Must specify group';
  }
  
  return null; 
};
