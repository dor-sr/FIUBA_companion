export interface ParsedClass {
  type: string;
  day: string; // e.g., 'Lunes', 'Martes'
  startTime: string; // e.g., '09:00'
  endTime: string; // e.g., '13:00'
  location: string; // e.g., '403 - PC'
}

export interface ParsedCommission {
  name: string; // e.g., 'CURSO: 01A'
  teachers: string; // e.g., 'VARGAS GABRIELA (Profesor/a Adjunto/a)'
  classes: ParsedClass[];
}

export interface ParsedCourse {
  code: string; // e.g., 'CB002'
  name: string; // e.g., 'ÁLGEBRA LINEAL'
  commissions: ParsedCommission[];
}

/**
 * Parses a raw copy-paste text from the FIUBA SIU Guaraní "Oferta de comisiones" page.
 * Extracts only the courses and commissions for the latest available "Período lectivo".
 */
export function parseSIUText(text: string): ParsedCourse[] {
  const result: ParsedCourse[] = [];
  
  // 1. Split by "Período lectivo:" to get the latest period (it's always at the bottom)
  const periods = text.split(/Período lectivo:\s*/);
  if (periods.length < 2) return []; // No period found

  const latestPeriodText = periods[periods.length - 1];

  // 2. Split by "Actividad:" to get each course
  const activities = latestPeriodText.split(/Actividad:\s*/).slice(1);

  for (const activityText of activities) {
    // The first line is the course name and code: "ÁLGEBRA LINEAL (CB002)"
    const activityLines = activityText.split('\n');
    if (activityLines.length === 0) continue;

    const activityHeader = activityLines[0].trim();
    const match = activityHeader.match(/(.+?)(?:\s\(([\w\d]+)\))?$/);
    const courseName = match ? match[1].trim() : activityHeader;
    const courseCode = match && match[2] ? match[2].trim() : '';

    const course: ParsedCourse = {
      code: courseCode,
      name: courseName,
      commissions: []
    };

    // 3. Split activity into commissions
    const commissionsText = activityText.split(/Comisión:\s*/).slice(1);

    for (const commText of commissionsText) {
      const commLines = commText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
      if (commLines.length === 0) continue;

      const commissionName = commLines[0]; // e.g., "CURSO: 01A"
      if (commissionName.toUpperCase() === 'CONDICIONALES') continue;

      const commission: ParsedCommission = {
        name: commissionName,
        teachers: '',
        classes: []
      };

      let i = 1;
      // Look for teachers
      while (i < commLines.length) {
        if (commLines[i].startsWith('Docentes:')) {
          commission.teachers = commLines[i].replace('Docentes:', '').trim();
        }
        if (commLines[i].startsWith('Tipo de clase\tDía')) {
          i++; // Skip the header row
          break;
        }
        i++;
      }

      // Parse schedule table rows
      while (i < commLines.length) {
        const line = commLines[i];
        if (line.startsWith('Comisión:') || line.startsWith('Actividad:') || !line.includes('\t')) {
          break; // Next logical block started, or invalid row
        }

        const cols = line.split('\t');
        if (cols.length >= 4) {
          const type = cols[0].trim();
          const day = cols[1].trim();
          
          if (day !== 'Sin definir') {
            const timeRange = cols[2].trim(); // "09:00 a 11:00"
            const times = timeRange.split(' a ');
            const location = cols[3].trim();

            commission.classes.push({
              type: type,
              day: day,
              startTime: times[0]?.trim() || '',
              endTime: times[1]?.trim() || '',
              location: location
            });
          }
        }
        i++;
      }

      course.commissions.push(commission);
    }

    if (course.commissions.length > 0) {
      result.push(course);
    }
  }

  return result;
}
