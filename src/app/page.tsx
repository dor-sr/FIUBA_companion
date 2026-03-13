import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.greeting}>
          <div className={styles.badge}>Plataforma Estudiantil</div>
          <h1>Optimiza tu Trayectoria en <span className={styles.highlight}>FIUBA</span></h1>
          <p>La herramienta definitiva para la planificación académica de futuros ingenieros. Diseñada para darte control total sobre tus horarios, materias correlativas y fechas clave.</p>
        </div>
      </header>

      <div className={styles.grid}>
        <div className={`glass-card ${styles.card}`}>
          <div className={styles.cardHeader}>
            <div className={styles.iconWrapper}>
              <span className={styles.icon}>📅</span>
            </div>
            <h3>Cronograma Interactivo</h3>
          </div>
          <p>Sincroniza y visualiza tu disponibilidad. Modela combinaciones de cátedras y horarios para asegurar el semestre perfecto antes de inscribirte en el SIU.</p>
          <button className={styles.primaryButton}>Cargar Horarios</button>
        </div>

        <div className={`glass-card ${styles.card}`}>
          <div className={styles.cardHeader}>
            <div className={styles.iconWrapper}>
              <span className={styles.icon}>🎓</span>
            </div>
            <h3>Seguimiento Curricular</h3>
          </div>
          <p>Analiza el estado de tu plan de estudios. Calcula promedios simulados, visualiza correlatividades y proyecta tu graduación con precisión estadística.</p>
          <button className={styles.secondaryButton}>Ver Plan de Estudios</button>
        </div>

        <div className={`glass-card ${styles.card}`}>
          <div className={styles.cardHeader}>
            <div className={styles.iconWrapper}>
              <span className={styles.icon}>📆</span>
            </div>
            <h3>Agenda Académica</h3>
          </div>
          <p>Mantente al tanto del calendario oficial de la Facultad. Recibe alertas estratégicas sobre periodos de inscripción, fechas de finales y plazos administrativos.</p>
          <button className={styles.secondaryButton}>Consultar Fechas</button>
        </div>
      </div>
    </div>
  );
}
