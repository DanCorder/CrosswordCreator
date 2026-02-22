export function getAnswerLength(answer: string): string {
  const parts: (number | string)[] = [];

  for (const char of answer) {
    if (char === ' ') {
      parts.push(',');
    } else if (char === '-') {
      parts.push('-');
    } else {
      const last = parts[parts.length - 1];
      if (parts.length === 0 || last === ',' || last === '-') {
        parts.push(1);
      } else {
        parts[parts.length - 1] = (last as number) + 1;
      }
    }
  }

  return parts.join('');
}
