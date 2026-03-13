import * as fs from 'fs';
import * as path from 'path';
import { parseSIUText } from '../src/lib/siuParser';

const dataPath = path.join(__dirname, '../siu_data.txt');
const text = fs.readFileSync(dataPath, 'utf-8');

// Use the existing parser
const courses = parseSIUText(text);

const outputPath = path.join(__dirname, '../src/data/defaultCourses.ts');
const fileContent = `import { Course } from '../lib/siuParser'; // Or wherever the types are actually from... wait, siuParser has ParsedCourse, but in types/types we have Course? 

// Actually I should just use any or omit the explicit type parameter if I don't import it, but let's check what the parser returns.
import { ParsedCourse } from '../lib/siuParser';

export const defaultCourses: ParsedCourse[] = ${JSON.stringify(courses, null, 2)};
`;

fs.writeFileSync(outputPath, fileContent, 'utf-8');
console.log('Successfully wrote', courses.length, 'courses to defaultCourses.ts');
