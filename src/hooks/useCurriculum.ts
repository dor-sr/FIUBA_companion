import { useState, useEffect, useMemo } from 'react';
import { industrial2020, Subject } from '../data/industrial2020';

export type SubjectState = 'passed' | 'in-progress' | 'available' | 'locked';

export interface SubjectWithState extends Subject {
  state: SubjectState;
}

const STORAGE_KEY = 'fiuba_companion_curriculum_state';

// Recursive function to check if correlatives are met
const areCorrelativesMet = (
  correlatives: string[],
  passedSubjects: Set<string>,
  totalCredits: number
): boolean => {
  return correlatives.every((corr) => {
    if (corr.startsWith('CRED-')) {
      const requiredCredits = parseInt(corr.split('-')[1], 10);
      return totalCredits >= requiredCredits;
    }
    return passedSubjects.has(corr);
  });
};

export const useCurriculum = () => {
  const [passedIds, setPassedIds] = useState<Set<string>>(new Set());
  const [inProgressIds, setInProgressIds] = useState<Set<string>>(new Set());
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setPassedIds(new Set(parsed.passed || []));
        setInProgressIds(new Set(parsed.inProgress || []));
      }
    } catch (error) {
      console.error('Failed to load curriculum state', error);
    }
    setIsLoaded(true);
  }, []);

  // Save to local storage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          passed: Array.from(passedIds),
          inProgress: Array.from(inProgressIds),
        })
      );
    } catch (error) {
      console.error('Failed to save curriculum state', error);
    }
  }, [passedIds, inProgressIds, isLoaded]);

  // Calculate total credits (ignoring CBC credits if we only count degree credits, but generally we count all assigned credits)
  // According to UBA normally standard credits are used. Actually the doc says 236 credits total.
  // 38 for CBC, 198 for the rest. So yes, we count all passed subjects credits.
  const totalCredits = useMemo(() => {
    let credits = 0;
    const allSubjects = [
      ...industrial2020.flatMap((p) => p.subjects),
      // we might need to handle electives here if we add them to the state properly, 
      // but for now let's just count whatever is passed that is in our data.
    ];
    passedIds.forEach((id) => {
      const subj = allSubjects.find((s) => s.id === id);
      if (subj) credits += subj.credits;
    });
    return credits;
  }, [passedIds]);

  // Compute states for all subjects
  const getSubjectState = (subject: Subject): SubjectState => {
    if (passedIds.has(subject.id)) return 'passed';
    if (inProgressIds.has(subject.id)) return 'in-progress';

    if (areCorrelativesMet(subject.correlatives, passedIds, totalCredits)) {
      return 'available';
    }
    return 'locked';
  };

  const toggleSubjectState = (id: string, newState: 'passed' | 'in-progress' | 'clear') => {
    setPassedIds((prev) => {
      const next = new Set(prev);
      if (newState === 'passed') next.add(id);
      else next.delete(id);
      return next;
    });

    setInProgressIds((prev) => {
      const next = new Set(prev);
      if (newState === 'in-progress') next.add(id);
      else next.delete(id);
      return next;
    });
  };

  return {
    periods: industrial2020,
    totalCredits,
    getSubjectState,
    toggleSubjectState,
    isLoaded,
  };
};
