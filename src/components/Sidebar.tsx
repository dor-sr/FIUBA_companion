import React from 'react';
import Link from 'next/link';
import styles from './Sidebar.module.css';

export default function Sidebar() {
  return (
    <aside className={`${styles.sidebar} glass-panel`}>
      <div className={styles.header}>
        <div className={styles.logo}>
          <div className={styles.logoBadge}>F</div>
          <h2>FIUBA<span className={styles.accent}>Companion</span></h2>
        </div>
      </div>
      <nav className={styles.nav}>
        <div className={styles.navSection}>PRINCIPAL</div>
        <ul className={styles.menuList}>
          <li>
            <Link href="/" className={`${styles.menuItem} ${styles.active}`}>
              <span className={styles.menuIcon}>⌂</span> Inicio
            </Link>
          </li>
          <li>
            <Link href="/cronograma" className={styles.menuItem}>
              <span className={styles.menuIcon}>◫</span> Cronograma
            </Link>
          </li>
          <li>
            <Link href="/plan-estudios" className={styles.menuItem}>
              <span className={styles.menuIcon}>⎈</span> Plan de Estudios
            </Link>
          </li>
          <li>
            <Link href="/calendario" className={styles.menuItem}>
              <span className={styles.menuIcon}>🗓</span> Agenda Académica
            </Link>
          </li>
        </ul>
      </nav>
      <div className={styles.footer}>
        {/* Futuro: botón de perfil o inicio de sesión */}
      </div>
    </aside>
  );
}
