import React from 'react';
import styles from './page.module.css';
import CurriculumGrid from '@/components/CurriculumGrid';
import { useCurriculum } from '@/hooks/useCurriculum';

export default function PlanEstudiosPage() {
  const curriculum = useCurriculum();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleSection}>
          <h1 className="title">Plan de <span className="text-gradient">Estudios</span></h1>
          <p className="subtitle">Seguí tu progreso en la carrera, organizá tus correlativas y planificá tu futuro.</p>
        </div>
        <div className={styles.careerInfo}>
          <span className={styles.careerBadge}>Ingeniería Industrial (Plan 2020)</span>
        </div>
      </header>

      <main className={styles.mainContent}>
        <CurriculumGrid curriculum={curriculum} />
      </main>
    </div>
  );
}
