import type { WordList } from '../types/crossword';

const maxWordLength = 15;
const wildcard = '.';

export enum PatternPosition {
  Exact,
  Beginning,
  Middle,
  End,
}

export enum AlternateLetterMatch {
  DontAlternate,
  Alternate,
}

export function findMatchingWords(
  pattern: string,
  patternPosition: PatternPosition,
  alternatingLetters: AlternateLetterMatch,
  wordList: WordList
): string[] {
  let matches: string[] = [];
  if (pattern === '') {
    return matches;
  }

  const exactPatterns = getExactPatterns(pattern, patternPosition, alternatingLetters);

  for (const exactPattern of exactPatterns) {
    const wordsOfSameLength = wordList[exactPattern.length];
    if (!wordsOfSameLength) continue;
    const regex = new RegExp(
      exactPattern
        .toLowerCase()
        .replaceAll('.', '\\w')
        .replaceAll(' ', '\\w')
    );

    Object.keys(wordsOfSameLength).forEach(candidate => {
      if (regex.test(candidate)) {
        matches = matches.concat(wordsOfSameLength[candidate]);
      }
    });
  }
  return matches.sort();
}

function getExactPatterns(
  pattern: string,
  patternPosition: PatternPosition,
  alternatingLetters: AlternateLetterMatch
): string[] {
  if (alternatingLetters === AlternateLetterMatch.Alternate) {
    return getAlternatingPatterns(pattern, patternPosition);
  } else {
    switch (patternPosition) {
      case PatternPosition.Exact:
        return [pattern];
      case PatternPosition.Beginning:
        return getBeginningPatterns(pattern);
      case PatternPosition.End:
        return getEndPatterns(pattern);
      case PatternPosition.Middle:
        return getMiddlePatterns(pattern);
      default:
        throw 'Unrecognised PatternPosition value: ' + patternPosition;
    }
  }
}

function getAlternatingPatterns(pattern: string, patternPosition: PatternPosition): string[] {
  const letters = pattern.split('');
  const alternating = letters.join(wildcard);

  switch (patternPosition) {
    case PatternPosition.Exact:
      return [
        alternating,
        alternating + wildcard,
        wildcard + alternating,
        wildcard + alternating + wildcard,
      ];
    case PatternPosition.Beginning:
      return getBeginningPatterns(alternating).concat(
        getBeginningPatterns(wildcard + alternating)
      );
    case PatternPosition.End:
      return getEndPatterns(alternating).concat(getEndPatterns(alternating + wildcard));
    case PatternPosition.Middle:
      return getMiddlePatterns(alternating);
    default:
      throw 'Unrecognised PatternPosition value: ' + patternPosition;
  }
}

function getBeginningPatterns(pattern: string): string[] {
  if (pattern.length >= maxWordLength - 1) {
    return [];
  }

  const patterns = [pattern + wildcard];
  for (let i = pattern.length + 1; i < maxWordLength; i++) {
    patterns.push(patterns[patterns.length - 1] + wildcard);
  }

  return patterns;
}

function getEndPatterns(pattern: string): string[] {
  if (pattern.length >= maxWordLength - 1) {
    return [];
  }

  const patterns = [wildcard + pattern];
  for (let i = pattern.length + 1; i < maxWordLength; i++) {
    patterns.push(wildcard + patterns[patterns.length - 1]);
  }

  return patterns;
}

function getMiddlePatterns(pattern: string): string[] {
  if (pattern.length >= maxWordLength - 2) {
    return [];
  }

  let patterns: string[] = [];
  const beginningPatterns = getBeginningPatterns(wildcard + pattern);

  for (const beginningPattern of beginningPatterns) {
    patterns.push(beginningPattern);
    patterns = patterns.concat(getEndPatterns(beginningPattern));
  }

  return patterns;
}
