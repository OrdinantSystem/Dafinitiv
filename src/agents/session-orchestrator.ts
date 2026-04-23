import { getExercisesBySection, getOfficialExerciseSequence } from "../domain/testdaf";
import type { CreateSessionInput, Session } from "../domain/types";

function makeSessionId(input: CreateSessionInput): string {
  return "session-" + input.userId + "-" + Date.now();
}

export function createSession(input: CreateSessionInput): Session {
  const queue =
    input.targetExerciseId ? [input.targetExerciseId] :
    input.targetSection ? getExercisesBySection(input.targetSection).map((exercise) => exercise.id) :
    getOfficialExerciseSequence().map((exercise) => exercise.id);

  return {
    id: makeSessionId(input),
    userId: input.userId,
    mode: input.mode,
    status: "pending",
    queue,
    currentIndex: 0,
    targetSection: input.targetSection,
    targetExerciseId: input.targetExerciseId,
    createdAt: new Date().toISOString(),
    rules: {
      allowBacktracking: false,
      immediateFeedback: input.mode === "guided",
      strictTiming: input.mode === "mock",
      textFirst: true
    }
  };
}

export function activateSession(session: Session): Session {
  return {
    ...session,
    status: "active"
  };
}

export function advanceSession(session: Session): Session {
  const nextIndex = session.currentIndex + 1;
  return {
    ...session,
    currentIndex: nextIndex,
    status: nextIndex >= session.queue.length ? "completed" : session.status
  };
}
