import { StorageAdapter } from "./StorageAdapter.js";

const STORAGE_KEY = "smarthomemind_history_v1";

function readRawHistory() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("[LocalStorageAdapter] Corrupt history data, resetting.", err);
    return [];
  }
}

function writeRawHistory(history) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

function generateId() {
  return `assess_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export class LocalStorageAdapter extends StorageAdapter {
  saveAssessment(assessment) {
    const record = {
      ...assessment,
      assessmentId: assessment.assessmentId || generateId(),
      date: assessment.date || new Date().toISOString(),
    };

    const history = readRawHistory();
    history.unshift(record);
    writeRawHistory(history);

    return record;
  }

  getHistory() {
    return readRawHistory();
  }

  getAssessmentById(assessmentId) {
    const history = readRawHistory();
    return history.find((a) => a.assessmentId === assessmentId) || null;
  }

  exportAll() {
    return {
      exportedAt: new Date().toISOString(),
      history: readRawHistory(),
    };
  }
}
