"use client";

import React, { useState, useMemo, useEffect, useRef } from 'react';
import styles from './page.module.css';
import ScheduleGrid, { ScheduleEvent } from '@/components/ScheduleGrid';
import { parseSIUText, ParsedCourse } from '@/lib/siuParser';
import { defaultCourses } from '@/data/defaultCourses';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface Plan {
  id: string;
  name: string;
  selectedCourses: ParsedCourse[];
  selectedCommissions: Record<string, string>;
}

export default function CronogramaPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Data States
  const [availableCourses, setAvailableCourses] = useState<ParsedCourse[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [activePlanId, setActivePlanId] = useState<string>('');
  
  // UI States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [siuText, setSiuText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);

  const scheduleRef = useRef<HTMLDivElement>(null);

  // Load from LocalStorage on mount
  useEffect(() => {
    let initialCourses = defaultCourses;
    const storedCourses = localStorage.getItem('fiuba_available_courses');
    if (storedCourses) {
      try {
        initialCourses = JSON.parse(storedCourses);
      } catch (e) {
        console.error('Failed to parse courses from local storage', e);
      }
    } else {
      localStorage.setItem('fiuba_available_courses', JSON.stringify(defaultCourses));
    }

    // Using setTimeout resolves the synchronous setState cascading render warning
    setTimeout(() => {
      setAvailableCourses(initialCourses);
      
      const storedPlans = localStorage.getItem('fiuba_plans');
      const storedActivePlan = localStorage.getItem('fiuba_active_plan');
      
      if (storedPlans) {
        const parsedPlans = JSON.parse(storedPlans);
        setPlans(parsedPlans);
        if (storedActivePlan && parsedPlans.find((p: Plan) => p.id === storedActivePlan)) {
          setActivePlanId(storedActivePlan);
        } else {
          setActivePlanId(parsedPlans[0].id);
        }
      } else {
        const initialPlan: Plan = { id: 'plan-1', name: 'Plan 1', selectedCourses: [], selectedCommissions: {} };
        setPlans([initialPlan]);
        setActivePlanId('plan-1');
        localStorage.setItem('fiuba_plans', JSON.stringify([initialPlan]));
        localStorage.setItem('fiuba_active_plan', 'plan-1');
      }
      
      setIsLoaded(true);
    }, 0);
  }, []);

  // Update localStorage whenever plans or active plan change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('fiuba_plans', JSON.stringify(plans));
      localStorage.setItem('fiuba_active_plan', activePlanId);
    }
  }, [plans, activePlanId, isLoaded]);

  const activePlan = useMemo(() => plans.find(p => p.id === activePlanId) || plans[0], [plans, activePlanId]);
  const selectedCourses = useMemo(() => activePlan?.selectedCourses || [], [activePlan]);
  const selectedCommissions = useMemo(() => activePlan?.selectedCommissions || {}, [activePlan]);

  const handleParse = () => {
    try {
      const parsed = parseSIUText(siuText);
      console.log('Parsed SIU Data:', parsed);
      setAvailableCourses(parsed);
      localStorage.setItem('fiuba_available_courses', JSON.stringify(parsed));
      setIsModalOpen(false);
      setSiuText('');
    } catch (error) {
      console.error('Failed to parse SIU data', error);
      alert('Hubo un error al leer los datos. Asegúrate de copiar bien la tabla de "Oferta de comisiones".');
    }
  };

  const handleAddCourse = (course: ParsedCourse) => {
    if (!selectedCourses.find(c => c.code === course.code)) {
      setPlans(prevPlans => prevPlans.map(p => {
        if (p.id === activePlanId) {
          return { ...p, selectedCourses: [...p.selectedCourses, course] };
        }
        return p;
      }));
      setExpandedCourse(course.code);
    }
    setSearchQuery('');
    setIsSearchFocused(false);
  };

  const handleRemoveCourse = (courseCode: string) => {
    setPlans(prevPlans => prevPlans.map(p => {
      if (p.id === activePlanId) {
        const newCommissions = { ...p.selectedCommissions };
        delete newCommissions[courseCode];
        return { 
          ...p, 
          selectedCourses: p.selectedCourses.filter(c => c.code !== courseCode),
          selectedCommissions: newCommissions
        };
      }
      return p;
    }));
    
    if (expandedCourse === courseCode) {
      setExpandedCourse(null);
    }
  };

  const toggleCourseExpand = (courseCode: string) => {
    setExpandedCourse(prev => prev === courseCode ? null : courseCode);
  };

  const handleSelectCommission = (courseCode: string, commissionName: string) => {
    setPlans(prevPlans => prevPlans.map(p => {
      if (p.id === activePlanId) {
        const newCommissions = { ...p.selectedCommissions };
        if (newCommissions[courseCode] === commissionName) {
          delete newCommissions[courseCode];
        } else {
          newCommissions[courseCode] = commissionName;
        }
        return { ...p, selectedCommissions: newCommissions };
      }
      return p;
    }));
  };

  const addNewPlan = () => {
    const newId = `plan-${Date.now()}`;
    const newPlanName = `Plan ${plans.length + 1}`;
    setPlans([...plans, { id: newId, name: newPlanName, selectedCourses: [], selectedCommissions: {} }]);
    setActivePlanId(newId);
  };

  const handleRenamePlan = (planId: string, currentName: string) => {
    const newName = window.prompt("Ingresa el nuevo nombre para tu plan:", currentName);
    if (newName && newName.trim() !== "") {
      setPlans(prevPlans => prevPlans.map(p => 
        p.id === planId ? { ...p, name: newName.trim() } : p
      ));
    }
  };

  const handleClearPlan = () => {
    if (window.confirm(`¿Estás seguro de que deseas quitar todas las materias del "${activePlan?.name}"?`)) {
      setPlans(prevPlans => prevPlans.map(p => {
        if (p.id === activePlanId) {
          return { ...p, selectedCourses: [], selectedCommissions: {} };
        }
        return p;
      }));
    }
    setIsActionMenuOpen(false);
  };

  const handleDeletePlan = () => {
    if (plans.length <= 1) {
      alert("No puedes eliminar el único plan que tienes. Puedes vaciarlo en su lugar.");
      return;
    }
    if (window.confirm(`¿Estás seguro de que deseas eliminar permanentemente el "${activePlan?.name}"?`)) {
      const remaining = plans.filter(p => p.id !== activePlanId);
      setPlans(remaining);
      setActivePlanId(remaining[0].id);
    }
    setIsActionMenuOpen(false);
  };

  const parseTimeToDecimal = (timeStr: string) => {
    if (!timeStr) return 0;
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours + (minutes / 60);
  };

  const normalizeText = (text: string) => {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  };

  const filteredCourses = availableCourses.filter(c => {
    const searchNormalized = normalizeText(searchQuery);
    return normalizeText(c.name).includes(searchNormalized) || 
           normalizeText(c.code).includes(searchNormalized);
  }).slice(0, 50);

  const showDropdown = isSearchFocused && availableCourses.length > 0;

  const getGradient = (index: number) => {
    const gradients = [
      'linear-gradient(135deg, #3b82f6, #60a5fa)',
      'linear-gradient(135deg, #8b5cf6, #a78bfa)',
      'linear-gradient(135deg, #10b981, #34d399)',
      'linear-gradient(135deg, #f59e0b, #fbbf24)',
      'linear-gradient(135deg, #ef4444, #f87171)',
    ];
    return gradients[index % gradients.length];
  };

  const scheduleEvents: ScheduleEvent[] = useMemo(() => {
    const rawEvents: ScheduleEvent[] = [];
    
    selectedCourses.forEach((course, index) => {
      const selectedCommName = selectedCommissions[course.code];
      if (!selectedCommName) return;

      const commission = course.commissions.find(c => c.name === selectedCommName);
      if (!commission) return;

      const gradient = getGradient(index);

      commission.classes.forEach((cls, clsIndex) => {
        const start = parseTimeToDecimal(cls.startTime);
        const end = parseTimeToDecimal(cls.endTime);
        const duration = end - start;
        
        if (start > 0 && duration > 0) {
          rawEvents.push({
            id: `${course.code}-${selectedCommName}-${clsIndex}`,
            day: cls.day,
            startHour: start,
            durationHours: duration,
            title: course.name,
            subtitle: `${course.code} • ${cls.location || cls.type}`,
            colorGradient: gradient
          });
        }
      });
    });

    // Handle overlaps and assign column indices
    const overlappedEvents: ScheduleEvent[] = [];
    const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

    days.forEach(day => {
      const dayEvents = rawEvents.filter(e => e.day === day).sort((a, b) => a.startHour - b.startHour);
      const clusters: ScheduleEvent[][] = [];
      let currentCluster: ScheduleEvent[] = [];
      let currentClusterEnd = 0;

      dayEvents.forEach(event => {
        if (currentCluster.length === 0) {
          currentCluster.push(event);
          currentClusterEnd = event.startHour + event.durationHours;
        } else if (event.startHour < currentClusterEnd) {
          currentCluster.push(event);
          currentClusterEnd = Math.max(currentClusterEnd, event.startHour + event.durationHours);
        } else {
          clusters.push(currentCluster);
          currentCluster = [event];
          currentClusterEnd = event.startHour + event.durationHours;
        }
      });
      if (currentCluster.length > 0) {
        clusters.push(currentCluster);
      }

      clusters.forEach(cluster => {
        const columns: ScheduleEvent[][] = [];
        cluster.forEach(event => {
          let placed = false;
          for (let i = 0; i < columns.length; i++) {
            const col = columns[i];
            const lastEvent = col[col.length - 1];
            if (lastEvent.startHour + lastEvent.durationHours <= event.startHour) {
              col.push(event);
              event.colIndex = i;
              placed = true;
              break;
            }
          }
          if (!placed) {
            columns.push([event]);
            event.colIndex = columns.length - 1;
          }
        });
        const totalCols = columns.length;
        cluster.forEach(event => {
          event.totalCols = totalCols;
          overlappedEvents.push(event);
        });
      });
    });

    return overlappedEvents;
  }, [selectedCourses, selectedCommissions]);

  // Export Logic
  const handleExportPNG = async () => {
    setIsActionMenuOpen(false);
    if (!scheduleRef.current) return;
    
    // Temporarily hide the scrollbars or un-needed UI elements (handled by CSS generally, but good practice)
    const canvas = await html2canvas(scheduleRef.current, { 
      backgroundColor: '#090a0f',
      scale: 2 // High-res image
    });
    
    const image = canvas.toDataURL("image/png");
    const link = document.createElement('a');
    link.href = image;
    link.download = `FIUBA_Cronograma_${activePlan?.name || 'Plan'}.png`;
    link.click();
  };

  const handleExportPDF = async () => {
    setIsActionMenuOpen(false);
    if (!scheduleRef.current) return;
    
    const canvas = await html2canvas(scheduleRef.current, { 
      backgroundColor: '#090a0f',
      scale: 2
    });
    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF({
      orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
      unit: 'px',
      format: [canvas.width, canvas.height]
    });
    
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save(`FIUBA_Cronograma_${activePlan?.name || 'Plan'}.pdf`);
  };

  if (!isLoaded) {
    return <div className={styles.container} style={{ justifyContent: 'center', alignItems: 'center' }}><p>Cargando cronograma...</p></div>;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.planSelector}>
          {plans.map(p => (
            <button 
              key={p.id}
              title="Doble clic para renombrar"
              className={`${styles.planBtn} ${activePlanId === p.id ? styles.activePlan : ''}`}
              onClick={() => setActivePlanId(p.id)}
              onDoubleClick={() => handleRenamePlan(p.id, p.name)}
            >
              {p.name}
            </button>
          ))}
          <button className={styles.addPlanBtn} onClick={addNewPlan} title="Crear nuevo plan">+</button>
        </div>

        <div className={styles.actions}>
          <div className={styles.actionDropdownContainer}>
            <button 
              className={styles.secondaryBtn} 
              onClick={() => setIsActionMenuOpen(!isActionMenuOpen)}
              onBlur={() => setTimeout(() => setIsActionMenuOpen(false), 200)}
            >
              Acciones ▼
            </button>
            
            {isActionMenuOpen && (
              <div className={styles.actionDropdownMenu}>
                <button className={styles.dropdownActionBtn} onClick={() => setIsModalOpen(true)}>
                  📥 Importar SIU
                </button>
                <button className={styles.dropdownActionBtn} onClick={handleClearPlan} style={{ color: '#ef4444' }}>
                  🗑️ Vaciar Plan
                </button>
                {plans.length > 1 && (
                  <button className={styles.dropdownActionBtn} onClick={handleDeletePlan} style={{ color: '#ef4444' }}>
                    ❌ Eliminar Plan
                  </button>
                )}
                <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '4px 0' }} />
                <button className={styles.dropdownActionBtn} onClick={handleExportPNG}>
                  🖼️ Exportar como Imagen
                </button>
                <button className={styles.dropdownActionBtn} onClick={handleExportPDF}>
                  📄 Exportar como PDF
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      
      <div className={styles.content}>
        <div className={styles.mainContent} ref={scheduleRef}>
          <ScheduleGrid events={scheduleEvents} />
        </div>
        <aside className={styles.sidePanel}>
          <div className={`glass-card ${styles.card}`}>
            <h3 className={styles.panelTitle}>Materias Seleccionadas</h3>
            {/* Custom Search Bar */}
            <div 
              className={styles.searchContainer} 
              onFocus={() => setIsSearchFocused(true)} 
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            >
              <input 
                type="text" 
                className={styles.searchInput} 
                placeholder={availableCourses.length > 0 ? "Buscar asignatura o código..." : "Pega datos en Importar SIU primero"}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={availableCourses.length === 0}
              />
              {showDropdown && (
                <div className={styles.searchDropdown}>
                  {filteredCourses.length > 0 ? (
                    filteredCourses.map(course => (
                      <div 
                        key={course.code} 
                        className={styles.dropdownItem}
                        onMouseDown={(e) => { 
                          e.preventDefault(); 
                          handleAddCourse(course); 
                        }}
                      >
                        <div className={styles.dropdownInfo}>
                          <span className={styles.dropdownCode}>{course.code}</span>
                          <span className={styles.dropdownName}>{course.name}</span>
                        </div>
                        <span className={styles.dropdownAdd}>+</span>
                      </div>
                    ))
                  ) : (
                    <div className={styles.dropdownEmpty}>No se encontraron resultados</div>
                  )}
                </div>
              )}
            </div>

            <div className={styles.creditsSummary}>
              <span className={styles.creditsCount}>
                {selectedCourses.length > 0 ? selectedCourses.length * 6 : 0}
              </span>
              <span className={styles.creditsLabel}>Créditos Estimados</span>
            </div>
            
            <ul className={styles.courseList}>
              {selectedCourses.length === 0 ? (
                <div className={styles.emptyState}>
                  {availableCourses.length === 0 
                    ? 'Aún no hay materias. Ve a Acciones > Importar SIU para pegar tu oferta de comisiones.'
                    : 'Busca y selecciona una asignatura arriba para agregarla a tu planificación.'}
                </div>
              ) : (
                selectedCourses.map((course, index) => (
                  <div key={course.code} className={styles.courseItemContainer}>
                    <li 
                      className={styles.courseItem} 
                      onClick={() => toggleCourseExpand(course.code)}
                    >
                      <div className={styles.courseColor} style={{ background: getGradient(index), boxShadow: '0 0 10px rgba(255,255,255,0.1)' }}></div>
                      <div className={styles.courseInfo}>
                        <p className={styles.courseName}>{course.name}</p>
                        <p className={styles.courseCode}>
                          {course.code} • {selectedCommissions[course.code] ? <span className={styles.selectedCommBadge}>{selectedCommissions[course.code]}</span> : `${course.commissions.length} Comisiones Disp.`}
                        </p>
                      </div>
                      <button 
                        className={styles.removeBtn}
                        onClick={(e) => { e.stopPropagation(); handleRemoveCourse(course.code); }}
                        title="Quitar materia"
                      >
                        ×
                      </button>
                    </li>
                    
                    {expandedCourse === course.code && (
                      <div className={styles.commissionsList}>
                        {course.commissions.map(comm => {
                          const isSelected = selectedCommissions[course.code] === comm.name;
                          return (
                            <div 
                              key={comm.name} 
                              className={`${styles.commissionItem} ${isSelected ? styles.commissionItemSelected : ''}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectCommission(course.code, comm.name);
                              }}
                            >
                              <div className={styles.commissionHeader}>
                                <div className={styles.commissionTitleGroup}>
                                  <span className={styles.commissionName}>{comm.name}</span>
                                  {isSelected && <span className={styles.commissionCheck}>Seleccionada ✓</span>}
                                </div>
                              </div>
                              {comm.teachers && (
                                <div className={styles.commissionTeachers}>
                                  <span className={styles.teacherLabel}>Docentes: </span>
                                  {comm.teachers}
                                </div>
                              )}
                              <div className={styles.commissionClasses}>
                                {comm.classes.map((cls, i) => (
                                  <span key={i} className={styles.classBadge}>
                                    <strong className={styles.dayStr}>{cls.day.slice(0, 2)}</strong> {cls.startTime}-{cls.endTime}
                                  </span>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))
              )}
            </ul>
          </div>
        </aside>
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2 className={styles.modalTitle}>Importar desde SIU Guaraní</h2>
            <p className={styles.modalDescription}>
              Ve a &quot;Reportes&quot; &gt; &quot;Oferta de comisiones&quot; en tu SIU Guaraní. Selecciona todo el texto de la página (Ctrl+A), cópialo (Ctrl+C) y pégalo aquí abajo (Ctrl+V).
            </p>
            <textarea 
              className={styles.textarea}
              placeholder="Período lectivo: 2025 - 2do Cuatrimestre..."
              value={siuText}
              onChange={(e) => setSiuText(e.target.value)}
            />
            <div className={styles.modalActions}>
              <button className={styles.secondaryBtn} onClick={() => setIsModalOpen(false)}>Cancelar</button>
              <button className={styles.primaryBtn} onClick={handleParse}>
                Procesar Datos
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
