import { EventSourceData } from '@type/api';

// Add type alias for special string literals
type SpecialString = '[DONE]' | ': joining queue';

export const parseEventSource = (data: string): EventSourceData[] => {
  const jsonString = `[${data
    .split('\n')
    .filter((line) => !!line && !line.startsWith(':'))
    .map((line) => line.replace(/^data: /, ''))
    .join(',')}]`;

  try {
    const json = JSON.parse(jsonString);

    if (Array.isArray(json)) {
      return json.filter((data) => data && typeof data === 'object') as EventSourceData[];
    } else {
      throw new Error();
    }
  } catch (error) {
    throw new Error('Failed to parse data from the event source.');
  }
};



export const createMultipartRelatedBody = (
  metadata: object,
  file: File,
  boundary: string
): Blob => {
  const encoder = new TextEncoder();

  const metadataPart = encoder.encode(
    `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(
      metadata
    )}\r\n`
  );
  const filePart = encoder.encode(
    `--${boundary}\r\nContent-Type: ${file.type}\r\n\r\n`
  );
  const endBoundary = encoder.encode(`\r\n--${boundary}--`);

  return new Blob([metadataPart, filePart, file, endBoundary], {
    type: 'multipart/related; boundary=' + boundary,
  });
};
