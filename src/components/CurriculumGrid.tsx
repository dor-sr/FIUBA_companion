"use client";

import React, { useState } from 'react';
import styles from './CurriculumGrid.module.css';
import { Subject, AcademicPeriod } from '../data/industrial2020';
import { useCurriculum, SubjectState } from '../hooks/useCurriculum';

interface CurriculumGridProps {
  curriculum: ReturnType<typeof useCurriculum>;
}

export default function CurriculumGrid({ curriculum }: CurriculumGridProps) {
  const { periods, getSubjectState, toggleSubjectState, totalCredits, isLoaded } = curriculum;
  
  const [hoveredSubjectId, setHoveredSubjectId] = useState<string | null>(null);

  if (!isLoaded) return null;

  // Flatten subjects for easy lookup
  const allSubjects = periods.flatMap(p => p.subjects);
  
  // Recursively find all prerequisites (correlatives)
  const getPrerequisites = (subjectId: string, acc: Set<string> = new Set()): Set<string> => {
    const subj = allSubjects.find(s => s.id === subjectId);
    if (!subj) return acc;
    subj.correlatives.forEach(corrId => {
      if (!acc.has(corrId) && !corrId.startsWith('CRED-')) {
        acc.add(corrId);
        getPrerequisites(corrId, acc);
      }
    });
    return acc;
  };

  // Recursively find all postrequisites (subjects that require this one)
  const getPostrequisites = (subjectId: string, acc: Set<string> = new Set()): Set<string> => {
    allSubjects.forEach(s => {
      if (s.correlatives.includes(subjectId) && !acc.has(s.id)) {
        acc.add(s.id);
        getPostrequisites(s.id, acc);
      }
    });
    return acc;
  };

  const hoveredPrereqs = hoveredSubjectId ? getPrerequisites(hoveredSubjectId) : new Set<string>();
  const hoveredPostreqs = hoveredSubjectId ? getPostrequisites(hoveredSubjectId) : new Set<string>();

  const getSubjectClass = (state: SubjectState, id: string) => {
    let classes = [styles.node, styles[state], 'glass-panel'];
    
    if (hoveredSubjectId) {
      if (id === hoveredSubjectId) {
        classes.push(styles.hoveredMain);
      } else if (hoveredPrereqs.has(id)) {
        classes.push(styles.hoveredPrereq);
      } else if (hoveredPostreqs.has(id)) {
        classes.push(styles.hoveredPostreq);
      } else {
        classes.push(styles.dimmed);
      }
    }
    
    return classes.join(' ');
  };

  const getSubTitleClass = (state: SubjectState) => {
    switch (state) {
      case 'passed': return 'Aprobada';
      case 'in-progress': return 'Cursando';
      case 'available': return 'Disponible';
      case 'locked': return 'Bloqueada';
      default: return '';
    }
  };

  const handleNodeClick = (subject: Subject) => {
    const currentState = getSubjectState(subject);
    if (currentState === 'locked') return;

    if (currentState === 'available') {
      toggleSubjectState(subject.id, 'in-progress');
    } else if (currentState === 'in-progress') {
      toggleSubjectState(subject.id, 'passed');
    } else if (currentState === 'passed') {
      toggleSubjectState(subject.id, 'clear');
    }
  };

  return (
    <div className={styles.gridContainer}>
      <header className={styles.header}>
        <div className={styles.creditsDisplay}>
          <span className={styles.creditsLabel}>Créditos Aprobados</span>
          <span className={styles.creditsValue}>{totalCredits}</span>
        </div>
        
        <div className={styles.legend}>
          <div className={`${styles.legendItem} ${styles.passed}`}><span className={styles.dot}></span>Aprobada</div>
          <div className={`${styles.legendItem} ${styles.inProgress}`}><span className={styles.dot}></span>Cursando</div>
          <div className={`${styles.legendItem} ${styles.available}`}><span className={styles.dot}></span>Disponible</div>
          <div className={`${styles.legendItem} ${styles.locked}`}><span className={styles.dot}></span>Bloqueada</div>
        </div>
      </header>

      <div className={styles.timeline}>
        {periods.map((period) => (
          <section key={period.id} className={styles.periodSection}>
            <h3 className={styles.periodTitle}>{period.title}</h3>
            <div className={styles.nodesContainer}>
              {period.subjects.map((subject) => {
                const state = getSubjectState(subject);
                return (
                  <div
                    key={subject.id}
                    className={getSubjectClass(state, subject.id)}
                    onClick={() => handleNodeClick(subject)}
                    onMouseEnter={() => setHoveredSubjectId(subject.id)}
                    onMouseLeave={() => setHoveredSubjectId(null)}
                  >
                    <div className={styles.nodeHeader}>
                      <span className={styles.nodeId}>{subject.id}</span>
                      <span className={styles.nodeCredits}>{subject.credits} CR</span>
                    </div>
                    <div className={styles.nodeName}>{subject.name}</div>
                    <div className={styles.nodeStatus}>{getSubTitleClass(state)}</div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
