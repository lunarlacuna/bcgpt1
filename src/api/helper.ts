import { EventSourceData } from '@type/api';

// Add type alias for special string literals
type SpecialString = '[DONE]' | ': joining queue';

export const parseEventSource = (
  data: string
): SpecialString | EventSourceData[] => {
  const result = data
    .split('\n\n')
    .filter(Boolean)
    .map((chunk) => {
      const jsonString = chunk
        .split('\n')
        .map((line) => line.replace(/^data: /, ''))
        .join('');

      if (jsonString === '[DONE]' || jsonString === ': joining queue') {
        // Return the special string as-is
        return jsonString as SpecialString;
      }

      // Check if the JSON string is valid
      try {
        const json = JSON.parse(jsonString);
        return json;
      } catch {
        // If the JSON string is not valid, return it as a plain string
        return jsonString;
      }
    });
  return result;
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
