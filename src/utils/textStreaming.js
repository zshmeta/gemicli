import React, { useEffect, useState } from 'react';
import { Text } from 'ink';
import chalk from 'chalk';

const TextStreaming = ({ text }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timeoutId = setTimeout(() => {
        setDisplayedText((prev) => prev + text[index]);
        setIndex(index + 1);
      }, 50); // Adjust the delay as needed
      return () => clearTimeout(timeoutId);
    }
  }, [index, text]);

  return <Text color="limegreen">{displayedText}</Text>;
};

export { TextStreaming };
