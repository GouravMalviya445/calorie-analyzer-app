
const extractJSON = (str: string) => {
  const match = str.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  return JSON.parse(match ? match[1] : str); // fallback: assume raw JSON if no code block
};

export {extractJSON}