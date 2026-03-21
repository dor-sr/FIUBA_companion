import React, { useState } from 'react';
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
  isCustom?: boolean;
}

interface ScheduleGridProps {
  events?: ScheduleEvent[];
  hiddenEventIds?: string[];
  onEventClick?: (eventId: string) => void;
  onSlotCreate?: (day: string, startHour: number, durationHours: number) => void;
}

export default function ScheduleGrid({ 
  events = [], 
  hiddenEventIds = [], 
  onEventClick,
  onSlotCreate
}: ScheduleGridProps) {
  const hasSaturdayEvents = events.some(e => e.day === 'Sábado');
  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  if (hasSaturdayEvents) {
    days.push('Sábado');
  }
  
  const hours = Array.from({ length: 16 }, (_, i) => i + 7); // 7:00 to 22:00

  // Drag state
  const [dragStart, setDragStart] = useState<{ day: string; hour: number } | null>(null);
  const [dragCurrent, setDragCurrent] = useState<{ day: string; hour: number } | null>(null);

  const handleMouseDown = (day: string, hour: number) => {
    setDragStart({ day, hour });
    setDragCurrent({ day, hour });
  };

  const handleMouseEnter = (day: string, hour: number) => {
    if (dragStart) {
      setDragCurrent({ day, hour });
    }
  };

  const handleMouseUp = () => {
    if (dragStart && dragCurrent && onSlotCreate) {
      if (dragStart.day === dragCurrent.day) {
        const start = Math.min(dragStart.hour, dragCurrent.hour);
        const end = Math.max(dragStart.hour, dragCurrent.hour) + 1; // +1 to cover the hour block
        onSlotCreate(dragStart.day, start, end - start);
      }
    }
    setDragStart(null);
    setDragCurrent(null);
  };

  const handleMouseLeaveGrid = () => {
    setDragStart(null);
    setDragCurrent(null);
  };

  return (
    <div className={`glass-card ${styles.scheduleWrapper}`}>
      <div 
        className={styles.scheduleGrid}
        style={{ 
          gridTemplateColumns: `60px repeat(${days.length}, minmax(140px, 1fr))`,
          gridTemplateRows: `auto repeat(16, minmax(45px, 1fr))`
        }}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeaveGrid}
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

              // Check if we are dragging over this cell
              let isGhostHere = false;
              let ghostHeight = 0;
              let ghostTop = 0;

              if (dragStart && dragCurrent && dragStart.day === day && dragCurrent.day === day) {
                const minHour = Math.min(dragStart.hour, dragCurrent.hour);
                const maxHour = Math.max(dragStart.hour, dragCurrent.hour);
                if (hour === minHour) {
                  isGhostHere = true;
                  ghostHeight = (maxHour - minHour + 1) * 100; // percentages
                }
              }

              return (
                <div 
                  key={`${day}-${hour}`} 
                  className={styles.gridCell}
                  onMouseDown={(e) => {
                    // Start drag if clicking on the empty cell, not an event
                    if (e.target === e.currentTarget) {
                      e.preventDefault();
                      handleMouseDown(day, hour);
                    }
                  }}
                  onMouseEnter={() => handleMouseEnter(day, hour)}
                >
                  {isGhostHere && (
                    <div 
                      className={styles.ghostBlock}
                      style={{
                        top: `3px`,
                        height: `calc(${ghostHeight}% - 6px)`,
                        left: '4px',
                        width: 'calc(100% - 8px)'
                      }}
                    ></div>
                  )}

                  {eventsStartingHere.map(event => {
                    const colIndex = event.colIndex || 0;
                    const totalCols = event.totalCols || 1;
                    const widthPct = 100 / totalCols;
                    const leftPct = colIndex * widthPct;
                    const isHidden = hiddenEventIds.includes(event.id);

                    return (
                      <div 
                        key={event.id}
                        className={`${styles.courseBlock} ${isHidden ? styles.crossedOut : ''}`} 
                        style={{ 
                          top: `calc(${(event.startHour - hour) * 100}% + 3px)`,
                          height: `calc(${event.durationHours * 100}% - 6px)`,
                          left: `calc(${leftPct}% + 4px)`,
                          width: `calc(${widthPct}% - 8px)`,
                          background: event.colorGradient,
                          boxShadow: `0 4px 12px ${(event.colorGradient.match(/#([0-9a-fA-F]{6})/) || [])[0] || '#000000'}40`,
                          cursor: onEventClick ? 'pointer' : 'default'
                        }}
                        onClick={() => onEventClick && onEventClick(event.id)}
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
