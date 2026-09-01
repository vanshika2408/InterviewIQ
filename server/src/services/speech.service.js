export const transcribeAudio = async ({
  audioBuffer,
  mimeType,
}) => {
  if (!audioBuffer) {
    throw new Error("Audio data is required.");
  }

  /*
   * AI speech-to-text provider will be connected here.
   *
   * For now this service provides the backend contract
   * without coupling the application to a specific provider.
   */

  return {
    text: "",
    language: "en",
    duration: 0,
    mimeType,
  };
};

export const analyzeSpeech = async ({
  transcript,
  duration = 0,
}) => {
  const words = transcript
    ? transcript.trim().split(/\s+/).length
    : 0;

  const speakingSpeed =
    duration > 0
      ? Math.round((words / duration) * 60)
      : 0;

  return {
    wordCount: words,
    speakingSpeed,
    confidence: 0,
    clarity: 0,
    fillerWords: [],
  };
};
