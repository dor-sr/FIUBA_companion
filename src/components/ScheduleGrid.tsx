import React from 'react';
import styles from './ScheduleGrid.module.css';

export interface ScheduleEvent {
  id: string;
  day: string;
  startHour: number; // 9.5 for 9:30
  durationHours: number; // 2 for 2 hours
  title: string;
  subtitle: string;
  colorGradient: string;
  colIndex?: number;
  totalCols?: number;
}

interface ScheduleGridProps {
  events?: ScheduleEvent[];
}

export default function ScheduleGrid({ events = [] }: ScheduleGridProps) {
  const hasSaturdayEvents = events.some(e => e.day === 'Sábado');
  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  if (hasSaturdayEvents) {
    days.push('Sábado');
  }
  
  const hours = Array.from({ length: 16 }, (_, i) => i + 7); // 7:00 to 22:00

  return (
    <div className={`glass-card ${styles.scheduleWrapper}`}>
      <div 
        className={styles.scheduleGrid}
        style={{ gridTemplateColumns: `60px repeat(${days.length}, minmax(140px, 1fr))` }}
      >
        {/* Empty top-left corner */}
        <div className={styles.timeColumnHeader}></div>
        
        {/* Days Header */}
        {days.map((day) => (
          <div key={day} className={styles.dayHeader}>
            {day}
          </div>
        ))}

        {/* Time Rows */}
        {hours.map((hour) => (
          <React.Fragment key={hour}>
            <div className={styles.timeCell}>
              {`${hour}:00`}
            </div>
            {days.map((day) => {
              // Find all events starting in this hour-cell
              const eventsStartingHere = events.filter(e => e.day === day && Math.floor(e.startHour) === hour);

              return (
                <div key={`${day}-${hour}`} className={styles.gridCell}>
                  {eventsStartingHere.map(event => {
                    const colIndex = event.colIndex || 0;
                    const totalCols = event.totalCols || 1;
                    const widthPct = 100 / totalCols;
                    const leftPct = colIndex * widthPct;

                    return (
                      <div 
                        key={event.id}
                        className={styles.courseBlock} 
                        style={{ 
                          top: `calc(${(event.startHour - hour) * 100}% + 3px)`,
                          height: `calc(${event.durationHours * 100}% - 6px)`,
                          left: `calc(${leftPct}% + 4px)`,
                          width: `calc(${widthPct}% - 8px)`,
                          background: event.colorGradient,
                          boxShadow: `0 4px 12px ${(event.colorGradient.match(/#([0-9a-fA-F]{6})/) || [])[0] || '#000000'}40`
                        }}
                      >
                        <p className={styles.blockTitle}>{event.title}</p>
                        <p className={styles.blockLocation}>{event.subtitle}</p>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
